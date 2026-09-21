// Consentimento independente da interface comercial: falhas de UI não liberam tags.
(() => {
  const GA4_MEASUREMENT_ID = ''; // Inserir somente o ID oficial. Ver docs/COOKIES-GA4.md.
  const CONSENT_KEY = 'kl_cookie_consent';
  const CONSENT_VERSION = 1;
  const banner = document.querySelector('#cookie-banner');
  const dialog = document.querySelector('#cookie-preferences');
  const analyticsInput = document.querySelector('#cookie-analytics');
  const status = document.querySelector('#cookie-status');
  if (!banner || !dialog || !analyticsInput) return;

  const parseConsent = (raw) => {
    try {
      const value = JSON.parse(raw);
      return value?.version === CONSENT_VERSION &&
        ['granted', 'denied'].includes(value.analytics) &&
        typeof value.updatedAt === 'string' && Number.isFinite(Date.parse(value.updatedAt)) ? value : null;
    } catch { return null; }
  };
  const readConsent = () => {
    try { return parseConsent(localStorage.getItem(CONSENT_KEY)); }
    catch { return null; }
  };
  let consent = readConsent();
  let analyticsState = 'denied';
  let tagRequested = false;
  let returnFocus = null;
  const hasOfficialId = /^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID);

  // Basic Consent Mode: a fila é local; nenhum script/ping é carregado sem opt-in.
  const queue = function () { window.dataLayer.push(arguments); };
  if (hasOfficialId) {
    window['ga-disable-' + GA4_MEASUREMENT_ID] = true;
    window.dataLayer = window.dataLayer || [];
    queue('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
  }
  const clearAnalyticsCookies = () => {
    // Somente cookies GA deste site; nunca remove preferências ou cookies de terceiros.
    const names = document.cookie.split(';').map(part => part.trim().split('=')[0])
      .filter(name => name === '_ga' || name.startsWith('_ga_'));
    const parts = location.hostname.split('.');
    const domains = ['', ...parts.map((_, index) => parts.slice(index).join('.'))];
    names.forEach(name => domains.forEach(domain => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? '; domain=' + domain : ''}`;
    }));
  };
  const applyAnalytics = () => {
    const next = consent?.analytics === 'granted' ? 'granted' : 'denied';
    analyticsState = next;
    if (!hasOfficialId) return;
    window['ga-disable-' + GA4_MEASUREMENT_ID] = next !== 'granted';
    if (next !== 'granted') {
      if (tagRequested) queue('consent', 'update', { analytics_storage: 'denied' });
      clearAnalyticsCookies();
      return;
    }
    queue('consent', 'update', { analytics_storage: 'granted' });
    if (tagRequested) return;
    tagRequested = true;
    window.gtag = queue;
    queue('js', new Date());
    queue('config', GA4_MEASUREMENT_ID, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_path: '/', cookie_domain: location.hostname,
      // Não incluir query string/hash, que podem conter dados de cotação.
      page_location: location.origin + location.pathname
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
    script.id = 'kl-ga4';
    document.head.append(script);
  };

  const updateBannerSpace = () => {
    document.documentElement.style.setProperty('--cookie-banner-height', `${banner.hidden ? 0 : Math.ceil(banner.getBoundingClientRect().height)}px`);
  };
  const render = () => {
    banner.hidden = !!consent;
    analyticsInput.checked = consent?.analytics === 'granted';
    document.body.classList.toggle('cookie-banner-visible', !banner.hidden);
    updateBannerSpace();
  };
  const closePreferences = () => {
    if (dialog.open) dialog.close();
  };
  const openPreferences = (trigger) => {
    returnFocus = trigger;
    analyticsInput.checked = consent?.analytics === 'granted';
    dialog.showModal();
  };
  const saveConsent = (analytics) => {
    consent = { version: CONSENT_VERSION, analytics, updatedAt: new Date().toISOString() };
    let saved = true;
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); }
    catch { saved = false; }
    // Bloquear envio antes de qualquer atualização visual ao retirar autorização.
    applyAnalytics();
    const bannerHadFocus = banner.contains(document.activeElement);
    render();
    closePreferences();
    if (bannerHadFocus) document.querySelector('.footer-privacy [data-cookie-preferences]')?.focus({ preventScroll: true });
    status.textContent = (analytics === 'granted' ? 'Preferência salva: analíticos autorizados.' : 'Preferência salva: analíticos recusados.') +
      (saved ? '' : ' O navegador bloqueou o armazenamento. A escolha vale apenas nesta página.');
  };
  document.querySelectorAll('[data-cookie-preferences]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => openPreferences(button));
  });
  document.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', () => saveConsent(button.dataset.cookieChoice));
  });
  document.querySelector('[data-cookie-save]').addEventListener('click', () => saveConsent(analyticsInput.checked ? 'granted' : 'denied'));
  document.querySelector('[data-cookie-close]').addEventListener('click', closePreferences);
  // O dialog nativo oferece modal, Escape e contenção de foco. Fechar não salva.
  dialog.addEventListener('close', () => {
    const target = returnFocus?.getClientRects().length ? returnFocus : document.querySelector('.footer-privacy [data-cookie-preferences]');
    target?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, input, a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('storage', event => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    consent = readConsent();
    applyAnalytics();
    render();
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    consent = readConsent();
    applyAnalytics();
    render();
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-analytics-event="google_review_click"]');
    if (!link || analyticsState !== 'granted' || !hasOfficialId || !tagRequested) return;
    queue('event', 'google_review_click', { send_to: GA4_MEASUREMENT_ID, location: link.dataset.analyticsLocation });
  });
  if ('ResizeObserver' in window) new ResizeObserver(updateBannerSpace).observe(banner);
  window.addEventListener('resize', updateBannerSpace, { passive: true });
  applyAnalytics();
  render();
})();

(() => {
  try {


    // Menu não modal: mantém scroll livre e oferece fallback sem JavaScript.
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('#main-nav');
    const mobileNavigation = window.matchMedia('(max-width: 980px)');
    if (menuButton && navigation) {
      const setMenu = (open, restoreFocus = false) => {
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        navigation.classList.toggle('is-open', open);
        if (restoreFocus) menuButton.focus();
        scheduleFloatingLinks();
      };
      menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
      navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenu(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
      });
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.site-header')) setMenu(false);
      });
      mobileNavigation.addEventListener('change', () => setMenu(false));
      document.documentElement.classList.add('js-nav');
    }

    const form = document.querySelector('#quote-form');
    const serviceField = form?.querySelector('[name="servico"]');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    // Acomodar os atalhos no rodapé quando cobririam conteúdo em telas estreitas.
    const protectedContent = [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main label, main figcaption, main img, .site-footer')];
    let floatFrame = null;
    const updateFloatingLinks = () => {
      floatFrame = null;
      if (!mobileNavigation.matches) {
        document.body.classList.remove('contact-in-view');
        return;
      }
      const size = window.innerWidth <= 430 ? 44 : 48;
      const whatsappStyle = getComputedStyle(document.querySelector('.whatsapp-float'));
      const instagramStyle = getComputedStyle(document.querySelector('.instagram-float'));
      const right = parseFloat(whatsappStyle.right) || 13;
      const bottom = parseFloat(whatsappStyle.bottom) || 13;
      const instagramBottom = parseFloat(instagramStyle.bottom) || (size === 44 ? 64 : 70);
      const lower = { left: innerWidth - right - size, right: innerWidth - right, top: innerHeight - bottom - size, bottom: innerHeight - bottom };
      const upper = { ...lower, top: innerHeight - instagramBottom - size, bottom: innerHeight - instagramBottom };
      const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      const blocked = protectedContent.some((element) => {
        if (!element.getClientRects().length) return false;
        const rect = element.getBoundingClientRect();
        return overlaps(rect, lower) || overlaps(rect, upper);
      });
      document.body.classList.toggle('contact-in-view', blocked);
    };
    const scheduleFloatingLinks = () => {
      if (floatFrame === null) floatFrame = requestAnimationFrame(updateFloatingLinks);
    };
    window.addEventListener('scroll', scheduleFloatingLinks, { passive: true });
    window.addEventListener('resize', scheduleFloatingLinks, { passive: true });
    window.addEventListener('load', scheduleFloatingLinks, { once: true });
    document.addEventListener('focusin', scheduleFloatingLinks);
    scheduleFloatingLinks();

    // Header compacta discretamente ao rolar.
    const header = document.querySelector('[data-header]');
    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    // Revelação leve por seção. Se o recurso não existir, o conteúdo permanece visível.
    const revealItems = document.querySelectorAll('.reveal');
    const showAll = () => revealItems.forEach((item) => item.classList.add('is-visible'));

    if (!motionQuery.matches && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      showAll();
    }

    motionQuery.addEventListener?.('change', (event) => {
      if (event.matches) showAll();
    });

    // Linha de rota.
    const route = document.querySelector('[data-route]');
    if (route) {
      if (!motionQuery.matches && 'IntersectionObserver' in window) {
        const routeObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          });
        }, { threshold: 0.35 });
        routeObserver.observe(route);
      } else {
        route.classList.add('is-visible');
      }
    }

    // Seletor de veículos acessível e amigável para toque.
    const selector = document.querySelector('[data-vehicle-selector]');
    if (selector) {
      const tabs = [...selector.querySelectorAll('[role="tab"]')];
      const panels = [...selector.querySelectorAll('[role="tabpanel"]')];

      const activateTab = (tab) => {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.classList.toggle('is-active', selected);
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
        });

        panels.forEach((panel) => {
          const selected = panel.id === tab.dataset.target;
          panel.hidden = !selected;
          panel.classList.toggle('is-active', selected);
        });
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (event) => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          let nextIndex = index;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (event.key === 'Home') nextIndex = 0;
          if (event.key === 'End') nextIndex = tabs.length - 1;
          tabs[nextIndex].focus();
          activateTab(tabs[nextIndex]);
        });
      });
    }

    // CTAs de serviço pré-selecionam o tipo no formulário.
    document.querySelectorAll('[data-service]').forEach((link) => {
      link.addEventListener('click', () => {
        if (!serviceField) return;
        const service = link.dataset.service;
        if (service) serviceField.value = service;
      });
    });

    // Parallax sutil apenas em desktop com mouse.
    const parallaxStage = document.querySelector('[data-parallax-stage]');
    if (parallaxStage && finePointer && !motionQuery.matches) {
      const layers = [...parallaxStage.querySelectorAll('[data-parallax]')];
      let rafId = null;

      const render = (x, y) => {
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.parallax || 0.5);
          layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
        });
      };

      parallaxStage.addEventListener('pointermove', (event) => {
        const rect = parallaxStage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => render(x, y));
      });

      parallaxStage.addEventListener('pointerleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => render(0, 0));
      });
    }

    // Formulário monta mensagem simples, sem depender de emojis no redirecionamento.
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const value = (name) => (data.get(name) || '').toString().trim() || 'Não informado';

        const message = [
          'Olá, K.L Transporte Express. Gostaria de solicitar uma cotação.',
          '',
          `Serviço: ${value('servico')}`,
          `Coleta: ${value('coleta')}`,
          `Responsável pela retirada: ${value('retirada')}`,
          `Entrega: ${value('entrega')}`,
          `Responsável pelo recebimento: ${value('recebimento')}`,
          `Mercadoria: ${value('mercadoria')}`,
          `Peso aproximado: ${value('peso')}`,
          `Dimensões aproximadas: ${value('dimensoes')}`,
          `Observações: ${value('observacoes')}`
        ].join('\n');

        const url = `https://wa.me/5519981045820?text=${encodeURIComponent(message)}`;
        window.location.href = url;
      });
    }
  } catch (error) {
    document.documentElement.classList.remove('js-motion', 'js-nav');
    console.error('K.L UI fallback ativado:', error);
  }
})();
