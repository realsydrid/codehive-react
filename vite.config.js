import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: '/Users/hyese/Desktop/workspace/teamProject/BIT-HIVE-Team.codehive-/src/main/resources/static'
  }
});
