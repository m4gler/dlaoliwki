// =============================================================================
// LOGIKA STRONY DLA OLIWII ❤️
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const config = window.CONFIG || {};

  // ---------------------------------------------------------------------------
  // 1. INICJALIZACJA DANYCH Z CONFIG
  // ---------------------------------------------------------------------------
  const herName = config.herName || "Oliwia";
  document.title = config.title || `Dla ${herName} ❤️`;
  
  const titleEl = document.getElementById('main-title');
  if (titleEl) {
    titleEl.innerHTML = `Dla <span class="gradient-text">${herName}</span> <span class="heart-glow">❤️</span>`;
  }

  const subtitleEl = document.getElementById('main-subtitle');
  if (subtitleEl && config.subtitle) {
    subtitleEl.textContent = config.subtitle;
  }

  const footerNameEl = document.getElementById('footer-name');
  if (footerNameEl) footerNameEl.textContent = herName;

  // Data rozpoczęcia w stopce
  const footerDateEl = document.getElementById('footer-date');
  if (footerDateEl && config.startDate) {
    const startDateObj = new Date(config.startDate);
    footerDateEl.textContent = startDateObj.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Wypełnienie treści listu
  if (config.letter) {
    const letterTitle = document.getElementById('letter-title');
    const letterBody = document.getElementById('letter-body');
    const letterSignature = document.getElementById('letter-signature');

    if (letterTitle && config.letter.title) {
      letterTitle.textContent = config.letter.title;
    }
    if (letterBody && Array.isArray(config.letter.paragraphs)) {
      letterBody.innerHTML = config.letter.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
    }
    if (letterSignature && config.letter.sign) {
      letterSignature.textContent = config.letter.sign;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. SYNTEZATOR DŹWIĘKÓW (Web Audio API - bez zewnętrznych plików)
  // ---------------------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignorujemy błędy audio w trybie cichym przeglądarki
    }
  }

  function playPopSound() {
    playTone(520, 'sine', 0.1, 0.12);
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    initAudio();
    setTimeout(() => playTone(523.25, 'triangle', 0.12, 0.12), 0);   // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.12), 80);  // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.15), 160); // G5
  }

  function playWrongSound() {
    if (!soundEnabled) return;
    initAudio();
    setTimeout(() => playTone(300, 'sawtooth', 0.15, 0.08), 0);
    setTimeout(() => playTone(240, 'sawtooth', 0.25, 0.08), 120);
  }

  function playMagicSound() {
    if (!soundEnabled) return;
    initAudio();
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 0.25, 0.08), idx * 60);
    });
  }

  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn && soundIcon) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) {
        initAudio();
        playPopSound();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. LICZNIK CZASU RAZEM (Na żywo co sekundę)
  // ---------------------------------------------------------------------------
  const startDate = new Date(config.startDate || "2026-09-04T20:00:00");
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-minutes');
  const secsEl = document.getElementById('count-seconds');

  function updateCounter() {
    const now = new Date();
    let diff = Math.max(0, now.getTime() - startDate.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  // ---------------------------------------------------------------------------
  // 4. INTERAKTYWNA KOPERTA 3D / LIST
  // ---------------------------------------------------------------------------
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('envelope-seal');
  const loveBtn = document.getElementById('letter-love-btn');
  let hasOpenedEnvelope = false;

  function toggleEnvelope() {
    initAudio();
    if (!envelope.classList.contains('open')) {
      envelope.classList.add('open');
      playMagicSound();
      if (!hasOpenedEnvelope && window.confetti) {
        hasOpenedEnvelope = true;
        fireHeartConfetti();
      }
    }
  }

  if (seal) seal.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEnvelope();
  });
  if (envelope) envelope.addEventListener('click', toggleEnvelope);

  if (loveBtn) {
    loveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSuccessSound();
      incrementHearts(10);
      fireHeartConfetti();
    });
  }

  // ---------------------------------------------------------------------------
  // 5. OBSŁUGA SERDUSZEK I KONFETTI
  // ---------------------------------------------------------------------------
  let totalHearts = 0;
  const heartsCounterEl = document.getElementById('total-hearts-count');
  const floatingHeartBtn = document.getElementById('floating-heart-btn');
  const showerHeartsBtn = document.getElementById('shower-hearts-btn');

  function incrementHearts(amount = 1) {
    totalHearts += amount;
    if (heartsCounterEl) {
      heartsCounterEl.textContent = totalHearts;
      heartsCounterEl.style.transform = 'scale(1.3)';
      setTimeout(() => {
        heartsCounterEl.style.transform = 'scale(1)';
      }, 200);
    }
  }

  function fireHeartConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff2d87', '#ff6584', '#8b3eff', '#00f2fe', '#ffd166'],
        shapes: ['circle']
      });
    }
  }

  if (floatingHeartBtn) {
    floatingHeartBtn.addEventListener('click', () => {
      playPopSound();
      incrementHearts(1);
      fireHeartConfetti();
    });
  }

  if (showerHeartsBtn) {
    showerHeartsBtn.addEventListener('click', () => {
      playMagicSound();
      incrementHearts(20);
      if (typeof confetti === 'function') {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          confetti({
            particleCount: 25,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#ff2d87', '#903eff', '#ff70a6']
          });
        }, 200);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. GALERIA ZDJĘĆ & LIGHTBOX
  // ---------------------------------------------------------------------------
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  if (galleryGrid && Array.isArray(config.gallery)) {
    galleryGrid.innerHTML = config.gallery.map((item, index) => `
      <div class="polaroid-card" data-index="${index}">
        <div class="polaroid-img-wrapper">
          <img src="${item.url}" alt="${item.caption}" loading="lazy">
        </div>
        <p class="polaroid-caption">${item.caption}</p>
        <span class="polaroid-date">${item.date || ''}</span>
      </div>
    `).join('');

    // Obsługa kliknięcia kafelka galerii
    galleryGrid.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        const item = config.gallery[idx];
        if (item && lightbox) {
          playPopSound();
          lightboxImg.src = item.url;
          lightboxCaption.textContent = item.caption;
          lightbox.classList.remove('hidden');
        }
      });
    });
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.add('hidden');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---------------------------------------------------------------------------
  // 7. INTERAKTYWNY QUIZ O WAS
  // ---------------------------------------------------------------------------
  const quizList = config.quiz || [];
  let currentQuizStep = 0;
  let quizScore = 0;

  const progressFill = document.getElementById('quiz-progress');
  const stepText = document.getElementById('quiz-step-text');
  const scoreBadge = document.getElementById('quiz-score-badge');
  const questionText = document.getElementById('quiz-question-text');
  const optionsList = document.getElementById('quiz-options');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('quiz-next-btn');
  const quizCard = document.getElementById('quiz-card');
  const quizResult = document.getElementById('quiz-result');
  const resultScoreDisplay = document.getElementById('result-score-display');
  const restartBtn = document.getElementById('quiz-restart-btn');

  function renderQuizStep() {
    if (!quizList.length) return;

    if (currentQuizStep >= quizList.length) {
      showQuizResults();
      return;
    }

    const currentQ = quizList[currentQuizStep];

    // Pasek postępu
    const progressPercent = ((currentQuizStep + 1) / quizList.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    if (stepText) stepText.textContent = `Pytanie ${currentQuizStep + 1} z ${quizList.length}`;
    if (scoreBadge) scoreBadge.textContent = `Wynik: ${quizScore} pkt`;

    if (questionText) questionText.textContent = currentQ.question;

    if (optionsList) {
      optionsList.innerHTML = '';
      currentQ.options.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = optText;
        btn.addEventListener('click', () => handleOptionClick(index, currentQ));
        optionsList.appendChild(btn);
      });
    }

    if (feedbackBox) feedbackBox.classList.add('hidden');
  }

  function handleOptionClick(selectedIndex, currentQ) {
    initAudio();
    const buttons = optionsList.querySelectorAll('.quiz-option-btn');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIndex === currentQ.correctIndex;

    if (isCorrect) {
      buttons[selectedIndex].classList.add('correct');
      quizScore += 1;
      playSuccessSound();
      if (feedbackIcon) feedbackIcon.textContent = '🎉';
      if (feedbackText) feedbackText.textContent = currentQ.comment || "Idealna odpowiedź! ❤️";
    } else {
      buttons[selectedIndex].classList.add('wrong');
      buttons[currentQ.correctIndex].classList.add('correct');
      playWrongSound();
      if (feedbackIcon) feedbackIcon.textContent = '🤭';
      if (feedbackText) feedbackText.textContent = `Prawie! ${currentQ.comment || ""}`;
    }

    if (scoreBadge) scoreBadge.textContent = `Wynik: ${quizScore} pkt`;
    if (feedbackBox) feedbackBox.classList.remove('hidden');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      playPopSound();
      currentQuizStep++;
      renderQuizStep();
    });
  }

  function showQuizResults() {
    if (quizCard) quizCard.classList.add('hidden');
    if (quizResult) quizResult.classList.remove('hidden');

    const total = quizList.length;
    const percent = Math.round((quizScore / total) * 100);

    if (resultScoreDisplay) {
      resultScoreDisplay.textContent = `Twój wynik: ${quizScore}/${total} (${percent}%)`;
    }

    playMagicSound();
    fireHeartConfetti();
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      playPopSound();
      currentQuizStep = 0;
      quizScore = 0;
      if (quizCard) quizCard.classList.remove('hidden');
      if (quizResult) quizResult.classList.add('hidden');
      renderQuizStep();
    });
  }

  // Start quizu
  renderQuizStep();

  // ---------------------------------------------------------------------------
  // 8. KOSMICZNE TŁO CZĄSTECZEK (CANVAS)
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width < 600 ? 30 : 60, 80);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.isHeart = Math.random() > 0.65;
        this.color = Math.random() > 0.5 ? '#ff2d87' : '#8b3eff';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        if (this.isHeart) {
          // Rysowanie małego serduszka
          const s = this.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.bezierCurveTo(this.x - s, this.y - s, this.x - s * 1.5, this.y + s * 0.5, this.x, this.y + s * 1.5);
          ctx.bezierCurveTo(this.x + s * 1.5, this.y + s * 0.5, this.x + s, this.y - s, this.x, this.y);
          ctx.fill();
        } else {
          // Błyszcząca cząsteczka
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Dodawanie serduszek przy kliknięciu/dotknięciu tła
    window.addEventListener('click', (e) => {
      // Ignorujemy kliknięcia w przyciski i linki
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.envelope')) return;
      incrementHearts(1);
    });
  }
});
