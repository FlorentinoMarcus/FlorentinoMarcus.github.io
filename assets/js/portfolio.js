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
  let introSeen = false;
  try {
    introSeen = window.sessionStorage.getItem('portfolio-intro-seen') === 'true';
    if (intro && !introSeen) window.sessionStorage.setItem('portfolio-intro-seen', 'true');
  } catch {}
  const syncHeroScale = () => {
    if (!hero) return;
    const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    const availableWidth = headerWrap?.getBoundingClientRect().width || window.innerWidth;
    const availableHeight = Math.max(1, window.innerHeight - navHeight - 28);
    const scale = Math.min(1, availableWidth / heroReference.width, availableHeight / heroReference.height);
    const heroEdgeSpace = 12 + (heroReference.height * .1 * scale);
    const heroOverhang = 48 * scale;
    hero.style.setProperty('--hero-scale', scale.toFixed(6));
    hero.style.setProperty('--hero-scaled-height', `${(heroReference.height * scale).toFixed(3)}px`);
    document.documentElement.style.setProperty('--hero-edge-space', `${heroEdgeSpace.toFixed(3)}px`);
    document.documentElement.style.setProperty('--hero-overhang', `${heroOverhang.toFixed(3)}px`);
  };
  const queueHeroScale = () => {
    window.cancelAnimationFrame(heroResizeFrame);
    heroResizeFrame = window.requestAnimationFrame(syncHeroScale);
  };
  syncHeroScale();
  window.addEventListener('resize', queueHeroScale, { passive: true });
  window.addEventListener('orientationchange', queueHeroScale, { passive: true });

  const initHeroDots = () => {
    const canvas = hero?.querySelector('[data-hero-dots]');
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !hero) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = { x: 0, y: 0, active: false };
    const dots = [];
    const proximity = 130;
    const pushDistance = 18;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const draw = (animate = false) => {
      context.clearRect(0, 0, width, height);
      let unsettled = false;

      dots.forEach((dot) => {
        const offsetX = pointer.x - dot.originX;
        const offsetY = pointer.y - dot.originY;
        const distance = Math.hypot(offsetX, offsetY) || 1;
        const influence = pointer.active && distance < proximity
          ? (1 - distance / proximity) ** 2
          : 0;
        const targetX = dot.originX - (offsetX / distance) * pushDistance * influence;
        const targetY = dot.originY - (offsetY / distance) * pushDistance * influence;

        if (animate) {
          dot.velocityX = (dot.velocityX + (targetX - dot.x) * .13) * .74;
          dot.velocityY = (dot.velocityY + (targetY - dot.y) * .13) * .74;
          dot.x += dot.velocityX;
          dot.y += dot.velocityY;
        } else {
          dot.x = targetX;
          dot.y = targetY;
        }

        if (Math.abs(dot.x - dot.originX) > .02 || Math.abs(dot.y - dot.originY) > .02 || Math.abs(dot.velocityX) > .02 || Math.abs(dot.velocityY) > .02) {
          unsettled = true;
        }

        const baseAlpha = .16;
        const activeAlpha = baseAlpha + influence * .78;
        const red = Math.round(164 + (246 - 164) * influence);
        const green = Math.round(158 + (138 - 158) * influence);
        const blue = Math.round(151 + (46 - 151) * influence);
        context.beginPath();
        context.arc(dot.x, dot.y, 1.15 + influence * 1.55, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${activeAlpha})`;
        context.fill();
      });

      frame = 0;
      if (unsettled) frame = window.requestAnimationFrame(() => draw(true));
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(() => draw(true));
    };

    const rebuild = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      dots.length = 0;

      const gap = width < 700 ? 26 : 30;
      const inset = gap * .5;
      for (let y = inset; y < height; y += gap) {
        for (let x = inset; x < width; x += gap) {
          dots.push({ originX: x, originY: y, x, y, velocityX: 0, velocityY: 0 });
        }
      }
      draw(false);
    };

    const updatePointer = (event) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      requestDraw();
    };

    const releasePointer = () => {
      pointer.active = false;
      requestDraw();
    };

    const syncInteraction = () => {
      hero.removeEventListener('pointermove', updatePointer);
      hero.removeEventListener('pointerleave', releasePointer);
      pointer.active = false;
      if (!reduceMotion.matches && finePointer.matches) {
        hero.addEventListener('pointermove', updatePointer, { passive: true });
        hero.addEventListener('pointerleave', releasePointer, { passive: true });
      }
      requestDraw();
    };

    new ResizeObserver(rebuild).observe(hero);
    reduceMotion.addEventListener('change', syncInteraction);
    finePointer.addEventListener('change', syncInteraction);
    rebuild();
    syncInteraction();
  };

  initHeroDots();

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

  if (intro && typedName && enterButton && !introSeen) {
    setPageAvailable(false);
    intro.focus({ preventScroll: true });
    const name = typedName.dataset.text || 'Marcus Florentino';
    typedName.textContent = '';
    typingTimer = window.setTimeout(() => typeName(name), 500);
    enterButton.addEventListener('click', finishIntro);
    window.addEventListener('keydown', handleIntroKey);
  } else {
    intro?.remove();
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

  const projectSections = ['trailer', 'gameplay', 'roles', 'awards']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const projectNavLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]')];
  let projectNavFrame;
  const updateProjectNavigation = () => {
    if (!projectSections.length || !projectNavLinks.length) return;
    const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
    const marker = window.scrollY + navHeight + Math.min(window.innerHeight * .28, 240);
    let currentSection = projectSections[0].id;
    projectSections.forEach((projectSection) => {
      if (projectSection.offsetTop <= marker) currentSection = projectSection.id;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      currentSection = projectSections.at(-1).id;
    }
    projectNavLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSection}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const queueProjectNavigation = () => {
    window.cancelAnimationFrame(projectNavFrame);
    projectNavFrame = window.requestAnimationFrame(updateProjectNavigation);
  };
  window.addEventListener('scroll', queueProjectNavigation, { passive: true });
  window.addEventListener('resize', queueProjectNavigation, { passive: true });
  updateProjectNavigation();

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

  const gameplayCarousel = document.querySelector('[data-gameplay-carousel]');
  if (gameplayCarousel) {
    const slides = [...gameplayCarousel.querySelectorAll('.gameplay-slide')];
    const currentLabel = document.querySelector('[data-gameplay-current]');
    const currentCaption = document.querySelector('[data-gameplay-caption]');
    const previousButton = document.querySelector('[data-gameplay-prev]');
    const nextButton = document.querySelector('[data-gameplay-next]');
    const dragStep = 560;
    const dragReleaseThreshold = 140;
    let currentSlide = 0;
    let pointerStartX = null;
    const getGameplaySlideStep = () => gameplayCarousel.clientWidth * (window.innerWidth <= 700 ? .64 : .48);

    const renderGameplayCarousel = () => {
      const slideStep = getGameplaySlideStep();
      slides.forEach((slide, index) => {
        let offset = currentSlide - index;
        const midpoint = Math.floor(slides.length / 2);
        if (offset > midpoint) offset -= slides.length;
        if (offset < -midpoint) offset += slides.length;
        const isActive = offset === 0;
        const previousOffset = slide.dataset.carouselOffset === undefined ? null : Number(slide.dataset.carouselOffset);
        const isPortalJump = previousOffset !== null && Math.abs(offset - previousOffset) > 1;
        if (isPortalJump) {
          const portalToken = String((Number(slide.dataset.portalToken) || 0) + 1);
          slide.dataset.portalToken = portalToken;
          slide.classList.add('is-portal-jump');
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              if (slide.dataset.portalToken === portalToken) slide.classList.remove('is-portal-jump');
            });
          });
        }
        slide.dataset.carouselOffset = String(offset);
        slide.style.setProperty('--slide-x', `${offset * slideStep}px`);
        slide.style.setProperty('--slide-y', '0px');
        slide.style.setProperty('--slide-depth', isActive ? '0px' : '-110px');
        slide.style.setProperty('--slide-tilt', '0deg');
        slide.style.setProperty('--slide-rotate', '0deg');
        slide.style.setProperty('--slide-scale', isActive ? '1' : '.88');
        slide.style.setProperty('--slide-opacity', isActive ? '1' : '.68');
        slide.style.setProperty('--slide-brightness', isActive ? '1' : '.58');
        slide.style.setProperty('--slide-saturation', isActive ? '1' : '.72');
        slide.style.setProperty('--slide-origin', 'center');
        slide.style.setProperty('--slide-z', isActive ? '3' : '1');
        slide.style.setProperty('--image-shift', `${offset * -7}%`);
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      if (currentLabel) currentLabel.textContent = String(currentSlide + 1).padStart(2, '0');
      if (currentCaption) currentCaption.textContent = slides[currentSlide]?.querySelector('figcaption')?.textContent || '';
    };

    const showGameplaySlide = (nextIndex) => {
      currentSlide = (nextIndex + slides.length) % slides.length;
      gameplayCarousel.style.removeProperty('--drag-shift');
      slides.forEach((slide) => {
        slide.style.removeProperty('--drag-shift');
        slide.querySelector('img')?.style.removeProperty('--image-drag');
      });
      renderGameplayCarousel();
    };

    const finishGameplayDrag = (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      gameplayCarousel.classList.remove('is-dragging');
      pointerStartX = null;
      if (Math.abs(distance) >= dragReleaseThreshold) {
        showGameplaySlide(currentSlide + (distance > 0 ? 1 : -1));
      } else {
        showGameplaySlide(currentSlide);
      }
    };

    previousButton?.addEventListener('click', () => showGameplaySlide(currentSlide - 1));
    nextButton?.addEventListener('click', () => showGameplaySlide(currentSlide + 1));
    gameplayCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showGameplaySlide(currentSlide - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showGameplaySlide(currentSlide + 1);
      }
    });
    gameplayCarousel.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      pointerStartX = event.clientX;
      gameplayCarousel.classList.add('is-dragging');
      gameplayCarousel.setPointerCapture(event.pointerId);
    });
    gameplayCarousel.addEventListener('pointermove', (event) => {
      if (pointerStartX === null) return;
      let distance = event.clientX - pointerStartX;
      if (Math.abs(distance) >= dragStep) {
        const direction = Math.sign(distance);
        pointerStartX = event.clientX;
        showGameplaySlide(currentSlide + direction);
        distance = 0;
      }
      const slideStep = getGameplaySlideStep();
      const dragProgress = distance / dragStep;
      const visualDistance = dragProgress * slideStep;
      slides.forEach((slide) => {
        const offset = Number(slide.dataset.carouselOffset || 0);
        const proximity = 1 - Math.min(1, Math.abs(offset * slideStep + visualDistance) / slideStep);
        slide.style.setProperty('--drag-shift', `${visualDistance}px`);
        slide.style.setProperty('--slide-depth', `${-110 * (1 - proximity)}px`);
        slide.style.setProperty('--slide-scale', String(.88 + proximity * .12));
        slide.style.setProperty('--slide-opacity', String(.68 + proximity * .32));
        slide.style.setProperty('--slide-brightness', String(.58 + proximity * .42));
        slide.style.setProperty('--slide-saturation', String(.72 + proximity * .28));
        slide.style.setProperty('--slide-z', proximity > .5 ? '3' : '1');
        slide.querySelector('img')?.style.setProperty('--image-drag', `${dragProgress * -7}%`);
      });
    });
    gameplayCarousel.addEventListener('pointerup', finishGameplayDrag);
    gameplayCarousel.addEventListener('pointercancel', finishGameplayDrag);
    window.addEventListener('resize', renderGameplayCarousel, { passive: true });
    renderGameplayCarousel();
  }

  const carousel = document.querySelector('[data-ad-carousel]');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('[data-ad-slide]')];
    const track = carousel.querySelector('[data-carousel-track]');
    const currentLabel = carousel.querySelector('[data-carousel-current]');
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    let currentSlide = 1;
    let touchStartX = null;

    const showSlide = (nextIndex) => {
      currentSlide = (nextIndex + slides.length) % slides.length;
      track?.style.setProperty('--carousel-index', currentSlide);
      slides.forEach((slide, index) => {
        const isActive = index === currentSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.toggleAttribute('inert', !isActive);
        const video = slide.querySelector('video');
        if (video) video.tabIndex = isActive ? 0 : -1;
        if (!isActive) video?.pause();
      });
      if (currentLabel) currentLabel.textContent = String(currentSlide + 1);
    };

    previousButton?.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(currentSlide - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(currentSlide + 1);
      }
    });
    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0]?.clientX ?? null;
    }, { passive: true });
    carousel.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(distance) > 48) showSlide(currentSlide + (distance < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    showSlide(1);
  }
})();
