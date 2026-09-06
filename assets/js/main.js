// Hotfix responsivo: preserva a leitura completa dos cards promocionais no mobile.
// Algumas artes possuem texto dentro da própria imagem; por isso, em telas menores,
// elas devem ser exibidas inteiras em vez de recortadas por object-fit: cover.
const responsiveCardFix = document.createElement('style');
responsiveCardFix.setAttribute('data-responsive-card-fix', '');
responsiveCardFix.textContent = `
  .instagram-float {
    position: fixed;
    right: max(16px, env(safe-area-inset-right, 0px));
    bottom: calc(78px + env(safe-area-inset-bottom, 0px));
    z-index: 49;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 46px;
    padding: 10px 15px;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 999px;
    background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%);
    color: #fff;
    font-weight: 800;
    box-shadow: 0 18px 45px rgba(0,0,0,.34);
    transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
  }
  .instagram-float:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 55px rgba(0,0,0,.42);
    filter: brightness(1.05);
  }
  .instagram-float svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    flex: 0 0 auto;
  }
  .instagram-float span {
    font-size: .84rem;
  }

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

  @media (max-width: 980px) {
    .vehicle-panel figure {
      height: auto !important;
      min-height: 0 !important;
      background: #071421;
    }
    .vehicle-panel figure img {
      width: 100%;
      height: auto !important;
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

  @media (max-width: 700px) {
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

    .instagram-float {
      right: max(14px, env(safe-area-inset-right, 0px));
      bottom: calc(70px + env(safe-area-inset-bottom, 0px));
      width: 46px;
      height: 46px;
      min-height: 46px;
      padding: 0;
      justify-content: center;
    }
    .instagram-float span {
      display: none;
    }
    .instagram-float svg {
      width: 22px;
      height: 22px;
    }
  }

  @media (max-width: 430px) {
    .vehicle-panel figure {
      height: auto !important;
    }
    .whatsapp-float {
      padding: 10px 12px;
      gap: 7px;
    }
    .whatsapp-float svg {
      width: 19px;
      height: 19px;
    }
    .whatsapp-float span {
      font-size: .78rem;
    }
    .instagram-float {
      right: max(13px, env(safe-area-inset-right, 0px));
      bottom: calc(66px + env(safe-area-inset-bottom, 0px));
      width: 44px;
      height: 44px;
      min-height: 44px;
    }
  }
`;
document.head.appendChild(responsiveCardFix);

// Crédito da Olegario Tech direciona para o site oficial da OT.
const developerCredit = document.querySelector('.site-footer small');
if (developerCredit) {
  developerCredit.innerHTML = 'Projeto desenvolvido pela <a href="https://olegariotech.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Conheça a Olegario Tech">Olegario Tech</a>.';
}

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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Header compacta discretamente ao rolar.
const header = document.querySelector('[data-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Revelação leve e performática por seção.
const revealItems = document.querySelectorAll('.reveal');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Linha de rota: desenha quando o bloco entra no viewport.
const route = document.querySelector('[data-route]');
if (route) {
  if (!reduceMotion && 'IntersectionObserver' in window) {
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
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
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

// Parallax sutil apenas em desktop com mouse; touch fica 100% estável.
const parallaxStage = document.querySelector('[data-parallax-stage]');
if (parallaxStage && finePointer && !reduceMotion) {
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

// Formulário monta a mensagem pronta e abre o WhatsApp.
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const value = (name) => (data.get(name) || '').toString().trim() || 'Não informado';

    const message = [
      'Olá, K.L Transporte Express. Gostaria de solicitar uma cotação.',
      '',
      `🚚 Serviço: ${value('servico')}`,
      `📍 Coleta: ${value('coleta')}`,
      `👤 Responsável pela retirada: ${value('retirada')}`,
      `📍 Entrega: ${value('entrega')}`,
      `👤 Responsável pelo recebimento: ${value('recebimento')}`,
      `📦 Mercadoria: ${value('mercadoria')}`,
      `⚖️ Peso: ${value('peso')}`,
      `📐 Dimensões: ${value('dimensoes')}`,
      `📝 Observações: ${value('observacoes')}`
    ].join('\n');

    const url = `https://wa.me/5519981045820?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  });
}
