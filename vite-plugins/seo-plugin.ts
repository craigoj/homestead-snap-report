import type { Plugin } from 'vite';
import { generateSitemap, defaultSitemapEntries, generateRobotsTxt } from '../src/lib/sitemap';

export interface SEOPluginOptions {
  sitemap?: {
    entries: Array<{
      loc: string;
      lastmod?: string;
      changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }>;
    filename?: string;
    prerenderRoutes?: string[];
  };
  robotsTxt?: {
    content?: string;
    filename?: string;
  };
  prerender?: {
    routes: string[];
  };
}

export default function seoPlugin(options: SEOPluginOptions = {}): Plugin {
  let outDir: string;
  
  return {
    name: 'vite-seo-plugin',
    apply: 'build',
    
    configResolved(config) {
      outDir = config.build.outDir;
    },
    
    generateBundle() {
      // Generate sitemap.xml
      if (options.sitemap !== undefined) {
        const entries = options.sitemap?.entries || defaultSitemapEntries;
        const sitemapContent = generateSitemap(entries);
        const filename = options.sitemap?.filename || 'sitemap.xml';
        
        this.emitFile({
          type: 'asset',
          fileName: filename,
          source: sitemapContent
        });
      }
      
      // Generate robots.txt
      if (options.robotsTxt !== undefined) {
        const content = options.robotsTxt?.content || generateRobotsTxt();
        const filename = options.robotsTxt?.filename || 'robots.txt';
        
        this.emitFile({
          type: 'asset',
          fileName: filename,
          source: content
        });
      }
    },
    
    async closeBundle() {
      // Prerender static routes for SEO
      const prerenderRoutes = options.sitemap?.prerenderRoutes || options.prerender?.routes || [];
      
      if (prerenderRoutes.length > 0) {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const distPath = path.resolve(process.cwd(), outDir);
          const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
          
          for (const route of prerenderRoutes) {
            if (route !== '/') {
              const routeDir = path.join(distPath, route.slice(1));
              fs.mkdirSync(routeDir, { recursive: true });
              fs.writeFileSync(
                path.join(routeDir, 'index.html'),
                indexHtml,
                'utf-8'
              );
            }
          }
          
          console.log(`✓ Prerendered ${prerenderRoutes.length} static routes for SEO crawlers`);
        } catch (error) {
          console.warn('⚠ Prerender warning:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    },
    
    configureServer(server) {
      // Serve sitemap.xml and robots.txt in development
      server.middlewares.use('/sitemap.xml', (req, res) => {
        const entries = options.sitemap?.entries || defaultSitemapEntries;
        const sitemapContent = generateSitemap(entries);
        
        res.setHeader('Content-Type', 'application/xml');
        res.end(sitemapContent);
      });
      
      server.middlewares.use('/robots.txt', (req, res) => {
        const content = options.robotsTxt?.content || generateRobotsTxt();
        
        res.setHeader('Content-Type', 'text/plain');
        res.end(content);
      });
    }
  };
}