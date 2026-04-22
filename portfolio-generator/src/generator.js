// ============================================
// PortfolioForge — Portfolio HTML Generator
// ============================================

function generatePortfolioHTML(data) {
  const theme = THEMES[data.theme] || THEMES.midnight;
  const fonts = FONT_FAMILY[data.font] || FONT_FAMILY.syne;
  const fontImport = FONT_IMPORTS[data.font] || FONT_IMPORTS.syne;
  const accent = data.accent || '#7c3aed';
  const initials = data.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

  // Build sections
  const sections = [];
  if (data.sections.includes('hero'))     sections.push(buildHero(data, theme, fonts, accent, initials));
  if (data.sections.includes('about'))    sections.push(buildAbout(data, theme, fonts, accent));
  if (data.sections.includes('skills'))   sections.push(buildSkills(data, theme, fonts, accent));
  if (data.sections.includes('projects')) sections.push(buildProjects(data, theme, fonts, accent));
  if (data.sections.includes('contact'))  sections.push(buildContact(data, theme, fonts, accent));

  const animCSS = data.animations.fade ? `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  ` : '';

  const cursorCSS = data.animations.cursor ? `
    * { cursor: none !important; }
    .custom-cursor {
      position: fixed; width: 14px; height: 14px;
      background: ${accent}; border-radius: 50%;
      pointer-events: none; z-index: 9999;
      transform: translate(-50%,-50%);
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    }
  ` : '';

  const hoverCSS = data.animations.hover ? `
    .project-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .skill-pill { transition: transform 0.15s ease, border-color 0.15s ease; }
    .skill-pill:hover { transform: scale(1.05); border-color: ${accent}; }
    .nav-link { transition: color 0.2s; }
    .nav-link:hover { color: ${accent}; }
  ` : '';

  const layoutCSS = buildLayoutCSS(data.layout, theme, fonts, accent);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name} — Portfolio</title>
  ${fontImport}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${theme.bg};
      --bg2: ${theme.bg2};
      --bg3: ${theme.bg3};
      --text: ${theme.text};
      --muted: ${theme.textMuted};
      --border: ${theme.border};
      --accent: ${accent};
      --accent-rgb: ${hexToRgb(accent)};
      --font-head: ${fonts.head};
      --font-body: ${fonts.body};
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${animCSS}
    ${cursorCSS}
    ${hoverCSS}
    ${layoutCSS}
  </style>
</head>
<body>
  ${data.animations.cursor ? '<div class="custom-cursor" id="cursor"></div>' : ''}
  ${buildNav(data, theme, accent, fonts)}
  ${sections.join('\n')}
  ${buildFooter(data, theme, accent)}
  ${buildScripts(data)}
</body>
</html>`;
}

// ---- NAV ----
function buildNav(data, theme, accent, fonts) {
  const links = data.sections.map(s => {
    const labels = { hero:'Home', about:'About', skills:'Skills', projects:'Projects', contact:'Contact' };
    if (!labels[s]) return '';
    return `<a href="#${s}" class="nav-link">${labels[s]}</a>`;
  }).join('');
  return `
<nav style="position:sticky;top:0;z-index:100;background:${theme.bg}ee;backdrop-filter:blur(20px);border-bottom:1px solid ${theme.border};padding:16px 40px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-family:var(--font-head);font-weight:800;font-size:18px;">${data.name.split(' ')[0]}<span style="color:var(--accent)">.</span></span>
  <div style="display:flex;gap:24px;font-size:14px;">${links}</div>
</nav>`;
}

// ---- HERO ----
function buildHero(data, theme, fonts, accent, initials) {
  const photo = data.photo
    ? `<img src="${data.photo}" alt="${data.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid ${accent};margin-bottom:24px;" />`
    : `<div style="width:120px;height:120px;border-radius:50%;background:${accent};display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:40px;font-weight:800;color:#fff;margin-bottom:24px;">${initials}</div>`;

  const typingSpan = data.animations.typing
    ? `<span id="typed-title" style="color:${accent}"></span>`
    : `<span style="color:${accent}">${data.title}</span>`;

  const social = buildSocialLinks(data, accent);

  return `
<section id="hero" style="min-height:85vh;display:flex;align-items:center;justify-content:center;background:${theme.heroGradient};padding:80px 40px;text-align:center;">
  <div class="reveal" style="max-width:700px;">
    ${photo}
    <h1 style="font-family:var(--font-head);font-size:clamp(40px,6vw,72px);font-weight:800;letter-spacing:-2px;line-height:1.05;margin-bottom:12px;">
      ${data.name}
    </h1>
    <h2 style="font-size:clamp(18px,2.5vw,24px);color:var(--muted);font-weight:400;margin-bottom:20px;">
      ${typingSpan}
    </h2>
    ${data.location ? `<p style="color:var(--muted);margin-bottom:20px;font-size:14px;">📍 ${data.location}</p>` : ''}
    <p style="font-size:18px;color:var(--muted);max-width:500px;margin:0 auto 32px;line-height:1.7;">${data.bio}</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:32px;">
      ${data.sections.includes('projects') ? `<a href="#projects" style="background:${accent};color:#fff;padding:14px 32px;border-radius:100px;font-size:15px;font-weight:600;">View Work →</a>` : ''}
      ${data.sections.includes('contact') ? `<a href="#contact" style="background:transparent;border:2px solid ${theme.border};color:var(--text);padding:14px 32px;border-radius:100px;font-size:15px;">Contact Me</a>` : ''}
      ${data.sections.includes('resume') ? `<a href="resume.pdf" download style="background:transparent;border:2px solid ${accent};color:${accent};padding:14px 32px;border-radius:100px;font-size:15px;">⬇ Resume</a>` : ''}
    </div>
    ${social}
  </div>
</section>`;
}

// ---- ABOUT ----
function buildAbout(data, theme, fonts, accent) {
  return `
<section id="about" style="padding:100px 40px;max-width:800px;margin:0 auto;">
  <div class="reveal">
    <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${accent};margin-bottom:12px;">About Me</p>
    <h2 style="font-family:var(--font-head);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:28px;">Who I Am</h2>
    <p style="font-size:18px;color:var(--muted);line-height:1.8;">${data.bio}</p>
    ${data.location || data.email ? `
    <div style="display:flex;gap:24px;margin-top:32px;flex-wrap:wrap;">
      ${data.location ? `<div style="background:${theme.bg2};border:1px solid ${theme.border};border-radius:12px;padding:16px 20px;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:4px;">Location</div><div style="font-weight:600;">📍 ${data.location}</div></div>` : ''}
      ${data.email ? `<div style="background:${theme.bg2};border:1px solid ${theme.border};border-radius:12px;padding:16px 20px;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:4px;">Email</div><div style="font-weight:600;">✉ <a href="mailto:${data.email}">${data.email}</a></div></div>` : ''}
    </div>` : ''}
  </div>
</section>`;
}

// ---- SKILLS ----
function buildSkills(data, theme, fonts, accent) {
  if (!data.skills.length) return '';
  const categories = [...new Set(data.skills.map(s => s.category))];
  const catHtml = categories.map(cat => {
    const catSkills = data.skills.filter(s => s.category === cat);
    const pills = catSkills.map(sk => {
      const dots = Array.from({length:5},(_,i) =>
        `<span style="width:6px;height:6px;border-radius:50%;background:${i < sk.level ? accent : theme.border};display:inline-block;"></span>`
      ).join('');
      return `<div class="skill-pill" style="display:flex;align-items:center;gap:10px;background:${theme.bg2};border:1px solid ${theme.border};border-radius:100px;padding:8px 16px;font-size:14px;">
        <span>${sk.name}</span>
        <div style="display:flex;gap:3px;">${dots}</div>
      </div>`;
    }).join('');
    const labels = { frontend:'Frontend', backend:'Backend', devops:'DevOps', design:'Design', tools:'Tools', soft:'Soft Skills', other:'Other' };
    return `<div style="margin-bottom:32px;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:16px;">${labels[cat]||cat}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">${pills}</div>
    </div>`;
  }).join('');
  return `
<section id="skills" style="padding:100px 40px;background:${theme.bg2};">
  <div style="max-width:900px;margin:0 auto;" class="reveal">
    <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${accent};margin-bottom:12px;">Expertise</p>
    <h2 style="font-family:var(--font-head);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:48px;">Skills & Tools</h2>
    ${catHtml}
  </div>
</section>`;
}

// ---- PROJECTS ----
function buildProjects(data, theme, fonts, accent) {
  if (!data.projects.length) return '';
  const featured = data.projects.filter(p => p.featured);
  const regular  = data.projects.filter(p => !p.featured);

  const projectCard = (p, large=false) => {
    const img = p.img
      ? `<div style="height:${large?'220':'160'}px;background:url('${p.img}') center/cover no-repeat;border-radius:12px 12px 0 0;"></div>`
      : `<div style="height:${large?'220':'160'}px;background:linear-gradient(135deg,${theme.bg3},${accent}33);display:flex;align-items:center;justify-content:center;border-radius:12px 12px 0 0;font-size:40px;">💻</div>`;
    const techTags = p.tech.map(t =>
      `<span style="background:${theme.bg3};border:1px solid ${theme.border};border-radius:4px;padding:3px 10px;font-size:12px;color:var(--muted);">${t}</span>`
    ).join('');
    const links = [
      p.url    ? `<a href="${p.url}" target="_blank" style="font-size:13px;color:${accent};">🔗 Live Demo</a>` : '',
      p.github ? `<a href="${p.github}" target="_blank" style="font-size:13px;color:var(--muted);">⌥ GitHub</a>` : ''
    ].filter(Boolean).join('&nbsp;·&nbsp;');
    return `
<div class="project-card" style="background:${theme.cardBg};border:1px solid ${p.featured ? accent : theme.border};border-radius:16px;overflow:hidden;">
  ${img}
  <div style="padding:20px;">
    ${p.featured ? `<span style="font-size:10px;background:${accent};color:#fff;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;display:inline-block;margin-bottom:8px;">★ Featured</span>` : ''}
    <h3 style="font-family:var(--font-head);font-size:20px;font-weight:700;margin-bottom:8px;">${p.title}</h3>
    <p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:12px;">${p.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${techTags}</div>
    <div style="display:flex;gap:4px;align-items:center;">${links}</div>
  </div>
</div>`;
  };

  const featuredGrid = featured.length
    ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:24px;margin-bottom:24px;">${featured.map(p => projectCard(p, true)).join('')}</div>`
    : '';
  const regularGrid = regular.length
    ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">${regular.map(p => projectCard(p)).join('')}</div>`
    : '';

  return `
<section id="projects" style="padding:100px 40px;">
  <div style="max-width:1100px;margin:0 auto;" class="reveal">
    <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${accent};margin-bottom:12px;">Work</p>
    <h2 style="font-family:var(--font-head);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:48px;">Projects</h2>
    ${featuredGrid}
    ${regularGrid}
  </div>
</section>`;
}

// ---- CONTACT ----
function buildContact(data, theme, fonts, accent) {
  const socials = buildSocialLinks(data, accent, true);
  return `
<section id="contact" style="padding:100px 40px;background:${theme.bg2};">
  <div style="max-width:600px;margin:0 auto;text-align:center;" class="reveal">
    <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${accent};margin-bottom:12px;">Get In Touch</p>
    <h2 style="font-family:var(--font-head);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:20px;">Let's Talk</h2>
    <p style="color:var(--muted);font-size:18px;margin-bottom:40px;">Have a project in mind or want to collaborate? I'd love to hear from you.</p>
    ${data.email ? `<a href="mailto:${data.email}" style="display:inline-block;background:${accent};color:#fff;padding:16px 40px;border-radius:100px;font-size:16px;font-weight:600;margin-bottom:40px;">✉ Send Email</a>` : ''}
    ${socials}
  </div>
</section>`;
}

// ---- FOOTER ----
function buildFooter(data, theme, accent) {
  return `
<footer style="padding:30px 40px;border-top:1px solid ${theme.border};text-align:center;color:${theme.textMuted};font-size:13px;">
  Built with PortfolioForge · © ${new Date().getFullYear()} ${data.name}
</footer>`;
}

// ---- SOCIAL LINKS ----
function buildSocialLinks(data, accent, large=false) {
  const links = [
    { url: data.github,   icon: 'GH',  label: 'GitHub'   },
    { url: data.linkedin, icon: 'in',  label: 'LinkedIn' },
    { url: data.twitter,  icon: 'X',   label: 'Twitter'  },
    { url: data.website,  icon: '🌐',  label: 'Website'  },
  ].filter(l => l.url);
  if (!links.length) return '';
  const size = large ? '44px' : '36px';
  return `<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    ${links.map(l => `<a href="${l.url}" target="_blank" title="${l.label}" style="width:${size};height:${size};border-radius:50%;border:1px solid ${accent}33;display:flex;align-items:center;justify-content:center;font-size:13px;color:${accent};font-weight:700;text-decoration:none;">${l.icon}</a>`).join('')}
  </div>`;
}

// ---- LAYOUT CSS ----
function buildLayoutCSS(layout, theme, fonts, accent) {
  if (layout === 'sidebar') {
    return `
      @media(min-width:900px){
        body > nav { display: none; }
        body { display: grid; grid-template-columns: 280px 1fr; }
        .sidebar-nav { position: sticky; top: 0; height: 100vh; overflow-y: auto; background: ${theme.bg2}; border-right: 1px solid ${theme.border}; padding: 40px 28px; grid-row: 1/100; display: flex; flex-direction: column; }
      }`;
  }
  if (layout === 'minimal') {
    return `
      section { border-bottom: 1px solid ${theme.border}; }
      h1, h2 { letter-spacing: -2px; }`;
  }
  if (layout === 'magazine') {
    return `
      #projects .project-card:first-child { grid-column: span 2; }
      @media(max-width:700px){ #projects .project-card:first-child { grid-column: span 1; }}`;
  }
  return ''; // hero default
}

// ---- SCRIPTS ----
function buildScripts(data) {
  const typingScript = data.animations.typing ? `
<script>
  const titles = ${JSON.stringify(data.title ? data.title.split('/').map(t=>t.trim()) : ['Developer'])};
  let ti=0,ci=0,del=false;
  const el = document.getElementById('typed-title');
  if(el){
    setInterval(()=>{
      const t=titles[ti];
      if(!del){
        el.textContent=t.substring(0,++ci);
        if(ci===t.length){del=true;setTimeout(()=>{},1200);}
      } else {
        el.textContent=t.substring(0,--ci);
        if(ci===0){del=false;ti=(ti+1)%titles.length;}
      }
    },80);
  }
<\/script>` : '';

  const scrollScript = data.animations.fade ? `
<script>
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
<\/script>` : '';

  const cursorScript = data.animations.cursor ? `
<script>
  const cursor = document.getElementById('cursor');
  if(cursor) document.addEventListener('mousemove',e=>{
    cursor.style.left = e.clientX+'px';
    cursor.style.top  = e.clientY+'px';
  });
<\/script>` : '';

  return typingScript + scrollScript + cursorScript;
}

// ---- UTILS ----
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
