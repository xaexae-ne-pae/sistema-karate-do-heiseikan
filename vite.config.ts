import { defineConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import tailwindcss from 'tailwindcss';
import type { Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const plugins: Plugin[] = [
    react(),
    // Verifique se o plugin componentTagger deve ser adicionado com base no 'mode'
    mode === 'development' ? componentTagger() : null, // Use null em vez de false
    tailwindcss(),
  ].filter((plugin): plugin is Plugin => plugin !== null); // Filtra apenas plugins válidos

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins, // Aqui passamos o array de plugins corretamente
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
