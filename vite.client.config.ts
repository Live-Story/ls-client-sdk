import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist/client', // genera index.d.ts nello stesso dist
      entryRoot: path.resolve(__dirname, 'src/client'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/client/index.ts'),
      name: 'Client',
      fileName: 'index',
      formats: ['es'],
    },
    outDir: 'dist/client',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ]
    },
  },
})
