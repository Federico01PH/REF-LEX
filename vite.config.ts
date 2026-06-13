/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Sito servito nella radice del dominio (Netlify: ref-lex.netlify.app).
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'REF-LEX — Le leggi e la tua vita',
        short_name: 'REF-LEX',
        description: 'Scopri come le leggi cambiano la tua vita. Anonimo, i dati restano sul tuo dispositivo.',
        lang: 'it',
        theme_color: '#0E2433',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          { src: 'icona-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icona-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icona-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts']
  }
});
