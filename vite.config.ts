import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		minify: 'esbuild',
		rollupOptions: {
			output: {
				manualChunks: {
					mui: ['@mui/material', '@mui/icons-material'],
					react: ['react', 'react-dom'],
					router: ['react-router-dom'],
					query: ['@tanstack/react-query'],
				},
			},
		},
	},
	resolve: {
		alias: {
			'~': resolve(__dirname, './src'),
		},
	},
});
