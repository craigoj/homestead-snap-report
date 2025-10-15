// Sitemap generation utilities for React/Vite SEO
export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[], baseUrl = 'https://snapassetai.com'): string => {
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const xmlFooter = '</urlset>';
  
  const urls = entries.map(entry => {
    const url = entry.loc.startsWith('http') ? entry.loc : `${baseUrl}${entry.loc}`;
    return `  <url>
    <loc>${url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`;
  }).join('\n');
  
  return xmlHeader + urls + '\n' + xmlFooter;
};

// Default sitemap entries for HomeGuard
export const defaultSitemapEntries: SitemapEntry[] = [
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
  }
];

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl = 'https://snapassetai.com', sitemapUrl?: string): string => {
  const sitemap = sitemapUrl || `${baseUrl}/sitemap.xml`;
  
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

Sitemap: ${sitemap}
`;
};

// SEO-friendly URL slug generator
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Breadcrumb generator for SEO
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateBreadcrumbStructuredData = (items: BreadcrumbItem[], baseUrl = 'https://snapassetai.com'): string => {
  
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
  
  return JSON.stringify(breadcrumbList);
};