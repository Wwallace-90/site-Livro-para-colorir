/* =========================================================================
   JARDIM DAS SUCULENTAS FOFINHAS — script.js
   Todas as configurações do site ficam no objeto CONFIG abaixo.
   Altere os valores para ligar/desligar recursos, mudar preço, prazos, etc.
========================================================================= */

// ---------- LINK DE CHECKOUT (KIWIFY) ----------
// Altere APENAS esta linha quando precisar trocar o link de checkout.
// Todos os botões "Quero Meu Livro Agora" da página usam esta mesma variável.
const checkoutUrl = "https://pay.kiwify.com.br/TtftuU6";

const CONFIG = {

  // ---------- PRODUTO ----------
  productName: "Jardim das Suculentas Fofinhas",
  price: "R$9,90",           // preço exibido na barra móvel, botão flutuante etc.
  checkoutUrl: checkoutUrl,  // usa a variável checkoutUrl definida acima

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
  initScrollAnimations();
  initMobileBuyBar();
  initFloatingBuyButton();
  initBackToTop();
});

/* ---------- Aplica nome / preço / link de checkout em todos os CTAs ---------- */
function applyProductConfig() {
  document.querySelectorAll(".mbb-title").forEach(el => (el.textContent = CONFIG.productName));
  document.querySelectorAll(".mbb-price").forEach(el => (el.textContent = CONFIG.price));

  ["cta-hero", "cta-final", "cta-countdown", "mbb-cta"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("href", CONFIG.checkoutUrl);
      el.setAttribute("target", "_blank");        // abre o checkout em uma nova aba
      el.setAttribute("rel", "noopener noreferrer");
    }
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

/* ---------- ANIMAÇÕES DE ENTRADA (Intersection Observer) ---------- */
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
