import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages hosts this repository under /Greenstep/; local and other hosts use /.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Greenstep/' : '/',
  plugins: [react(), tailwindcss()],
});
