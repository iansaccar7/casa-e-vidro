(() => {
  'use strict';
  const phone = '5511972826409';
  const wa = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-wa]').forEach(link => {
    link.href = wa('Olá! Vim pelo site da Casa & Vidro e gostaria de conversar sobre um orçamento.');
  });
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  const header = document.querySelector('[data-topo]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('#menu-principal');
  const mobile = matchMedia('(max-width: 991px)');
  function menu(open, returnFocus = false) {
    header.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-aberto', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.inert = mobile.matches && !open;
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => {
    if (!header.contains(event.target) || event.target.closest('.menu a')) menu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) menu(false, true);
  });
  header.addEventListener('focusout', () => {
    requestAnimationFrame(() => { if (!header.contains(document.activeElement)) menu(false); });
  });
  mobile.addEventListener('change', () => menu(false));
  menu(false);

  const form = document.querySelector('[data-form]');
  const status = document.querySelector('[data-form-status]');
  function clearError(name) {
    const error = document.getElementById(`erro-${name}`);
    if (error) error.textContent = '';
    form.querySelectorAll(`[name="${name}"]`).forEach(input => input.removeAttribute('aria-invalid'));
  }
  form.addEventListener('input', event => {
    clearError(event.target.name);
    status.replaceChildren();
  });
  document.querySelectorAll('[data-servico]').forEach(card => {
    card.addEventListener('click', () => {
      const radio = [...form.elements.servico].find(input => input.value === card.dataset.servico);
      radio.checked = true;
      clearError('servico');
      status.replaceChildren();
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.replaceChildren();
    const data = new FormData(form);
    const fields = [
      ['servico', 'Escolha box, espelhos ou os dois.'],
      ['nome', 'Informe seu nome para continuar.'],
      ['bairro', 'Informe o bairro do serviço.']
    ];
    let firstInvalid;
    for (const [name, message] of fields) {
      clearError(name);
      if (!String(data.get(name) || '').trim()) {
        document.getElementById(`erro-${name}`).textContent = message;
        const inputs = form.querySelectorAll(`[name="${name}"]`);
        inputs.forEach(input => input.setAttribute('aria-invalid', 'true'));
        firstInvalid ||= inputs[0];
      }
    }
    if (firstInvalid) { firstInvalid.focus(); return; }
    const lines = ['Olá! Vim pelo site da Casa & Vidro e gostaria de um orçamento.', ''];
    for (const [name, label] of [['servico', 'Serviço'], ['nome', 'Nome'], ['bairro', 'Bairro'], ['medidas', 'Medidas aproximadas'], ['mensagem', 'Detalhes']]) {
      const value = String(data.get(name) || '').trim();
      if (value) lines.push(`${label}: ${value}`);
    }
    const url = wa(lines.join('\n'));
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.textContent = 'Abrir mensagem no WhatsApp';
    status.append('Mensagem preparada. Se o WhatsApp não abriu, use este link: ', fallback, '.');
    const popup = window.open(url, '_blank');
    if (popup) popup.opener = null;
  });
})();
