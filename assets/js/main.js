const form = document.querySelector('#quote-form');
const serviceField = form?.querySelector('[name="servico"]');

const serviceLinks = document.querySelectorAll('[data-service]');

serviceLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (!serviceField) return;
    const service = link.dataset.service;
    if (service) serviceField.value = service;
  });
});

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
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
