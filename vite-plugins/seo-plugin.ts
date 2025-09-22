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
  return {
    name: 'vite-seo-plugin',
    apply: 'build',
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