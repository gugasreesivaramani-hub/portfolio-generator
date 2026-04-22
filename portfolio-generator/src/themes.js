// ============================================
// PortfolioForge — Theme Definitions
// ============================================

const THEMES = {
  midnight: {
    bg: '#0a0a0f',
    bg2: '#12121a',
    bg3: '#1a1a28',
    text: '#e8e8f0',
    textMuted: '#7a7a9a',
    border: 'rgba(255,255,255,0.08)',
    heroGradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a28 100%)',
    cardBg: '#12121a'
  },
  arctic: {
    bg: '#f8fafc',
    bg2: '#f0f4f8',
    bg3: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    border: 'rgba(0,0,0,0.08)',
    heroGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    cardBg: '#ffffff'
  },
  forest: {
    bg: '#0a120a',
    bg2: '#0f1f0f',
    bg3: '#162416',
    text: '#e8f0e8',
    textMuted: '#6a8a6a',
    border: 'rgba(255,255,255,0.07)',
    heroGradient: 'linear-gradient(135deg, #0a120a 0%, #162416 100%)',
    cardBg: '#0f1f0f'
  },
  ember: {
    bg: '#0f0800',
    bg2: '#1a1000',
    bg3: '#261800',
    text: '#f0e8d0',
    textMuted: '#a08050',
    border: 'rgba(255,200,100,0.1)',
    heroGradient: 'linear-gradient(135deg, #0f0800 0%, #261800 100%)',
    cardBg: '#1a1000'
  },
  ocean: {
    bg: '#020d1a',
    bg2: '#041525',
    bg3: '#081e30',
    text: '#e0eaf5',
    textMuted: '#5a8aaa',
    border: 'rgba(100,180,255,0.1)',
    heroGradient: 'linear-gradient(135deg, #020d1a 0%, #081e30 100%)',
    cardBg: '#041525'
  },
  paper: {
    bg: '#fafaf7',
    bg2: '#f5f2ed',
    bg3: '#ede8e0',
    text: '#1a1208',
    textMuted: '#7a6a50',
    border: 'rgba(0,0,0,0.1)',
    heroGradient: 'linear-gradient(135deg, #fafaf7 0%, #f5f2ed 100%)',
    cardBg: '#ffffff'
  }
};

const FONT_IMPORTS = {
  syne: `<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">`,
  fraunces: `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">`,
  mono: `<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Syne:wght@700;800&display=swap" rel="stylesheet">`
};

const FONT_FAMILY = {
  syne:     { head: "'Syne', sans-serif",     body: "'DM Sans', sans-serif" },
  fraunces: { head: "'Fraunces', serif",      body: "'DM Sans', sans-serif" },
  mono:     { head: "'Syne', sans-serif",     body: "'DM Mono', monospace"  }
};
