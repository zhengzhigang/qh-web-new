import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import eslint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        WindiCSS(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: './', // 不加打包后白屏
    server: {
        host: '0.0.0.0',
        port: 5172,
        proxy: {
            '^/api': {
                // target: 'https://www.reye.xyz/',
                target: 'http://127.0.0.1:8888/',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '/api')
            },
            '^/neo4j': {
                target: 'http://127.0.0.1:3887/',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/neo4j/, '/neo4j')
            },
        }
        // https: {
        //   key: fs.readFileSync("keys/server.key"),
        //   cert: fs.readFileSync("keys/server.crt"),
        // },
    },
    resolve: {
        // 别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
        alias: {
            '@': path.join(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    }
})
