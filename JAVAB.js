// Variables globales
let isPlaying = false;
let currentSlide = 0;
let totalSlides = 0;
let enableMusic = false;

// Funciones globales para los botones del modal
function enterWithMusicClick() {
    enableMusic = true;
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'none';
    }
    activateMusic();
}

function enterWithoutMusicClick() {
    enableMusic = false;
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'none';
    }
    deactivateMusic();
}

function getAudio() {
    return document.getElementById('bgMusic');
}

// Se llama DIRECTAMENTE dentro del toque en "Ingresar con música":
// así Safari (iPhone) y Chrome permiten que suene.
function activateMusic() {
    const audio = getAudio();
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) musicPlayer.style.display = 'block';
    if (!audio) return;
    audio.volume = 1;
    const p = audio.play();
    if (p && p.then) {
        p.then(function () { isPlaying = true; updateMusicIcon(); })
         .catch(function () { isPlaying = false; updateMusicIcon(); });
    } else {
        isPlaying = true; updateMusicIcon();
    }
}

function deactivateMusic() {
    const audio = getAudio();
    if (audio) audio.pause();
    isPlaying = false;
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) musicPlayer.style.display = 'block';
    updateMusicIcon();
}


// Función para configurar los botones directamente
function setupModalButtons() {
    const enterWithMusic = document.getElementById('enterWithMusic');
    const enterWithoutMusic = document.getElementById('enterWithoutMusic');
    const modal = document.getElementById('welcomeModal');

    if (enterWithMusic) {
        enterWithMusic.onclick = function() {
            enableMusic = true;
            if (modal) modal.style.display = 'none';
            activateMusic();
        };
    }

    if (enterWithoutMusic) {
        enterWithoutMusic.onclick = function() {
            enableMusic = false;
            if (modal) modal.style.display = 'none';
            deactivateMusic();
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM cargado, inicializando...');
    initializeCountdown();
    initializeCarousel();
    setupModalButtons();

    // Mostrar el modal de bienvenida para elegir con/sin música
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'flex';
    }

    // Música local (assets/musica.mp3): arranca SOLO con "Ingresar con música".
    const toggle = document.getElementById('musicToggle');
    if (toggle) toggle.addEventListener('click', toggleMusic);
    const audio = getAudio();
    if (audio) {
        audio.addEventListener('play', function () { isPlaying = true; updateMusicIcon(); });
        audio.addEventListener('pause', function () { isPlaying = false; updateMusicIcon(); });
    }
});

// También configurar cuando la página esté completamente cargada
window.addEventListener('load', function() {
    // console.log('Ventana completamente cargada');
    setupModalButtons();
});



function toggleMusic() {
    const audio = getAudio();
    if (!audio) return;
    if (audio.paused) {
        enableMusic = true;
        audio.play().catch(function () {});
    } else {
        audio.pause();
    }
}

function updateMusicIcon() {
    const volumeIcon = document.getElementById('volumeIcon');
    
    if (volumeIcon) {
        if (isPlaying) {
            volumeIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#222" stroke="#fff" stroke-width="1"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08" stroke="#222" stroke-width="2"></path>
                <circle cx="6.5" cy="12" r="1" fill="#ffe27a"/>
            `;
        } else {
            volumeIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#222" stroke="#fff" stroke-width="1"></polygon>
                <line x1="19" y1="9" x2="17" y2="11" stroke="#ff6b6b" stroke-width="2"></line>
                <line x1="17" y1="9" x2="19" y2="11" stroke="#ff6b6b" stroke-width="2"></line>
                <circle cx="6.5" cy="12" r="1" fill="#ff6b6b"/>
            `;
        }
    }
}

// Countdown
function initializeCountdown() {
    const targetDate = new Date('2026-11-28T20:00:00-04:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Carrusel
function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!track) return;

    // calcular total dinámicamente
    const items = track.querySelectorAll('.carousel-item');
    totalSlides = items.length;
    const totalSlidesElement = document.getElementById('totalSlides');
    if (totalSlidesElement) totalSlidesElement.textContent = totalSlides;

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    // Ajuste inicial para asegurar cálculo correcto tras el render
    updateCarousel();
    requestAnimationFrame(updateCarousel);
    setTimeout(updateCarousel, 200);

    // Auto-play del carrusel
    setInterval(() => {
        nextSlide();
    }, 2500);
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        const items = track.querySelectorAll('.carousel-item');
        if (!items.length) return;
        const container = track.parentElement;

        // Temporarily reset transform to measure actual positions
        const previousTransform = track.style.transform;
        track.style.transform = 'none';

        const firstRect = items[0].getBoundingClientRect();
        const secondRect = items[1] ? items[1].getBoundingClientRect() : null;
        const stepWidth = Math.max(1, secondRect ? Math.round(secondRect.left - firstRect.left) : Math.round(firstRect.width));

        const containerWidth = Math.round(container.getBoundingClientRect().width);
        const visibleCount = Math.max(1, Math.floor((containerWidth + 1) / stepWidth));
        const maxIndex = Math.max(0, totalSlides - visibleCount);

        // Detectar si esta actualización implica dar la vuelta (última foto -> primera, o viceversa)
        let wrapped = false;
        if (currentSlide > maxIndex) { currentSlide = 0; wrapped = true; }
        if (currentSlide < 0) { currentSlide = maxIndex; wrapped = true; }

        const trackRect = track.getBoundingClientRect();
        const baseLeft = Math.round(firstRect.left - trackRect.left);
        const translateXpx = -Math.round(baseLeft + (currentSlide * stepWidth));

        if (wrapped) {
            // Salto instantáneo al dar la vuelta, para que no se vea "regresando"
            // animado hacia atrás por todas las fotos.
            track.style.transition = 'none';
            track.style.transform = `translateX(${translateXpx}px)`;
            void track.offsetHeight; // forzar reflow antes de reactivar la transición
            requestAnimationFrame(() => {
                track.style.transition = '';
            });
        } else {
            track.style.transform = `translateX(${translateXpx}px)`;
        }
        // console.log('Carousel moved to slide:', { currentSlide, visibleCount, maxIndex, translateXpx, stepWidth, baseLeft, wrapped });
    }
    updateSlideCounter();
    markCenterCarouselItem();
}

function nextSlide() {
    currentSlide++;
    updateCarousel();
}

function previousSlide() {
    currentSlide--;
    updateCarousel();
}

function updateSlideCounter() {
    const currentSlideElement = document.getElementById('currentSlide');
    const totalSlidesElement = document.getElementById('totalSlides');
    if (currentSlideElement) currentSlideElement.textContent = (currentSlide + 1);
    if (totalSlidesElement) totalSlidesElement.textContent = totalSlides;
}

// Mark center carousel item on desktop
function markCenterCarouselItem() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    if (!items.length) return;
    items.forEach(it => it.classList.remove('is-center'));

    const firstItem = items[0];
    const container = track.parentElement;
    const itemWidth = firstItem.getBoundingClientRect().width;
    const containerWidth = container.getBoundingClientRect().width;
    const visibleCount = Math.max(1, Math.floor(containerWidth / itemWidth));

    const centerIndex = (currentSlide + Math.floor(visibleCount / 2)) % items.length;
    items[centerIndex].classList.add('is-center');
}

// Hook into carousel updates
const _origUpdateCarousel = typeof updateCarousel === 'function' ? updateCarousel : null;
if (_origUpdateCarousel) {
    window.updateCarousel = function() {
        _origUpdateCarousel();
        markCenterCarouselItem();
    };
}

window.addEventListener('resize', markCenterCarouselItem);

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(markCenterCarouselItem, 200);
});

// Funciones de los botones (plantilla de ejemplo: sin enlaces reales)
function openLocation(location) {
    window.open('https://maps.google.com/maps?q=18.4901572%2C-69.7982917&z=17&hl=es', '_blank');
}

function uploadPhoto() {
    window.open('https://photos.app.goo.gl/9EtN4a4RmarUqqmH9', '_blank');
}

function showDressCode() {
    showInfoModal(
        "Código de Vestimenta",
        `<p class="dress-type">Semi formal</p>
         <p>Los colores <strong>rosa</strong> y <strong>verde</strong> están reservados exclusivamente para la quinceañera. Agradecemos amablemente a nuestros invitados elegir otros tonos para su vestuario.</p>
         <div class="banned-colors">
            <div class="banned-item"><span class="banned-swatch" style="background:#f2a6c4" aria-hidden="true"></span><small>Rosa</small></div>
            <div class="banned-item"><span class="banned-swatch" style="background:#7fc79a" aria-hidden="true"></span><small>Verde</small></div>
         </div>`
    );
}

function showNotice() {
    showInfoModal(
        "Aviso Importante",
        `<p>Con mucho cariño, esta celebración ha sido pensada para que la quinceañera comparta una noche especial junto a sus amigos.</p>
         <p>Por tal motivo, les informamos respetuosamente que <strong>no se permitirá la asistencia de niños</strong> durante el evento.</p>
         <p class="notice-thanks">Agradecemos de corazón su comprensión.</p>`
    );
}

function showGifts() {
    window.open('https://invitacionesdigital-04.github.io/Lainy-numerodecuenta/', '_blank');
}

function confirmAttendance() {
    const msg = encodeURIComponent('Hola, confirmo mi asistencia a los XV años de Lainy Anyelis el 28 de noviembre.');
    window.open('https://wa.me/18093160645?text=' + msg, '_blank');
}

// Modal de información (ventana flotante reutilizable, ej. Dress Code)
function showInfoModal(title, bodyHtml) {
    const modal = document.getElementById('infoModal');
    const titleEl = document.getElementById('infoModalTitle');
    const bodyEl = document.getElementById('infoModalBody');
    if (!modal || !titleEl || !bodyEl) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    modal.style.display = 'flex';
}

function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    if (modal) modal.style.display = 'none';
}

// Sistema de Toast
function showToast(title, message) {
    const toast = document.getElementById('toast');
    const toastContent = document.getElementById('toastContent');
    
    toastContent.innerHTML = `
        <h4 style="font-weight: 700; color: #fff; margin-bottom: 0.35rem; letter-spacing: 0.2px;">${title}</h4>
        <p style="color: #ddd;">${message}</p>
    `;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Nota: el efecto de portada ahora se logra 100% con CSS (hero fijo detrás
// del contenido, ver .hero-section y .content en CCSB.css), igual que en
// boda100L. Ya no hace falta mover nada por JS en el scroll.


// Forzar limpieza de caches en clientes antiguos
(function() {
  function clearCaches() {
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister());
      }).catch(() => {});
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clearCaches);
  } else {
    clearCaches();
  }
})();
