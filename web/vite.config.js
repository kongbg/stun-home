import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVitePlugins(),
  ],
  css: {
    preprocessorOptions: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
      scss: {
        // 这里添加Sass全局样式文件路径等配置
      }
    }
  },
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // 设置路径
      '~': path.resolve(__dirname, './'),
      // 设置别名
      '@': path.resolve(__dirname, './src')
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    hmr: true,
    host: true,
    open: true,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/api': {
        target: 'http://127.0.0.1:3006',
        // rewrite: (p) => p.replace(/^\/api/, ''),
        secure: false,
      }
    }
  },
})
