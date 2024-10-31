/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ rollupTypes: true }), react(), eslint()],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.ts',
      name: 'index',
      fileName: format => {
        if (format === 'es') return 'index.js'; // ES Module
        if (format === 'cjs') return 'index.cjs'; // CommonJS Module
        return 'index.umd.js'; // UMD Module
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into the library.
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
});
