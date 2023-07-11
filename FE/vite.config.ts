import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const aliases = [
  { find: 'router', replacement: 'src/router' },
  { find: 'store', replacement: 'src/store' },
  { find: 'app', replacement: 'src/app' },
  { find: 'commom', replacement: 'src/commom' },
  { find: 'hooks', replacement: 'src/hooks' },
  { find: 'interface', replacement: 'src/interface' },
  { find: 'services', replacement: 'src/services' },
  { find: 'utils', replacement: 'src/utils' },
  { find: 'webvitals', replacement: 'src/webvitals' },
];

export default defineConfig(() => {
  return {
    resolve: {
      alias: aliases.map(alias => ({
        ...alias,
        replacement: path.resolve(__dirname, alias.replacement),
      })),
    },
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
      port: Number(process.env.PORT) || 3000,
    },
    plugins: [react()],
  };
});
