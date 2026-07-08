/**
 * httpService가 던지는 ApiResponse({ msg }) 또는 일반 에러에서 사용자에게 보여줄 메시지를 뽑는다.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null) {
    const { msg } = error as { msg?: unknown };
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
};
