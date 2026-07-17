/* =========================================================================
   JARDIM DAS SUCULENTAS FOFINHAS — script.js
   Todas as configurações do site ficam no objeto CONFIG abaixo.
   Altere os valores para ligar/desligar recursos, mudar preço, prazos, etc.
========================================================================= */

const CONFIG = {

  // ---------- PRODUTO ----------
  productName: "Jardim das Suculentas Fofinhas",
  price: "R$14,90",          // preço exibido na barra móvel, botão flutuante etc.
  checkoutUrl: "#comprar",   // troque por seu link de checkout real (ex: Hotmart, Kiwify...)

  // ---------- CONTADOR REGRESSIVO ----------
  countdown: {
    enabled: true,           // true = mostra o contador / false = esconde a seção inteira
    label: "Oferta Especial",
    durationHours: 24,       // quantas horas a partir de agora o contador vai rodar
    // Alternativa: defina uma data fixa (formato ISO) e comente 'durationHours' se preferir.
    // fixedEndDate: "2026-07-20T23:59:59"
  },

  // ---------- BARRA FIXA DE COMPRA (MOBILE) ----------
  mobileBuyBar: {
    enabled: true,
    showAfterPercent: 20     // aparece após rolar X% da altura da página
  },

  // ---------- BOTÃO FLUTUANTE DE COMPRA ----------
  floatingBuyButton: {
    enabled: true,
    showAfterPercent: 30,    // aparece após rolar X% da altura da página
    pulse: true              // animação suave de pulsação
  },

  // ---------- BOTÃO VOLTAR AO TOPO ----------
  backToTop: {
    enabled: true,
    showAfterPx: 400         // aparece após rolar X pixels
  },

  // ---------- ANIMAÇÕES DE ENTRADA (fade/slide ao rolar) ----------
  scrollAnimations: {
    enabled: true,
    threshold: 0.15          // % do elemento visível para disparar a animação
  }
};

/* =========================================================================
   Não é necessário editar nada abaixo desta linha.
========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  applyProductConfig();
  initCountdown();
  initScrollAnimations();
  initMobileBuyBar();
  initFloatingBuyButton();
  initBackToTop();
});

/* ---------- Aplica nome / preço / link de checkout em todos os CTAs ---------- */
function applyProductConfig() {
  document.querySelectorAll(".mbb-title").forEach(el => (el.textContent = CONFIG.productName));
  document.querySelectorAll(".mbb-price").forEach(el => (el.textContent = CONFIG.price));

  ["cta-hero", "cta-final", "mbb-cta"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", CONFIG.checkoutUrl);
  });

  const floatBtn = document.getElementById("float-buy");
  if (floatBtn) {
    floatBtn.addEventListener("click", () => {
      const target = document.getElementById("comprar") || document.getElementById("cta-hero");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    if (CONFIG.floatingBuyButton.pulse) floatBtn.classList.add("pulse");
  }
}

/* ---------- 1. CONTADOR REGRESSIVO ---------- */
function initCountdown() {
  const section = document.getElementById("countdown-section");
  if (!CONFIG.countdown.enabled) {
    if (section) section.style.display = "none";
    return;
  }

  const labelEl = document.getElementById("countdown-label");
  if (labelEl) labelEl.textContent = CONFIG.countdown.label;

  let endTime;
  if (CONFIG.countdown.fixedEndDate) {
    endTime = new Date(CONFIG.countdown.fixedEndDate).getTime();
  } else {
    endTime = Date.now() + CONFIG.countdown.durationHours * 60 * 60 * 1000;
  }

  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      clearInterval(timer);
      return;
    }
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- 5. ANIMAÇÕES DE ENTRADA (Intersection Observer) ---------- */
function initScrollAnimations() {
  if (!CONFIG.scrollAnimations.enabled) {
    document.querySelectorAll(".fade-up").forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: CONFIG.scrollAnimations.threshold }
  );

  document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
}

/* ---------- Utilidade: % de rolagem da página ---------- */
function getScrollPercent() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

/* ---------- 2. BARRA FIXA DE COMPRA (MOBILE) ---------- */
function initMobileBuyBar() {
  const bar = document.getElementById("mobile-buy-bar");
  if (!bar) return;

  if (!CONFIG.mobileBuyBar.enabled) {
    bar.style.display = "none";
    return;
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const percent = getScrollPercent();
      if (percent >= CONFIG.mobileBuyBar.showAfterPercent) {
        bar.classList.add("is-visible");
      } else {
        bar.classList.remove("is-visible");
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- 3. BOTÃO FLUTUANTE DE COMPRA ---------- */
function initFloatingBuyButton() {
  const btn = document.getElementById("float-buy");
  if (!btn) return;

  if (!CONFIG.floatingBuyButton.enabled) {
    btn.style.display = "none";
    return;
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const percent = getScrollPercent();
      if (percent >= CONFIG.floatingBuyButton.showAfterPercent) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- 4. BOTÃO VOLTAR AO TOPO ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  if (!CONFIG.backToTop.enabled) {
    btn.style.display = "none";
    return;
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (window.scrollY >= CONFIG.backToTop.showAfterPx) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
      ticking = false;
    });
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
