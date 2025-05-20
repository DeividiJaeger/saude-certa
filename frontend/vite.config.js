import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      usePolling: true, // Fundamental para o hot reload funcionar em Docker
    },
    hmr: {
      clientPort: 3001, // Porta exposta no docker-compose
      host: 'localhost', // Ou o host em que sua aplicação está rodando
    }
  },
})
