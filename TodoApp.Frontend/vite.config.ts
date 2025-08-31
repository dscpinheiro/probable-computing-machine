import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Environment variable set by Aspire.
  // In a PROD environment, this would also be HTTPS and configured by whatever deployment mechanism used.
  const backendUrl = env.services__backend__http__0;
  if (!backendUrl) {
    throw new Error('Backend for the TODOs API is not defined');
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/todos': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
});
