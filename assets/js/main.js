(() => {
  try {
    const runtimeStyles = document.createElement('style');
    runtimeStyles.setAttribute('data-runtime-ui-fixes', '');
    runtimeStyles.textContent = `
      /* CTAs flutuantes: compactos por padrão, expandem somente com hover real. */
      .whatsapp-float,
      .instagram-float {
        position: fixed !important;
        right: max(16px, env(safe-area-inset-right, 0px)) !important;
        z-index: 50 !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 10px !important;
        padding: 0 15px !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        border-radius: 999px !important;
        box-shadow: 0 16px 38px rgba(0,0,0,.30) !important;
        transition: width .26s ease, transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
        box-sizing: border-box !important;
      }

      .whatsapp-float {
        bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .instagram-float {
        bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important;
        border: 1px solid rgba(255,255,255,.16) !important;
        background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%) !important;
        color: #fff !important;
        font-weight: 800 !important;
      }

      .whatsapp-float svg,
      .instagram-float svg {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        flex: 0 0 22px !important;
      }

      .instagram-float svg {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.9;
      }

      .whatsapp-float span,
      .instagram-float span {
        opacity: 0;
        transform: translateX(8px);
        pointer-events: none;
        font-size: .88rem !important;
        font-weight: 800 !important;
        transition: opacity .16s ease, transform .2s ease;
      }

      @media (hover: hover) and (pointer: fine) {
        .whatsapp-float:hover,
        .whatsapp-float:focus-visible {
          width: 158px !important;
          transform: translateX(-3px);
          box-shadow: 0 20px 48px rgba(0,0,0,.36) !important;
        }

        .instagram-float:hover,
        .instagram-float:focus-visible {
          width: 148px !important;
          transform: translateX(-3px);
          box-shadow: 0 20px 48px rgba(0,0,0,.38) !important;
          filter: brightness(1.04);
        }

        .whatsapp-float:hover span,
        .whatsapp-float:focus-visible span,
        .instagram-float:hover span,
        .instagram-float:focus-visible span {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Crédito da OT. */
      .site-footer small a {
        color: var(--accent);
        font-weight: 800;
        text-decoration: none;
      }
      .site-footer small a:hover,
      .site-footer small a:focus-visible {
        color: var(--accent-2);
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      /* Hierarquia um pouco mais compacta para reduzir rolagem desnecessária. */
      .section h2,
      .heavy-copy h2,
      .quote-intro h2 {
        font-size: clamp(2.2rem, 3.6vw, 3.7rem) !important;
        max-width: 15ch !important;
      }

      /* Painel de serviços estável no desktop: a imagem não dita a altura da seção. */
      @media (min-width: 981px) {
        .vehicle-panel {
          height: 460px !important;
          min-height: 460px !important;
        }
        .vehicle-panel figure {
          height: 460px !important;
          min-height: 0 !important;
          background: #071421;
        }
        .vehicle-panel figure img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      }

      /* Tablet/mobile: preserva as artes e mantém altura previsível. */
      @media (max-width: 980px) {
        .vehicle-panel {
          height: auto !important;
          min-height: 0 !important;
        }
        .vehicle-panel figure {
          height: auto !important;
          min-height: 0 !important;
          aspect-ratio: 16 / 10;
          background: #071421;
        }
        .vehicle-panel figure img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
        .proof-grid .proof-large {
          height: auto !important;
        }
        .proof-grid .proof-large img {
          height: auto !important;
          object-fit: contain !important;
        }
      }

      .field-required {
        color: var(--accent);
        font-weight: 800;
      }
      .field-optional {
        color: var(--muted-2);
        font-size: .76rem;
        font-weight: 600;
      }
      .form-help {
        display: block;
        color: var(--muted);
        font-size: .78rem;
        line-height: 1.4;
        margin-top: -2px;
      }

      @media (max-width: 700px), (hover: none), (pointer: coarse) {
        .whatsapp-float,
        .instagram-float {
          right: max(13px, env(safe-area-inset-right, 0px)) !important;
          width: 48px !important;
          height: 48px !important;
          min-width: 48px !important;
          min-height: 48px !important;
          padding: 0 !important;
          justify-content: center !important;
          transform: none !important;
        }

        .whatsapp-float {
          bottom: calc(13px + env(safe-area-inset-bottom, 0px)) !important;
        }

        .instagram-float {
          bottom: calc(70px + env(safe-area-inset-bottom, 0px)) !important;
        }

        .whatsapp-float span,
        .instagram-float span {
          display: none !important;
        }

        /* As quatro categorias ficam visíveis sem depender de swipe escondido. */
        .vehicle-tabs {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          overflow: visible !important;
          scroll-snap-type: none !important;
        }
        .vehicle-tab {
          width: 100% !important;
          min-width: 0 !important;
          min-height: 58px !important;
          padding: 8px 10px !important;
          white-space: normal !important;
          line-height: 1.2 !important;
          border-right: 1px solid var(--line) !important;
          border-bottom: 1px solid var(--line) !important;
        }
        .vehicle-tab:nth-child(2n) {
          border-right: 0 !important;
        }
        .vehicle-tab:nth-last-child(-n+2) {
          border-bottom: 0 !important;
        }

        .proof-grid .proof-large,
        .proof-grid figure {
          height: auto !important;
          min-height: 0 !important;
        }
        .proof-grid figure::after {
          display: none !important;
        }
        .proof-grid img {
          width: 100%;
          height: auto !important;
          object-fit: contain !important;
        }
        .proof-grid figcaption {
          position: static !important;
          padding: 16px 18px 18px;
          background: var(--surface);
          gap: 6px;
        }
        .proof-grid figcaption strong {
          font-size: 1.08rem;
          line-height: 1.15;
        }
        .proof-grid figcaption span {
          font-size: .9rem;
          line-height: 1.4;
        }
      }

      @media (max-width: 430px) {
        .whatsapp-float,
        .instagram-float {
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          min-height: 44px !important;
        }
        .instagram-float {
          bottom: calc(64px + env(safe-area-inset-bottom, 0px)) !important;
        }
        .vehicle-panel figure {
          aspect-ratio: 4 / 3;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .vehicle-panel,
        .whatsapp-float,
        .instagram-float,
        .motion-track {
          animation: none !important;
          transition: none !important;
        }
        .reveal,
        html.js-motion .reveal,
        html.js-motion .reveal.is-visible {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(runtimeStyles);

    // CTA flutuante secundário para o Instagram oficial da K.L.
    const instagramButton = document.createElement('a');
    instagramButton.className = 'instagram-float';
    instagramButton.href = 'https://www.instagram.com/transporte_campinas?utm_source=qr&igsh=OTY5NjE4eW45anZz&igsi=OTY5NjE4eW45anZz';
    instagramButton.target = '_blank';
    instagramButton.rel = 'noopener';
    instagramButton.setAttribute('aria-label', 'Abrir Instagram da K.L Transporte Express');
    instagramButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"></circle>
      </svg>
      <span>Instagram</span>
    `;
    document.body.appendChild(instagramButton);

    const form = document.querySelector('#quote-form');
    const serviceField = form?.querySelector('[name="servico"]');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    // Imagens secundárias do hero entram depois do carregamento principal.
    const loadDeferredImages = () => {
      document.querySelectorAll('[data-defer-image]').forEach((image) => {
        const source = image.dataset.src;
        if (!source) return;
        image.src = source;
        image.removeAttribute('data-src');
        image.removeAttribute('data-defer-image');
      });
    };

    const scheduleDeferredImages = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadDeferredImages, { timeout: 1200 });
      } else {
        window.setTimeout(loadDeferredImages, 350);
      }
    };

    if (document.readyState === 'complete') scheduleDeferredImages();
    else window.addEventListener('load', scheduleDeferredImages, { once: true });

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
    document.documentElement.classList.remove('js-motion');
    console.error('K.L UI fallback ativado:', error);
  }
})();
