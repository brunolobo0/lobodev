/* ============================================================
   Lobo Dev – Portfolio
   main.js
   ============================================================ */

/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();


/* ── WHATSAPP INPUT MASK ── */
(function initPhoneMask() {
  const input = document.getElementById('whatsapp');
  if (!input) return;

  input.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length <= 11) {
      v = v.replace(/^(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
    }
    this.value = v;
  });
})();


/* ── FORM SUBMIT ── */
(function initForm() {
  const btn = document.getElementById('btn-submit');
  if (!btn) return;
  btn.addEventListener('click', enviarFormulario);
})();

async function enviarFormulario() {
  const btn = document.getElementById('btn-submit');

  /* Collect values */
  const nome      = document.getElementById('nome').value.trim();
  const email     = document.getElementById('email').value.trim();
  const whatsapp  = document.getElementById('whatsapp').value.trim();
  const tipo_site = document.getElementById('tipo_site').value;
  const segmento  = document.getElementById('segmento').value.trim();
  const prazo     = document.getElementById('prazo').value;
  const referencia = document.getElementById('referencia').value.trim();
  const descricao = document.getElementById('descricao').value.trim();

  /* Basic validation */
  if (!nome || !email || !whatsapp || !tipo_site || !segmento || !descricao) {
    alert('Por favor, preencha todos os campos obrigatórios (*).');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

  /* Label maps */
  const tipoLabels = {
    site_institucional: 'Site Institucional',
    ecommerce:          'Loja Virtual / E-commerce',
    blog:               'Blog',
    landing_page:       'Landing Page',
    manutencao:         'Manutenção / Melhoria',
    nao_sei:            'Não sabe ainda',
  };
  const prazoLabels = {
    urgente:   'Urgente (menos de 2 semanas)',
    '1_mes':   'Cerca de 1 mês',
    '2_meses': '1 a 2 meses',
    sem_pressa:'Sem pressa',
  };

  btn.disabled = true;
  btn.textContent = 'Enviando... ⏳';

  try {
    const response = await fetch('https://formsubmit.co/ajax/brunosvlobo@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject:      `Novo orçamento: ${tipoLabels[tipo_site] || tipo_site} – ${nome}`,
        _template:     'table',
        nome,
        email,
        whatsapp,
        tipo_de_site:  tipoLabels[tipo_site] || tipo_site,
        segmento,
        prazo:         prazoLabels[prazo] || 'Não informado',
        referencia:    referencia || 'Não informado',
        descricao,
        _replyto:      email,
      }),
    });

    const data = await response.json();

    if (data.success === 'true' || data.success === true) {
      _showSuccess();
    } else {
      throw new Error('Falha no envio');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Enviar e receber orçamento grátis 🚀';
    alert('Ops! Houve um problema ao enviar. Por favor, entre em contato pelo WhatsApp: (11) 91868-5635');
  }
}

function _showSuccess() {
  /* Hide all form fields */
  const wrapper = document.getElementById('form-wrapper');
  wrapper.querySelectorAll(
    '.form-title, .form-subtitle, .form-group, .form-row, .form-divider, .form-section-title, .btn-submit, .form-note'
  ).forEach((el) => (el.style.display = 'none'));

  /* Show success message */
  const success = document.getElementById('form-success');
  success.style.display = 'block';
}
