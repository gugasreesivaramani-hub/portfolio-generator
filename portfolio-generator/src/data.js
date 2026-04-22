// ============================================
// PortfolioForge — ZIP Builder (pure JS, no deps)
// Uses JSZip loaded from CDN
// ============================================

// Load JSZip dynamically
function loadJSZip() {
  return new Promise((resolve, reject) => {
    if (window.JSZip) { resolve(window.JSZip); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = () => resolve(window.JSZip);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function buildZip(data) {
  const JSZip = await loadJSZip();
  const zip = new JSZip();
  const folder = zip.folder('my-portfolio');

  // 1. Main HTML
  const html = generatePortfolioHTML(data);
  folder.file('index.html', html);

  // 2. README
  folder.file('README.md', generateReadme(data));

  // 3. Config JSON (for re-importing / editing)
  folder.file('portfolio-config.json', JSON.stringify(data, null, 2));

  // 4. A separate stylesheet (also embedded in HTML, but standalone for reference)
  folder.file('assets/style-reference.css', generateRefCSS(data));

  // 5. Placeholder resume PDF prompt
  folder.file('assets/resume.pdf.placeholder.txt', 
    'Replace this file with your actual resume.pdf to enable the resume download button.');

  // 6. robots.txt
  folder.file('robots.txt', 'User-agent: *\nAllow: /\n');

  // 7. sitemap.xml
  folder.file('sitemap.xml', generateSitemap(data));

  // 8. meta.json (social share / SEO)
  folder.file('meta.json', JSON.stringify({
    title: `${data.name} — Portfolio`,
    description: data.bio.substring(0, 160),
    og_image: data.photo || '',
    twitter_handle: data.twitter ? data.twitter.split('/').pop() : '',
    canonical: data.website || ''
  }, null, 2));

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name.replace(/\s+/g,'_')}_portfolio.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateReadme(data) {
  return `# ${data.name} — Portfolio

Generated with **PortfolioForge** 🔷

## Quick Start

1. Open \`index.html\` in a browser — it works completely offline!
2. To deploy, upload all files to any static host:
   - **Netlify**: Drag-and-drop the folder at netlify.com/drop
   - **GitHub Pages**: Push to a repo, enable Pages in Settings
   - **Vercel**: Run \`npx vercel\` in the folder
   - **Cloudflare Pages**: Connect your repo

## Structure

\`\`\`
my-portfolio/
├── index.html            ← Your complete portfolio
├── assets/
│   ├── style-reference.css  ← CSS reference (already embedded in HTML)
│   └── resume.pdf.placeholder.txt  ← Replace with your actual PDF
├── portfolio-config.json ← Your data (re-import into PortfolioForge to edit)
├── meta.json             ← SEO & social sharing config
├── robots.txt
├── sitemap.xml
└── README.md
\`\`\`

## Customisation

The \`index.html\` file is self-contained and can be edited directly.
Look for the \`<style>\` block at the top — all CSS variables are defined there.

### Key Variables
\`\`\`css
:root {
  --accent: ${data.accent};   /* Change accent color */
  --font-head: ...;           /* Heading font */
  --font-body: ...;           /* Body font */
}
\`\`\`

## Profile

- **Name**: ${data.name}
- **Title**: ${data.title}
- **Theme**: ${data.theme}
- **Layout**: ${data.layout}
- **Skills**: ${data.skills.length}
- **Projects**: ${data.projects.length}

---
*Built with PortfolioForge — the automatic portfolio generator.*
`;
}

function generateRefCSS(data) {
  return `/*
 * Portfolio Reference CSS
 * Generated for: ${data.name}
 * Theme: ${data.theme} | Accent: ${data.accent}
 *
 * These styles are already embedded inside index.html.
 * This file is provided for reference and manual customisation.
 */

:root {
  --accent: ${data.accent};
  /* Edit the accent color above to quickly restyle your portfolio */
}

/* To change fonts, replace the Google Fonts import in index.html's <head>
   and update the --font-head / --font-body CSS variables */
`;
}

function generateSitemap(data) {
  const base = data.website || 'https://yourportfolio.com';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}
