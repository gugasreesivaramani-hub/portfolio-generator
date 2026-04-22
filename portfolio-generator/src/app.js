// ============================================
// PortfolioForge — App Logic
// ============================================

const state = {
  currentStep: 1,
  skills: [],
  projects: [],
  theme: 'midnight',
  layout: 'hero',
  font: 'syne',
  accentColor: '#7c3aed',
  sections: ['hero','about','skills','projects','contact'],
  animations: { fade: true, typing: true, hover: true, cursor: false }
};

// Quick-add skill chips
const QUICK_SKILLS = [
  'JavaScript','TypeScript','React','Vue','Python','Node.js',
  'CSS','HTML','Git','Docker','AWS','Figma','SQL','MongoDB'
];

function initQuickSkills() {
  const el = document.getElementById('quick-skills');
  QUICK_SKILLS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'quick-chip';
    btn.textContent = s;
    btn.onclick = () => {
      document.getElementById('skill-name-input').value = s;
      addSkill();
    };
    el.appendChild(btn);
  });
}

function goToStep(n) {
  document.querySelectorAll('.step-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');
  document.querySelector(`[data-step="${n}"]`).classList.add('active');
  state.currentStep = n;
  if (n === 5) buildSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- SKILLS ----
function addSkill() {
  const name = document.getElementById('skill-name-input').value.trim();
  const category = document.getElementById('skill-category').value;
  const level = parseInt(document.getElementById('skill-level').value);
  if (!name) return shake('skill-name-input');
  state.skills.push({ name, category, level });
  document.getElementById('skill-name-input').value = '';
  renderSkills();
}

document.getElementById('skill-level').addEventListener('input', function() {
  document.getElementById('skill-level-display').textContent = this.value;
});

function removeSkill(i) {
  state.skills.splice(i, 1);
  renderSkills();
}

function renderSkills() {
  const list = document.getElementById('skills-list');
  list.innerHTML = '';
  state.skills.forEach((sk, i) => {
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    const dots = Array.from({length:5}, (_,d) =>
      `<span class="tag-dot ${d < sk.level ? 'filled' : ''}"></span>`
    ).join('');
    tag.innerHTML = `
      <span>${sk.name}</span>
      <div class="tag-level">${dots}</div>
      <button onclick="removeSkill(${i})">×</button>
    `;
    list.appendChild(tag);
  });
}

// ---- PROJECTS ----
function addProject() {
  const title = document.getElementById('proj-title').value.trim();
  const desc  = document.getElementById('proj-desc').value.trim();
  if (!title || !desc) return shake('proj-title');
  state.projects.push({
    title,
    desc,
    tech: document.getElementById('proj-tech').value.split(',').map(t=>t.trim()).filter(Boolean),
    url:  document.getElementById('proj-url').value.trim(),
    github: document.getElementById('proj-github').value.trim(),
    img:  document.getElementById('proj-img').value.trim(),
    category: document.getElementById('proj-category').value,
    year: document.getElementById('proj-year').value,
    featured: document.getElementById('proj-featured').checked
  });
  ['proj-title','proj-desc','proj-tech','proj-url','proj-github','proj-img','proj-year'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('proj-featured').checked = false;
  renderProjects();
}

function removeProject(i) {
  state.projects.splice(i, 1);
  renderProjects();
}

function renderProjects() {
  const grid = document.getElementById('projects-list');
  grid.innerHTML = '';
  state.projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = `project-item ${p.featured ? 'featured' : ''}`;
    card.innerHTML = `
      <button class="project-item-remove" onclick="removeProject(${i})">×</button>
      ${p.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
      <div class="project-item-title">${p.title}</div>
      <div class="project-item-desc">${p.desc.substring(0,80)}${p.desc.length>80?'...':''}</div>
      <div class="project-item-tags">
        ${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---- STYLE OPTIONS ----
function selectTheme(el) {
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.theme = el.dataset.theme;
}

function selectLayout(el) {
  document.querySelectorAll('.layout-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.layout = el.dataset.layout;
}

document.querySelectorAll('input[name="font"]').forEach(radio => {
  radio.addEventListener('change', function() {
    document.querySelectorAll('.font-option').forEach(el => el.classList.remove('selected'));
    this.closest('.font-option').classList.add('selected');
    state.font = this.value;
  });
});

document.getElementById('accent-color').addEventListener('input', function() {
  state.accentColor = this.value;
  document.getElementById('accent-hex').textContent = this.value;
});

function setAccent(hex) {
  state.accentColor = hex;
  document.getElementById('accent-color').value = hex;
  document.getElementById('accent-hex').textContent = hex;
}

document.querySelectorAll('.section-toggle').forEach(cb => {
  cb.addEventListener('change', function() {
    if (this.checked) {
      if (!state.sections.includes(this.value)) state.sections.push(this.value);
    } else {
      state.sections = state.sections.filter(s => s !== this.value);
    }
  });
});

['anim-fade','anim-typing','anim-hover','anim-cursor'].forEach(id => {
  document.getElementById(id).addEventListener('change', function() {
    const key = id.replace('anim-', '');
    state.animations[key] = this.checked;
  });
});

// ---- SUMMARY ----
function buildSummary() {
  const name  = document.getElementById('name').value || 'Unnamed';
  const title = document.getElementById('title').value || '—';
  const grid  = document.getElementById('summary');
  grid.innerHTML = `
    <div class="summary-card"><h4>Name</h4><p>${name}<br><span class="sub">${title}</span></p></div>
    <div class="summary-card"><h4>Skills</h4><p>${state.skills.length}<span class="sub"> skills added</span></p></div>
    <div class="summary-card"><h4>Projects</h4><p>${state.projects.length}<span class="sub"> project(s)</span></p></div>
    <div class="summary-card"><h4>Theme</h4><p style="text-transform:capitalize">${state.theme}</p></div>
    <div class="summary-card"><h4>Layout</h4><p style="text-transform:capitalize">${state.layout}</p></div>
    <div class="summary-card"><h4>Sections</h4><p>${state.sections.length}<span class="sub"> sections</span></p></div>
  `;
}

// ---- PREVIEW ----
function openPreview() {
  const html = generatePortfolioHTML(collectData());
  const frame = document.getElementById('preview-frame');
  frame.srcdoc = html;
  document.getElementById('preview-modal').classList.remove('hidden');
}

function closePreview() {
  document.getElementById('preview-modal').classList.add('hidden');
}

// ---- GENERATE ----
function generatePortfolio() {
  const data = collectData();
  const status = document.getElementById('generate-status');
  status.textContent = '⏳ Building your portfolio...';
  setTimeout(() => {
    const zip = buildZip(data);
    status.textContent = '✅ Done! Your download should start shortly.';
  }, 600);
}

function collectData() {
  return {
    name:     document.getElementById('name').value.trim()     || 'Your Name',
    title:    document.getElementById('title').value.trim()    || 'Developer',
    location: document.getElementById('location').value.trim(),
    bio:      document.getElementById('bio').value.trim()      || 'Welcome to my portfolio.',
    email:    document.getElementById('email').value.trim(),
    phone:    document.getElementById('phone').value.trim(),
    github:   document.getElementById('github').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    twitter:  document.getElementById('twitter').value.trim(),
    website:  document.getElementById('website').value.trim(),
    photo:    document.getElementById('photo').value.trim(),
    skills:   state.skills,
    projects: state.projects,
    theme:    state.theme,
    layout:   state.layout,
    font:     state.font,
    accent:   state.accentColor,
    sections: state.sections,
    animations: state.animations
  };
}

// ---- UTILS ----
function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
  setTimeout(() => el.style.animation = '', 400);
}

const shakeCSS = document.createElement('style');
shakeCSS.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)}
}`;
document.head.appendChild(shakeCSS);

// Init
initQuickSkills();
