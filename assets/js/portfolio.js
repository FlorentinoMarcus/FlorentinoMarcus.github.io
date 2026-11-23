(() => {
  const intro = document.querySelector('[data-intro]');
  const typedName = document.querySelector('[data-typed-name]');
  const enterButton = document.querySelector('[data-intro-enter]');
  const introIde = document.querySelector('.intro-ide');
  const introPointer = document.querySelector('.intro-pointer');
  const closeControl = document.querySelector('.window-controls span:first-child');
  const pageRegions = [...document.querySelectorAll('.site-header, main, .closing')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const headerWrap = document.querySelector('.site-header .wrap');
  const heroReference = { width: 1280, height: 638 };
  let heroResizeFrame;
  let introFinished = false;
  let typingTimer;
  let autoEnterTimer;
  const syncHeroScale = () => {
    if (!hero) return;
    const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    const availableWidth = headerWrap?.getBoundingClientRect().width || window.innerWidth;
    const availableHeight = Math.max(1, window.innerHeight - navHeight - 28);
    const scale = Math.min(1, availableWidth / heroReference.width, availableHeight / heroReference.height);
    hero.style.setProperty('--hero-scale', scale.toFixed(6));
    hero.style.setProperty('--hero-scaled-height', `${(heroReference.height * scale).toFixed(3)}px`);
  };
  const queueHeroScale = () => {
    window.cancelAnimationFrame(heroResizeFrame);
    heroResizeFrame = window.requestAnimationFrame(syncHeroScale);
  };
  syncHeroScale();
  window.addEventListener('resize', queueHeroScale, { passive: true });
  window.addEventListener('orientationchange', queueHeroScale, { passive: true });
  const resetLandingScroll = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  const completeIntroText = () => {
    if (!typedName || !enterButton) return;
    window.clearTimeout(typingTimer);
    typedName.textContent = typedName.dataset.text || 'Marcus Florentino';
    enterButton.disabled = false;
    enterButton.classList.add('is-ready');
  };
  const handleIntroKey = (event) => {
    if (event.key === 'Escape') {
      completeIntroText();
      finishIntro();
    } else if (event.key === 'Enter' && !enterButton?.disabled) {
      finishIntro();
    }
  };

  const setPageAvailable = (available) => {
    pageRegions.forEach((region) => {
      region.toggleAttribute('inert', !available);
      region.setAttribute('aria-hidden', String(!available));
    });
  };

  const finishIntro = () => {
    if (introFinished || !intro) return;
    introFinished = true;
    window.clearTimeout(typingTimer);
    window.clearTimeout(autoEnterTimer);
    window.removeEventListener('keydown', handleIntroKey);
    const beginExit = () => {
      intro.classList.add('is-exiting');
      resetLandingScroll();
      setPageAvailable(true);
      window.setTimeout(() => {
        document.body.classList.remove('intro-active');
      }, 220);
      window.setTimeout(() => intro.remove(), 650);
    };
    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
    const runPointerSequence = async () => {
      intro.classList.add('is-closing-ide');
      if (!introPointer || !introIde || !enterButton || !closeControl || !introPointer.animate) {
        enterButton?.classList.add('is-pressing');
        await wait(140);
        enterButton?.classList.remove('is-pressing');
        introIde?.classList.add('is-executing');
        await wait(480);
      } else {
        const ideRect = introIde.getBoundingClientRect();
        const enterRect = enterButton.getBoundingClientRect();
        const closeRect = closeControl.getBoundingClientRect();
        const start = {
          x: ideRect.width * .66,
          y: ideRect.height * .42
        };
        const enterTarget = {
          x: enterRect.left - ideRect.left + enterRect.width * .55 - 2,
          y: enterRect.top - ideRect.top + enterRect.height * .5 - 2
        };
        const closeTarget = {
          x: closeRect.left - ideRect.left + closeRect.width * .5 - 2,
          y: closeRect.top - ideRect.top + closeRect.height * .5 - 2
        };
        const pose = (point, scale = 1) => `translate3d(${point.x}px, ${point.y}px, 0) scale(${scale})`;
        const moveEase = 'cubic-bezier(0.77, 0, 0.175, 1)';
        const pressEase = 'cubic-bezier(0.23, 1, 0.32, 1)';

        await introPointer.animate([
          { opacity: 0, transform: pose(start, .96) },
          { opacity: 1, offset: .16 },
          { opacity: 1, transform: pose(enterTarget) }
        ], { duration: 400, easing: moveEase, fill: 'forwards' }).finished;

        enterButton.classList.add('is-pressing');
        await introPointer.animate([
          { transform: pose(enterTarget) },
          { transform: pose(enterTarget, .78), offset: .5 },
          { transform: pose(enterTarget) }
        ], { duration: 140, easing: pressEase, fill: 'forwards' }).finished;
        enterButton.classList.remove('is-pressing');
        introIde.classList.add('is-executing');

        await introPointer.animate([
          { opacity: 1, transform: pose(enterTarget) },
          { opacity: 1, transform: pose(closeTarget) }
        ], { duration: 480, easing: moveEase, fill: 'forwards' }).finished;

        await Promise.all([
          introPointer.animate([
            { transform: pose(closeTarget) },
            { transform: pose(closeTarget, .78), offset: .5 },
            { transform: pose(closeTarget) }
          ], { duration: 140, easing: pressEase, fill: 'forwards' }).finished,
          closeControl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(.66)', offset: .5 },
            { transform: 'scale(1)' }
          ], { duration: 140, easing: pressEase, fill: 'forwards' }).finished
        ]);
      }

      introIde?.classList.add('is-window-closing');
      await wait(200);
      beginExit();
    };
    runPointerSequence().catch(beginExit);
  };

  const readyIntro = () => {
    if (!enterButton || introFinished) return;
    completeIntroText();
    autoEnterTimer = window.setTimeout(finishIntro, 220);
  };

  const typeName = (name, index = 0) => {
    if (!typedName || introFinished) return;
    typedName.textContent = name.slice(0, index);
    if (index >= name.length) {
      readyIntro();
      return;
    }
    typingTimer = window.setTimeout(() => typeName(name, index + 1), 45);
  };

  if (intro && typedName && enterButton) {
    setPageAvailable(false);
    intro.focus({ preventScroll: true });
    const name = typedName.dataset.text || 'Marcus Florentino';
    typedName.textContent = '';
    typingTimer = window.setTimeout(() => typeName(name), 500);
    enterButton.addEventListener('click', finishIntro);
    window.addEventListener('keydown', handleIntroKey);
  } else {
    document.body.classList.remove('intro-active');
  }

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
    if (menu) menu.hidden = true;
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    if (menu) menu.hidden = open;
    document.body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });

  const section = document.querySelector('.case-track');
  const steps = [...document.querySelectorAll('[data-chapter]')];
  const images = [...document.querySelectorAll('[data-image]')];
  let active = 0;
  const showChapter = (next) => {
    if (next === active) return;
    active = next;
    steps.forEach((step, index) => step.classList.toggle('is-active', index === active));
    images.forEach((image, index) => {
      image.classList.toggle('is-active', index === active);
      image.setAttribute('aria-hidden', String(index !== active));
    });
  };
  const updateChapter = () => {
    if (!section || window.innerWidth <= 700 || reduceMotion.matches) return;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    showChapter(Math.min(2, Math.floor(progress * 3)));
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateChapter(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateChapter);
  updateChapter();
})();
