/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'REF-LEX — Le leggi e la tua vita',
        short_name: 'REF-LEX',
        description: 'Scopri come le leggi cambiano la tua vita. Anonimo, i dati restano sul tuo dispositivo.',
        lang: 'it',
        theme_color: '#1A3A8F',
        background_color: '#F2F5FB',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts']
  }
});
