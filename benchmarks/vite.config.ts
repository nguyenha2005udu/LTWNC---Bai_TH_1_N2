import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ root: 'benchmarks', plugins: [react()], build: { outDir: '../dist-benchmark', emptyOutDir: true } })
