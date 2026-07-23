import { pathToFileURL } from 'node:url';

const targetStorybookIndexes = [
  'http://localhost:6006/index.json',
  'http://localhost:6007/index.json',
  'http://localhost:6008/index.json',
  'http://localhost:6009/index.json',
];

async function isUrlAvailable(url, request, timeoutMs) {
  const controller = new AbortController();
  let timeoutId;
  const requestTimedOut = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      resolve(false);
    }, timeoutMs);
  });
  const requested = Promise.resolve()
    .then(() => request(url, { signal: controller.signal }))
    .then(
      (response) => response.ok,
      () => false,
    );

  try {
    return await Promise.race([requested, requestTimedOut]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function waitForUrls(
  urls,
  {
    request = fetch,
    timeoutMs = 30_000,
    intervalMs = 250,
    now = Date.now,
    pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration)),
  } = {},
) {
  const deadline = now() + timeoutMs;
  let unavailableUrls = [...urls];

  while (now() < deadline) {
    const requestTimeoutMs = Math.max(1, deadline - now());
    const availability = await Promise.all(
      urls.map((url) => isUrlAvailable(url, request, requestTimeoutMs)),
    );
    unavailableUrls = urls.filter((_, index) => !availability[index]);

    if (unavailableUrls.length === 0) {
      return;
    }

    const remainingMs = deadline - now();
    if (remainingMs <= 0) {
      break;
    }

    await pause(Math.min(intervalMs, remainingMs));
  }

  throw new Error(
    `Storybook targets were not ready within ${timeoutMs}ms: ${unavailableUrls.join(', ')}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await waitForUrls(targetStorybookIndexes);
}
