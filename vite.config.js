import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // build:{
  //   emptyOutDir: true,
  //   outDir:'/Users/seungyeob/IdeaProjects/codehive/src/main/resources/static',
  // }

})
