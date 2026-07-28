import { loadEnv } from 'vite';

export const DEFAULT_API_PROXY_TARGET = 'http://192.168.110.217';

export const loadApiEnvironment = ({ mode, envDir }) => {
  const env = loadEnv(mode, envDir, ['VITE_API_URL', 'VITE_API_PROXY_TARGET']);
  return {
    mode,
    apiUrl: env.VITE_API_URL ?? '',
    proxyTarget: env.VITE_API_PROXY_TARGET || DEFAULT_API_PROXY_TARGET,
  };
};

export const formatApiEnvironmentLog = ({ mode, apiUrl, proxyTarget }) =>
  `[vite-api] mode=${mode} apiUrl=${apiUrl} proxyTarget=${proxyTarget}`;
