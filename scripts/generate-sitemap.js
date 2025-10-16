const fs = require('fs');
const path = require('path');

const baseUrl = 'https://snapassetai.com';
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/assessment', changefreq: 'monthly', priority: '0.9' },
  { url: '/how-to', changefreq: 'monthly', priority: '0.8' },
  { url: '/auth', changefreq: 'monthly', priority: '0.7' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { url: '/terms', changefreq: 'yearly', priority: '0.5' },
];

const generateSitemap = () => {
  const date = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${date}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
  console.log('✅ Sitemap generated successfully!');
};

generateSitemap();
