// vite.config.js
import { defineConfig } from "file:///C:/Users/renor/OneDrive/Im%C3%A1genes/Escritorio/MananaSeguro/MananaSeguro/CreditRoot/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/renor/OneDrive/Im%C3%A1genes/Escritorio/MananaSeguro/MananaSeguro/CreditRoot/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/renor/OneDrive/Im%C3%A1genes/Escritorio/MananaSeguro/MananaSeguro/CreditRoot/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/main.jsx",
        "src/index.css",
        "**/*.test.js",
        "**/*.test.jsx",
        "**/dist/**"
      ]
    }
  },
  server: {
    allowedHosts: ["step-trimming-ecology.ngrok-free.dev"],
    proxy: {
      // Proxy específico para cetes-rate
      "/api/cetes-rate": {
        target: "https://stablebonds.etherfuse.com",
        changeOrigin: true,
        rewrite: () => "/bonds"
        // siempre va a /bonds sin importar el path
      },
      // Proxy para la Ramp API (nuevo)
      "/api/etherfuse-ramp": {
        target: "http://localhost:8888",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyZW5vclxcXFxPbmVEcml2ZVxcXFxJbVx1MDBFMWdlbmVzXFxcXEVzY3JpdG9yaW9cXFxcTWFuYW5hU2VndXJvXFxcXE1hbmFuYVNlZ3Vyb1xcXFxDcmVkaXRSb290XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyZW5vclxcXFxPbmVEcml2ZVxcXFxJbVx1MDBFMWdlbmVzXFxcXEVzY3JpdG9yaW9cXFxcTWFuYW5hU2VndXJvXFxcXE1hbmFuYVNlZ3Vyb1xcXFxDcmVkaXRSb290XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9yZW5vci9PbmVEcml2ZS9JbSVDMyVBMWdlbmVzL0VzY3JpdG9yaW8vTWFuYW5hU2VndXJvL01hbmFuYVNlZ3Vyby9DcmVkaXRSb290L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpXSxcclxuICB0ZXN0OiB7XHJcbiAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy9zZXR1cFRlc3RzLmpzJyxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiBcInY4XCIsXHJcbiAgICAgIHJlcG9ydGVyOiBbXCJ0ZXh0XCIsIFwianNvblwiLCBcImh0bWxcIiwgXCJsY292XCJdLFxyXG4gICAgICBleGNsdWRlOiBbXHJcbiAgICAgICAgXCJub2RlX21vZHVsZXMvXCIsXHJcbiAgICAgICAgXCJzcmMvbWFpbi5qc3hcIixcclxuICAgICAgICBcInNyYy9pbmRleC5jc3NcIixcclxuICAgICAgICBcIioqLyoudGVzdC5qc1wiLFxyXG4gICAgICAgIFwiKiovKi50ZXN0LmpzeFwiLFxyXG4gICAgICAgIFwiKiovZGlzdC8qKlwiLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgYWxsb3dlZEhvc3RzOiBbXCJzdGVwLXRyaW1taW5nLWVjb2xvZ3kubmdyb2stZnJlZS5kZXZcIl0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBQcm94eSBlc3BlY1x1MDBFRGZpY28gcGFyYSBjZXRlcy1yYXRlXHJcbiAgICAgIFwiL2FwaS9jZXRlcy1yYXRlXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9zdGFibGVib25kcy5ldGhlcmZ1c2UuY29tXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6ICgpID0+IFwiL2JvbmRzXCIsIC8vIHNpZW1wcmUgdmEgYSAvYm9uZHMgc2luIGltcG9ydGFyIGVsIHBhdGhcclxuICAgICAgfSxcclxuICAgICAgLy8gUHJveHkgcGFyYSBsYSBSYW1wIEFQSSAobnVldm8pXHJcbiAgICAgIFwiL2FwaS9ldGhlcmZ1c2UtcmFtcFwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODg4OFwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeWIsU0FBUyxvQkFBb0I7QUFDdGQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsRUFDaEMsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixjQUFjLENBQUMsc0NBQXNDO0FBQUEsSUFDckQsT0FBTztBQUFBO0FBQUEsTUFFTCxtQkFBbUI7QUFBQSxRQUNqQixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLE1BQU07QUFBQTtBQUFBLE1BQ2pCO0FBQUE7QUFBQSxNQUVBLHVCQUF1QjtBQUFBLFFBQ3JCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
