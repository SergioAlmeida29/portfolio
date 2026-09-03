import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /*
          Três chunks em vez de um ficheiro de 500 kB. Não poupa bytes na
          primeira visita — poupa-os em todas as outras: o código do site muda
          a cada deploy, o react e o motion não, e separados mantêm o cache
          entre versões em vez de o invalidarem por inteiro.
        */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('motion')) return 'motion'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react'
        },
      },
    },
  },
})
