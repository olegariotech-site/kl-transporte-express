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
