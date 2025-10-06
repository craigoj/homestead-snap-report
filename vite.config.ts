import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import seoPlugin from "./vite-plugins/seo-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    seoPlugin({
      sitemap: {
        entries: [
          {
            loc: '/',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 1.0
          },
          {
            loc: '/auth',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: 0.8
          },
          {
            loc: '/how-to',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: 0.9
          },
          {
            loc: '/dashboard',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: 0.6
          },
          {
            loc: '/properties',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: 0.6
          },
          {
            loc: '/reports',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 0.5
          }
        ],
        prerenderRoutes: ['/', '/auth', '/how-to']
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false, // Faster builds
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}));
