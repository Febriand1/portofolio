import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'restricted-dotfiles-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url.startsWith('/.') || url.includes('/.git') || url.includes('/.env')) {
            res.writeHead(302, { Location: '/restricted' });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
})
