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
