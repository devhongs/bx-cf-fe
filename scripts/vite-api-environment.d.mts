export interface ApiEnvironment {
  mode: string;
  apiUrl: string;
  proxyTarget: string;
}

export const DEFAULT_API_PROXY_TARGET: string;

export function loadApiEnvironment(options: { mode: string; envDir: string }): ApiEnvironment;

export function formatApiEnvironmentLog(environment: ApiEnvironment): string;
