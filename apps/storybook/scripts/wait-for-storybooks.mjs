import { pathToFileURL } from 'node:url';

const targetStorybookIndexes = [
  'http://localhost:6006/index.json',
  'http://localhost:6007/index.json',
  'http://localhost:6008/index.json',
  'http://localhost:6009/index.json',
];

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

  while (true) {
    const availability = await Promise.all(
      urls.map(async (url) => {
        try {
          return (await request(url)).ok;
        } catch {
          return false;
        }
      }),
    );

    if (availability.every(Boolean)) {
      return;
    }

    if (now() >= deadline) {
      throw new Error(`Storybook targets were not ready within ${timeoutMs}ms.`);
    }

    await pause(intervalMs);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await waitForUrls(targetStorybookIndexes);
}
