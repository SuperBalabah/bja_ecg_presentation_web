/**
 * BJA 2025 ECG-MACE Interactive Medical Presentation Script
 * Features: Drawer Navigation, Collapsible Deep Dives, Dark/Light Theme, Bilingual, Charts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initDrawerNavigation();
  initCollapsibles();
  initDecisionTree();
  initMemeFlip();
  initTabs();
  initSmoothScroll();
  initIntersectionAnimations();
  initKeyboardNav();
});

// ==========================================
// 1. Theme Management (Dark / Light)
// ==========================================
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('bja_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bja_theme', next);
    });
  }
}

// ==========================================
// 2. Language Switcher (ZH / EN)
// ==========================================
function initLanguage() {
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('bja_lang') || 'zh';
  document.documentElement.setAttribute('data-lang', savedLang);
  updateLangButtons(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.lang;
      document.documentElement.setAttribute('data-lang', targetLang);
      localStorage.setItem('bja_lang', targetLang);
      updateLangButtons(targetLang);
    });
  });
}

function updateLangButtons(activeLang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === activeLang);
  });
}

// ==========================================
// 3. Collapsible Drawer Sidebar Navigation
// ==========================================
function initDrawerNavigation() {
  const navToggle = document.getElementById('navToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const sidebar = document.getElementById('sidebarDrawer');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.nav-item a');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openSidebar);
  if (closeDrawer) closeDrawer.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // ESC to close drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

// ==========================================
// 4. Collapsible Deep-Dive Sections (Accordions)
// ==========================================
function toggleCollapse(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.toggle('collapsed');
  const hint = el.querySelector('.expand-hint-badge');
  if (hint) {
    const isCollapsed = el.classList.contains('collapsed');
    const isZh = document.documentElement.getAttribute('data-lang') === 'zh';
    hint.textContent = isCollapsed ? (isZh ? '點擊展開' : 'Expand') : (isZh ? '點擊收起' : 'Collapse');
  }
}
window.toggleCollapse = toggleCollapse;

function initCollapsibles() {
  document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

// ==========================================
// 5. Interactive Meme Flip Card (Pikachu vs CVC)
// ==========================================
function initMemeFlip() {
  const memeCard = document.getElementById('memeCard');
  const memeHint = document.getElementById('memeHint');
  const memeStateBadge = document.getElementById('memeStateBadge');

  if (!memeCard) return;

  function toggleMeme() {
    memeCard.classList.toggle('revealed');
    const isRevealed = memeCard.classList.contains('revealed');

    if (memeHint) {
      memeHint.innerHTML = isRevealed 
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> <span class="lang-zh">點擊變回黑影題目</span><span class="lang-en">Click to Hide</span>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> <span class="lang-zh">點擊揭曉真相答案！</span><span class="lang-en">Click to Reveal Answer!</span>`;
    }

    if (memeStateBadge) {
      memeStateBadge.className = isRevealed ? 'badge badge-danger' : 'badge badge-warning';
      memeStateBadge.innerHTML = isRevealed
        ? `<span class="lang-zh">揭曉：CVC 置入圖！</span><span class="lang-en">Revealed: CVC Line!</span>`
        : `<span class="lang-zh">題目：我是誰？</span><span class="lang-en">Question: Who's that?</span>`;
    }
  }

  memeCard.addEventListener('click', toggleMeme);
  if (memeHint) memeHint.addEventListener('click', toggleMeme);
}

// ==========================================
// 6. Tab Navigation System
// ==========================================
function initTabs() {
  document.querySelectorAll('.tab-container').forEach(container => {
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabPanes = container.querySelectorAll('.tab-pane');

    tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        if (tabPanes[index]) {
          tabPanes[index].classList.add('active');
        }
      });
    });
  });
}

// ==========================================
// 7. Smooth Scroll & Active Link Detection
// ==========================================
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-item a');
  const sections = document.querySelectorAll('.section-container');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (window.pageYOffset >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  });
}

// ==========================================
// 8. Animated Visual Bars on Scroll
// ==========================================
function initIntersectionAnimations() {
  const bars = document.querySelectorAll('.bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.dataset.width;
        if (targetWidth) {
          entry.target.style.width = targetWidth;
        }
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ==========================================
// 9. Keyboard Presentation Navigation (Up/Down/PgUp/PgDn)
// ==========================================
function initKeyboardNav() {
  const sections = Array.from(document.querySelectorAll('.section-container'));
  let currentIndex = 0;

  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', 'j'].includes(e.key)) {
      if (currentIndex < sections.length - 1) {
        currentIndex++;
        sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (['ArrowUp', 'PageUp', 'k'].includes(e.key)) {
      if (currentIndex > 0) {
        currentIndex--;
        sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// ==========================================
// 10. Interactive Decision Tree (Anesthesiologist Classifier)
// ==========================================
function initDecisionTree() {
  const treeWrapper = document.getElementById('decisionTreeWrapper');
  const treeCanvas = document.getElementById('treeCanvas');
  const nextBtn = document.getElementById('treeNextBtn');
  const resetBtn = document.getElementById('treeResetBtn');
  const stepIndicator = document.getElementById('treeStepIndicator');

  if (!treeWrapper) return;

  let currentStep = 0;
  const maxStep = 4;

  const stepDescriptions = [
    { zh: 'Step 0 / 4 (點擊開始)', en: 'Step 0 / 4 (Click to Start)' },
    { zh: 'Step 1 / 4: 性別判定 ➔【★ 女】', en: 'Step 1 / 4: Gender ➔ Female' },
    { zh: 'Step 2 / 4: 職級判定 ➔【★ R 住院醫師】', en: 'Step 2 / 4: Rank ➔ Resident (R)' },
    { zh: 'Step 3 / 4: 年資判定 ➔【★ Senior R】', en: 'Step 3 / 4: Seniority ➔ Senior R' },
    { zh: 'Step 4 / 4: 🎯 判定輸出：李孟柔 醫師！', en: 'Step 4 / 4: 🎯 Output: Dr. Meng-Jou Lee!' }
  ];

  function updateTree() {
    for (let i = 1; i <= maxStep; i++) {
      const elems = treeWrapper.querySelectorAll(`.step-${i}`);
      elems.forEach(el => {
        if (i <= currentStep) {
          el.classList.add('step-visible');
        } else {
          el.classList.remove('step-visible');
        }
      });
    }

    if (stepIndicator) {
      const isZh = document.documentElement.getAttribute('data-lang') === 'zh';
      stepIndicator.textContent = isZh ? stepDescriptions[currentStep].zh : stepDescriptions[currentStep].en;
    }

    if (nextBtn) {
      const isZh = document.documentElement.getAttribute('data-lang') === 'zh';
      if (currentStep === maxStep) {
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> <span>${isZh ? '重新演練' : 'Replay'}</span>`;
      } else if (currentStep === maxStep - 1) {
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> <span>${isZh ? '揭曉目標！' : 'Reveal Target!'}</span>`;
      } else {
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> <span>${isZh ? '下一步分支' : 'Next Split'}</span>`;
      }
    }
  }

  function nextStep() {
    if (currentStep < maxStep) {
      currentStep++;
    } else {
      currentStep = 0;
    }
    updateTree();
  }

  function resetTree() {
    currentStep = 0;
    updateTree();
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextStep();
  });

  if (resetBtn) resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetTree();
  });

  if (treeCanvas) treeCanvas.addEventListener('click', () => {
    nextStep();
  });

  // Re-update on language switch
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(updateTree, 50);
    });
  });

  updateTree();
}
