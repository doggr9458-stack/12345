import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'google-sheet-proxy',
        configureServer(server) {
          server.middlewares.use('/api/fetch-sheet', async (req, res) => {
            try {
              const urlObj = new URL(req.url || '', 'http://localhost');
              const targetUrl = urlObj.searchParams.get('url');
              if (!targetUrl) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing url parameter' }));
                return;
              }
              const response = await fetch(targetUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                  'Accept': 'text/csv,text/plain,*/*'
                }
              });
              if (!response.ok) {
                res.statusCode = response.status;
                res.end(JSON.stringify({ error: `Failed to fetch: ${response.statusText}` }));
                return;
              }
              const text = await response.text();
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(text);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
