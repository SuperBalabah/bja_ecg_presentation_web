/**
 * BJA 2025 ECG-MACE Interactive Medical Presentation Script
 * Features: Dark/Light Mode, Bilingual ZH/EN, Interactive Flip Cards, Animated Charts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initMemeFlip();
  initTabs();
  initScriptToggles();
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
// 3. Interactive Meme Flip Card (Pikachu vs CVC)
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
        ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> <span class="lang-zh">點擊變回黑影題目</span><span class="lang-en">Click to Hide</span>`
        : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> <span class="lang-zh">點擊揭曉真相答案！</span><span class="lang-en">Click to Reveal Answer!</span>`;
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
// 4. Tab Navigation System
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
// 5. Presenter Script Collapsible Box
// ==========================================
function initScriptToggles() {
  document.querySelectorAll('.script-header').forEach(header => {
    header.addEventListener('click', () => {
      const box = header.closest('.script-box');
      const content = box.querySelector('.script-content');
      if (content) {
        const isOpen = content.style.display !== 'none';
        content.style.display = isOpen ? 'none' : 'block';
        const icon = header.querySelector('.script-icon');
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      }
    });
  });
}

// ==========================================
// 6. Smooth Scroll & Active Sidebar Link
// ==========================================
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-item a');
  const sections = document.querySelectorAll('.section-container');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
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
// 7. Animated Visual Bars on Scroll
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
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ==========================================
// 8. Keyboard Presentation Navigation (Up / Down)
// ==========================================
function initKeyboardNav() {
  const sections = Array.from(document.querySelectorAll('.section-container'));
  let currentIndex = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentIndex < sections.length - 1) {
        currentIndex++;
        sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentIndex > 0) {
        currentIndex--;
        sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
