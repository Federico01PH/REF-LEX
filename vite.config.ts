/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Sito servito nella radice del dominio (Vercel: ref-lex.vercel.app).
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'REF-LEX — Le leggi e la tua vita',
        short_name: 'REF-LEX',
        description: 'Scopri come le leggi cambiano la tua vita. Anonimo, i dati restano sul tuo dispositivo.',
        lang: 'it',
        theme_color: '#0E2433',
        background_color: '#FFFFFF',
        display: 'standalone',
        // ?v=2: le icone sono diventate full-bleed (blu fino agli angoli). Cambiare solo
        // il contenuto del file NON forza l'aggiornamento dell'icona su Android (WebAPK),
        // iOS e Google, che la tengono in cache per URL. Versionando l'URL la rivedono come
        // nuova e la riscaricano. Bump a ?v=3 al prossimo cambio di icona.
        icons: [
          { src: 'icona-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icona-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icona-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
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
