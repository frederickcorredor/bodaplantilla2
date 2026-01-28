// ===============================
// Invitación digital - JS ordenado
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // 0) Pantalla previa (abre la invitación + habilita autoplay por interacción)
  // -------------------------------
  const introOverlay = document.getElementById("intro-overlay");
  const enterBtn = document.getElementById("enter-btn");
  const pageContent = document.getElementById("page-content");
  const heartsLayer = document.getElementById("hearts-rain");

  let heartsInterval = null;

  function startHeartsRain() {
    if (!heartsLayer) return;

    const MAX_HEARTS = 20;

    function createHeart() {
      if (heartsLayer.childElementCount > MAX_HEARTS) return;

      const heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = Math.random() > 0.15 ? "❤" : "💍";

      const left = Math.random() * 100; // vw
      const size = 12 + Math.random() * 18; // px
      const dur = 6 + Math.random() * 14; // s
      const drift = (Math.random() * 40 - 10).toFixed(2); // px

      heart.style.left = left + "vw";
      heart.style.fontSize = size + "px";
      heart.style.animationDuration = dur + "s";
      heart.style.setProperty("--drift", drift + "px");
      heart.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);

      heartsLayer.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, (dur + 0.2) * 1000);
    }

    if (!heartsInterval) {
      heartsInterval = setInterval(createHeart, 180);
    }
  }

  function stopHeartsRain() {
    if (heartsInterval) {
      clearInterval(heartsInterval);
      heartsInterval = null;
    }
    if (heartsLayer) heartsLayer.innerHTML = "";
  }


  // -------------------------------
  // 1) Reveal on scroll (IntersectionObserver)
  // -------------------------------
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  

  // -------------------------------
  // 2) Música de fondo
  // -------------------------------
  const musicBtn = document.getElementById("music-btn");
  const music = document.getElementById("bg-music");
  let playing = false;

  if (musicBtn && music) {
    musicBtn.addEventListener("click", async () => {
      try {
        if (!playing) {
          await music.play();
          musicBtn.textContent = "⏸ Pausar música";
        } else {
          music.pause();
          musicBtn.textContent = "🎵 Música";
        }
        playing = !playing;
      } catch (err) {
        // Si el navegador bloquea autoplay o hay error, no se rompe el resto
        console.warn("No se pudo reproducir la música:", err);
      }
    });

  // Abrir invitación (muestra contenido + inicia música + lluvia de corazones)
  if (enterBtn && pageContent && introOverlay) {
    enterBtn.addEventListener("click", async () => {
      pageContent.classList.remove("is-hidden");
      introOverlay.classList.add("is-leaving");

      // intenta reproducir música (al venir de un click, el navegador lo permite)
      if (music) {
        try {
          await music.play();
          playing = true;
          if (musicBtn) musicBtn.textContent = "⏸ Pausar música";
        } catch (err) {
          console.warn("Autoplay bloqueado o error al reproducir música:", err);
        }
      }

      startHeartsRain();

      // Oculta overlay después de animación
      setTimeout(() => {
        introOverlay.style.display = "none";
      }, 420);
    });
  }


  }

  // -------------------------------
  // 3) Cuenta regresiva
  // -------------------------------
  const weddingDate = new Date("June 6, 2026 16:00:00").getTime();

  // -------------------------------
// Mini calendario automático (desde weddingDate)
// -------------------------------
(function buildMiniCalendar() {
  const calEl = document.getElementById("mini-cal");
  if (!calEl) return;

  const wd = new Date(weddingDate); // weddingDate ya es timestamp
  const y = wd.getFullYear();
  const m = wd.getMonth(); // 0-11
  const dWedding = wd.getDate();

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // Lunes = 0, ... Domingo = 6
  const firstDay = new Date(y, m, 1);
  const jsDow = firstDay.getDay();         // 0=Dom,1=Lun...6=Sáb
  const offset = (jsDow + 6) % 7;          // convierte a 0=Lun..6=Dom
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  calEl.innerHTML = `
    <div class="mini-cal-head">
      <div class="mini-cal-month">${monthNames[m]}</div>
      <div class="mini-cal-year">${y}</div>
    </div>
    <div class="mini-cal-grid" role="grid" aria-label="Días del mes">
      <div class="mc-dow">L</div><div class="mc-dow">M</div><div class="mc-dow">M</div>
      <div class="mc-dow">J</div><div class="mc-dow">V</div><div class="mc-dow">S</div><div class="mc-dow">D</div>
    </div>
  `;

  const grid = calEl.querySelector(".mini-cal-grid");

  // Vacíos iniciales
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "mc-day is-empty";
    grid.appendChild(empty);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "mc-day";

    if (day === dWedding) {
      cell.classList.add("is-wedding");
      cell.innerHTML = `
        <span class="mc-num">${day}</span>
        <svg class="mc-heart" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 54s-18-10.8-24.6-22.2C2.3 22.4 6.9 12 18.2 12c6 0 10 3.4 13.8 8.1C35.8 15.4 39.8 12 45.8 12c11.3 0 15.9 10.4 10.8 19.8C50 43.2 32 54 32 54z"/>
        </svg>
      `;
    } else {
      cell.textContent = day;
    }

    grid.appendChild(cell);
  }

  // Relleno final para cerrar la última fila (opcional, se ve más “pro”)
  const totalCells = 7 + offset + daysInMonth; // 7 headers + celdas
  const remainder = totalCells % 7;
  if (remainder !== 0) {
    const toAdd = 7 - remainder;
    for (let i = 0; i < toAdd; i++) {
      const empty = document.createElement("div");
      empty.className = "mc-day is-empty";
      grid.appendChild(empty);
    }
  }

  
})();




  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl) return;

    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------
  // 4) Nombre del invitado desde el hash (#Nombre%20Apellido)
  // -------------------------------
  const guestNameEl = document.getElementById("guest-name");
if (guestNameEl) {
  let hash = window.location.hash.slice(1).trim();

  if (!hash) {
    guestNameEl.textContent = "Invitado";
  } else {
    try {
      // Maneja nombres con espacios y caracteres especiales
      const safeName = decodeURIComponent(hash.replace(/\+/g, " "));
      guestNameEl.textContent = safeName;
    } catch (e) {
      // Si el hash está malformado, no rompe la página
      console.warn("Hash inválido, usando valor sin decodificar:", hash);
      guestNameEl.textContent = hash;
    }
  }
}



  // -------------------------------
  // 5) Modal RSVP + formulario obligatorio
  // -------------------------------
  const openRsvpBtn = document.getElementById("open-rsvp");
  const modal = document.getElementById("rsvp-modal");
  const form = document.getElementById("rsvp-form");
  const successMsg = document.getElementById("rsvp-success");

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    // foco al primer campo
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  if (openRsvpBtn && modal) {
    openRsvpBtn.addEventListener("click", openModal);

    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute("data-close") === "true") {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validación HTML5 (required/email)
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Aquí podrías enviar los datos a tu backend/Google Sheets si quieres
      // const data = Object.fromEntries(new FormData(form).entries());
      // console.log(data);

      form.reset();
      if (successMsg) {
        successMsg.hidden = false;
        setTimeout(() => (successMsg.hidden = true), 3500);
      }
      closeModal();
    });
  }


    // -------------------------------
  // 6) Carrusel (auto + control usuario)
  // -------------------------------
  const carousel = document.getElementById("carousel");
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = carousel?.querySelector(".prev");
  const nextBtn = carousel?.querySelector(".next");

  if (carousel && track) {
    const slides = Array.from(track.querySelectorAll(".slide"));
    let index = 0;
    let autoTimer = null;
    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    // Crear dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "carousel-dot" + (i === 0 ? " is-active" : "");
        b.setAttribute("aria-label", `Ir a foto ${i + 1}`);
        b.addEventListener("click", () => goTo(i, true));
        dotsWrap.appendChild(b);
      });
    }

    function setActiveDot(i) {
      if (!dotsWrap) return;
      const dots = dotsWrap.querySelectorAll(".carousel-dot");
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
    }

    function slideWidth() {
      // ancho real del slide + gap (si hay)
      const first = slides[0];
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      return first.getBoundingClientRect().width + gap;
    }

    function goTo(i, userAction = false) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: index * slideWidth(), behavior: "smooth" });
      setActiveDot(index);
      if (userAction) restartAuto();
    }

    function next(userAction = false) { goTo(index + 1, userAction); }
    function prev(userAction = false) { goTo(index - 1, userAction); }

    // Botones
    prevBtn?.addEventListener("click", () => prev(true));
    nextBtn?.addEventListener("click", () => next(true));

    // Arrastrar con mouse/touch
    const onDown = (clientX) => {
      isPointerDown = true;
      startX = clientX;
      startScrollLeft = track.scrollLeft;
      stopAuto();
    };

    const onMove = (clientX) => {
      if (!isPointerDown) return;
      const dx = clientX - startX;
      track.scrollLeft = startScrollLeft - dx;
    };

    const onUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;

      // "snap" al slide más cercano
      const w = slideWidth();
      const nearest = w ? Math.round(track.scrollLeft / w) : 0;
      goTo(nearest, true);
    };

    track.addEventListener("mousedown", (e) => onDown(e.clientX));
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", onUp);

    track.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
    track.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
    track.addEventListener("touchend", onUp);

    // Actualiza índice cuando el usuario hace scroll manual
    let scrollStopTimer = null;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        const w = slideWidth();
        const nearest = w ? Math.round(track.scrollLeft / w) : 0;
        index = Math.max(0, Math.min(nearest, slides.length - 1));
        setActiveDot(index);
      }, 120);
    });

    // Autoplay (pausa al hover)
    function startAuto() {
      if (autoTimer) return;
      autoTimer = setInterval(() => next(false), 3200);
    }
    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    function restartAuto() {
      stopAuto();
      startAuto();
    }

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    // Por si el usuario toca en móvil (pausar mientras interactúa)
    carousel.addEventListener("touchstart", stopAuto, { passive: true });
    carousel.addEventListener("touchend", startAuto, { passive: true });

    // Iniciar
    startAuto();

    // Si cambia el tamaño de pantalla, reajusta posición
    window.addEventListener("resize", () => goTo(index, false));
  }

});

// -------------------------------
// 5) Parallax del hero (scroll)
// -------------------------------
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.style.backgroundPositionY = window.scrollY * 0.4 + "px";
});
