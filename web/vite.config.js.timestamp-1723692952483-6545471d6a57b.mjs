// vite.config.js
import { defineConfig } from "file:///E:/test/home/web/node_modules/.pnpm/vite@5.4.0_sass@1.77.8/node_modules/vite/dist/node/index.js";
import path from "path";
import vue2 from "file:///E:/test/home/web/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.0+vue@3.4.37/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwindcss from "file:///E:/test/home/web/node_modules/.pnpm/tailwindcss@3.4.10/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///E:/test/home/web/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.4.41/node_modules/autoprefixer/lib/autoprefixer.js";

// vite/plugins/index.js
import vue from "file:///E:/test/home/web/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.0+vue@3.4.37/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// vite/plugins/auto-import.js
import autoImport from "file:///E:/test/home/web/node_modules/.pnpm/unplugin-auto-import@0.18.2/node_modules/unplugin-auto-import/dist/vite.js";
function createAutoImport() {
  return autoImport({
    imports: [
      "vue",
      "vue-router"
    ],
    dts: false
  });
}

// vite/plugins/index.js
function createVitePlugins() {
  const vitePlugins = [vue()];
  vitePlugins.push(createAutoImport());
  return vitePlugins;
}

// vite.config.js
var __vite_injected_original_dirname = "E:\\test\\home\\web";
var vite_config_default = defineConfig({
  plugins: [
    createVitePlugins()
  ],
  css: {
    preprocessorOptions: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
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
      "~": path.resolve(__vite_injected_original_dirname, "./"),
      // 设置别名
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  server: {
    hmr: true,
    host: true,
    open: true,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      "/api": {
        target: "http://127.0.0.1:3006",
        // rewrite: (p) => p.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAidml0ZS9wbHVnaW5zL2luZGV4LmpzIiwgInZpdGUvcGx1Z2lucy9hdXRvLWltcG9ydC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHRlc3RcXFxcaG9tZVxcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRlc3RcXFxcaG9tZVxcXFx3ZWJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Rlc3QvaG9tZS93ZWIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgY3JlYXRlVml0ZVBsdWdpbnMgZnJvbSAnLi92aXRlL3BsdWdpbnMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgY3JlYXRlVml0ZVBsdWdpbnMoKSxcbiAgXSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgICB9LFxuICAgICAgc2Nzczoge1xuICAgICAgICAvLyBcdThGRDlcdTkxQ0NcdTZERkJcdTUyQTBTYXNzXHU1MTY4XHU1QzQwXHU2ODM3XHU1RjBGXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHU3QjQ5XHU5MTREXHU3RjZFXG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy8jcmVzb2x2ZS1hbGlhc1xuICAgIGFsaWFzOiB7XG4gICAgICAvLyBcdThCQkVcdTdGNkVcdThERUZcdTVGODRcbiAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vJyksXG4gICAgICAvLyBcdThCQkVcdTdGNkVcdTUyMkJcdTU0MERcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9LFxuICAgIC8vIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWcvI3Jlc29sdmUtZXh0ZW5zaW9uc1xuICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcudnVlJ11cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG1yOiB0cnVlLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy8jc2VydmVyLXByb3h5XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTozMDA2JyxcbiAgICAgICAgLy8gcmV3cml0ZTogKHApID0+IHAucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx0ZXN0XFxcXGhvbWVcXFxcd2ViXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcdGVzdFxcXFxob21lXFxcXHdlYlxcXFx2aXRlXFxcXHBsdWdpbnNcXFxcaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Rlc3QvaG9tZS93ZWIvdml0ZS9wbHVnaW5zL2luZGV4LmpzXCI7aW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBjcmVhdGVBdXRvSW1wb3J0IGZyb20gJy4vYXV0by1pbXBvcnQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucygpIHtcclxuICAgIGNvbnN0IHZpdGVQbHVnaW5zID0gW3Z1ZSgpXVxyXG4gICAgdml0ZVBsdWdpbnMucHVzaChjcmVhdGVBdXRvSW1wb3J0KCkpXHJcbiAgICByZXR1cm4gdml0ZVBsdWdpbnNcclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcdGVzdFxcXFxob21lXFxcXHdlYlxcXFx2aXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRlc3RcXFxcaG9tZVxcXFx3ZWJcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGF1dG8taW1wb3J0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi90ZXN0L2hvbWUvd2ViL3ZpdGUvcGx1Z2lucy9hdXRvLWltcG9ydC5qc1wiO2ltcG9ydCBhdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVBdXRvSW1wb3J0KCkge1xyXG4gICAgcmV0dXJuIGF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAgICd2dWUtcm91dGVyJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZHRzOiBmYWxzZVxyXG4gICAgfSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBPLFNBQVMsb0JBQW9CO0FBQ3ZRLE9BQU8sVUFBVTtBQUNqQixPQUFPQSxVQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCOzs7QUNKZ1AsT0FBTyxTQUFTOzs7QUNBSixPQUFPLGdCQUFnQjtBQUU3UixTQUFSLG1CQUFvQztBQUN2QyxTQUFPLFdBQVc7QUFBQSxJQUNkLFNBQVM7QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLElBQ0o7QUFBQSxJQUNBLEtBQUs7QUFBQSxFQUNULENBQUM7QUFDTDs7O0FEUGUsU0FBUixvQkFBcUM7QUFDeEMsUUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDO0FBQzFCLGNBQVksS0FBSyxpQkFBaUIsQ0FBQztBQUNuQyxTQUFPO0FBQ1g7OztBRFBBLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGtCQUFrQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixTQUFTO0FBQUEsUUFDUCxTQUFTLENBQUMsYUFBYSxZQUFZO0FBQUEsTUFDckM7QUFBQSxNQUNBLE1BQU07QUFBQTtBQUFBLE1BRU47QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUEsSUFFUCxPQUFPO0FBQUE7QUFBQSxNQUVMLEtBQUssS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQTtBQUFBLE1BRWpDLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBO0FBQUEsSUFFQSxZQUFZLENBQUMsUUFBUSxPQUFPLE9BQU8sUUFBUSxRQUFRLFNBQVMsTUFBTTtBQUFBLEVBQ3BFO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBLFFBRVIsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInZ1ZSJdCn0K
