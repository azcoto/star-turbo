import path from 'path';
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
export default defineConfig({
    server: {
        port: 8000,
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/app.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild',
            swcOptions: {},
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
