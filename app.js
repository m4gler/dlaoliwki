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

  const counterMessageEl = document.getElementById('counter-live-message');
  if (counterMessageEl && config.counterMessage) {
    counterMessageEl.textContent = config.counterMessage;
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
    const letterPs = document.getElementById('letter-ps');

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
    if (letterPs) {
      if (config.letter.ps) {
        letterPs.textContent = config.letter.ps;
        letterPs.style.display = 'block';
      } else {
        letterPs.style.display = 'none';
      }
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

  // ---------------------------------------------------------------------------
  // 2. ODTWARZACZ MUZYKI W TLE I PLAYLISTA
  // ---------------------------------------------------------------------------
  const playlist = (config.music && config.music.length > 0) ? config.music : [
    { title: "Airplanes ✈️", src: "assets/airplanes.m4a" },
    { title: "Stereo Hearts 📻", src: "assets/stereo_hearts.m4a" },
    { title: "Self Aware 🎧", src: "assets/self_aware.m4a" }
  ];

  let currentTrackIdx = 0;
  let isMusicPlaying = false;
  let hasUserPaused = false;
  let userInteracted = false;

  const bgAudio = new Audio();
  bgAudio.preload = 'auto';
  bgAudio.volume = 0.65;

  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const musicLabel = document.getElementById('music-label');
  const equalizerBars = document.getElementById('equalizer-bars');
  const nextTrackBtn = document.getElementById('next-track-btn');

  function updatePlayerUI() {
    const track = playlist[currentTrackIdx];
    if (musicLabel && track) {
      musicLabel.textContent = track.title || 'Muzyka';
      if (soundBtn) soundBtn.title = `Odtwarzaj / Pauza: ${track.fullTitle || track.title}`;
    }
    if (soundIcon) {
      soundIcon.textContent = isMusicPlaying ? '⏸️' : '▶️';
    }
    if (equalizerBars) {
      if (isMusicPlaying) {
        equalizerBars.classList.add('playing');
      } else {
        equalizerBars.classList.remove('playing');
      }
    }
  }

  function loadTrack(index) {
    currentTrackIdx = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrackIdx];
    bgAudio.src = track.src;
    updatePlayerUI();
  }

  function playTrack(index) {
    if (typeof index === 'number' && index !== currentTrackIdx) {
      loadTrack(index);
    }
    initAudio();
    bgAudio.play().then(() => {
      isMusicPlaying = true;
      hasUserPaused = false;
      updatePlayerUI();
    }).catch(e => {
      console.log('Autoplay request:', e);
    });
  }

  function pauseTrack() {
    bgAudio.pause();
    isMusicPlaying = false;
    hasUserPaused = true;
    updatePlayerUI();
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrackIdx);
    }
  }

  function nextTrack() {
    playPopSound();
    loadTrack(currentTrackIdx + 1);
    playTrack(currentTrackIdx);
  }

  // Pierwsza piosenka: Airplanes (indeks 0)
  loadTrack(0);

  // Po skończeniu piosenki - odtwarzaj następną
  bgAudio.addEventListener('ended', () => {
    nextTrack();
  });

  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userInteracted = true;
      toggleMusic();
    });
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userInteracted = true;
      nextTrack();
    });
  }

  // Autostart Airplanes przy pierwszej interakcji ze stroną
  document.addEventListener('pointerdown', () => {
    if (!userInteracted && !isMusicPlaying && !hasUserPaused) {
      userInteracted = true;
      playTrack(0);
    }
  }, { once: true });

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
  const letterCloseBtn = document.getElementById('letter-close-btn');
  const letterFoldBtn = document.getElementById('letter-fold-btn');
  const letterPaper = document.getElementById('letter-paper');
  let hasOpenedEnvelope = false;

  function openEnvelope() {
    initAudio();
    if (envelope && !envelope.classList.contains('open')) {
      envelope.classList.add('open');
      playMagicSound();
      if (!hasOpenedEnvelope && window.confetti) {
        hasOpenedEnvelope = true;
        fireHeartConfetti();
      }
    }
  }

  function closeEnvelope(e) {
    if (e) e.stopPropagation();
    if (envelope && envelope.classList.contains('open')) {
      envelope.classList.remove('open');
      playPopSound();
    }
  }

  if (seal) seal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  if (envelope) {
    envelope.addEventListener('click', () => {
      if (!envelope.classList.contains('open')) {
        openEnvelope();
      }
    });
  }

  if (letterPaper) {
    letterPaper.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (letterCloseBtn) letterCloseBtn.addEventListener('click', closeEnvelope);
  if (letterFoldBtn) letterFoldBtn.addEventListener('click', closeEnvelope);

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
  // 6. GALERIA ZDJĘĆ, INDEXTEDDB (DODAWANIE WSPOMNIEŃ PRZEZ OLIWIĘ) & LIGHTBOX
  // ---------------------------------------------------------------------------
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // Elementy modala dodawania wspomnienia
  const memoryModal = document.getElementById('memory-modal');
  const memoryModalClose = document.getElementById('memory-modal-close');
  const memoryBackdrop = document.getElementById('memory-backdrop');
  const memoryCancelBtn = document.getElementById('memory-cancel-btn');
  const memoryForm = document.getElementById('memory-form');
  const memoryFileInput = document.getElementById('memory-file-input');
  const fileDropZone = document.getElementById('file-drop-zone');
  const uploadPlaceholder = document.getElementById('upload-placeholder');
  const uploadPreview = document.getElementById('upload-preview');
  const previewImg = document.getElementById('preview-img');
  const changeImgBtn = document.getElementById('change-img-btn');
  const memoryCaptionInput = document.getElementById('memory-caption');
  const memoryDateInput = document.getElementById('memory-date');
  const openMemoryModalBtn = document.getElementById('open-memory-modal-btn');

  let activeCardIndex = 0;
  let activePhotoIndex = 0;
  let allGalleryItems = [];
  let multiPhotoTimers = [];
  let stagedImageDataUrl = null;

  // --- OBSŁUGA BAZY DANYCH INDEXEDDB (trwały zapis w przeglądarce) ---
  const DB_NAME = 'OliwkaMemoriesDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'memories';

  function openMemoriesDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        console.warn('IndexedDB niedostępne:', req.error);
        resolve(null);
      };
    });
  }

  async function getStoredMemories() {
    const db = await openMemoriesDB();
    if (!db) {
      try {
        const fallback = localStorage.getItem('oliwka_custom_memories');
        return fallback ? JSON.parse(fallback) : [];
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async function saveStoredMemory(item) {
    const db = await openMemoriesDB();
    if (!db) {
      try {
        const current = await getStoredMemories();
        const newItem = { id: Date.now(), ...item };
        current.push(newItem);
        localStorage.setItem('oliwka_custom_memories', JSON.stringify(current));
        return newItem;
      } catch (e) {
        return null;
      }
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(item);
        req.onsuccess = (e) => resolve({ id: e.target.result, ...item });
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function deleteStoredMemory(id) {
    const db = await openMemoriesDB();
    if (!db) {
      try {
        let current = await getStoredMemories();
        current = current.filter(m => m.id !== id);
        localStorage.setItem('oliwka_custom_memories', JSON.stringify(current));
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  // --- KOMPRESJA ZDJĘCIA (aby działało błyskawicznie i mieściło się bez problemu) ---
  function compressImage(file, maxDimension = 1400, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Generujemy zoptymalizowany JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Błąd podczas wczytywania zdjęcia"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Błąd odczytu pliku"));
      reader.readAsDataURL(file);
    });
  }

  // --- RENDEROWANIE CAŁEJ GALERII (POCZĄTKOWE + WŁASNE WSPOMNIENIA OLIWII) ---
  async function renderGallery() {
    if (!galleryGrid) return;

    // Czyścimy poprzednie timery karuzel
    multiPhotoTimers.forEach(timer => clearInterval(timer));
    multiPhotoTimers = [];

    const customMemories = await getStoredMemories();
    const baseGallery = Array.isArray(config.gallery) ? config.gallery : [];
    allGalleryItems = [...baseGallery, ...customMemories];

    let html = allGalleryItems.map((item, index) => {
      const isCustom = Boolean(item.id);
      const hasMultiple = Array.isArray(item.images) && item.images.length > 1;
      const initialImg = hasMultiple ? item.images[0] : item.url;
      const badgeHtml = hasMultiple 
        ? `<span class="photo-count-badge">📸 ${item.images.length} zdjęć</span>` 
        : '';
      const deleteBtnHtml = isCustom 
        ? `<button class="delete-memory-btn" title="Usuń to wspomnienie" data-id="${item.id}">✕</button>` 
        : '';
      const dotsHtml = hasMultiple ? `
        <div class="card-dots" id="dots-card-${index}">
          ${item.images.map((_, i) => `<span class="card-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      ` : '';

      return `
        <div class="polaroid-card ${hasMultiple ? 'has-multiple' : ''}" data-index="${index}">
          ${deleteBtnHtml}
          <div class="polaroid-img-wrapper">
            <img src="${initialImg}" alt="${item.caption || 'Wspomnienie'}" loading="lazy" id="card-img-${index}">
            ${badgeHtml}
            ${dotsHtml}
          </div>
          <p class="polaroid-caption">${item.caption || ''}</p>
          <span class="polaroid-date">${item.date || ''}</span>
        </div>
      `;
    }).join('');

    // Dodajemy interaktywny kafelek "+ Dodaj kolejne wspomnienie" na końcu galerii
    html += `
      <div class="polaroid-card add-card" id="grid-add-memory-card" role="button" tabindex="0" title="Dodaj nowe wspomnienie do galerii">
        <div class="add-card-icon">+</div>
        <div class="add-card-title">Dodaj kolejne wspomnienie</div>
        <div class="add-card-desc">Kliknij tutaj, aby wrzucić Wasze nowe wspólne zdjęcie i opis! 📸💕</div>
      </div>
    `;

    galleryGrid.innerHTML = html;

    // Automatyczna rotacja zdjęć w kafelkach z wieloma zdjęciami
    allGalleryItems.forEach((item, index) => {
      if (Array.isArray(item.images) && item.images.length > 1) {
        let currentIdx = 0;
        const imgEl = document.getElementById(`card-img-${index}`);
        const dotsContainer = document.getElementById(`dots-card-${index}`);

        const timer = setInterval(() => {
          currentIdx = (currentIdx + 1) % item.images.length;
          if (imgEl) {
            imgEl.style.opacity = '0.6';
            setTimeout(() => {
              imgEl.src = item.images[currentIdx];
              imgEl.style.opacity = '1';
            }, 140);
          }
          if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.card-dot');
            dots.forEach((dot, dIdx) => {
              dot.classList.toggle('active', dIdx === currentIdx);
            });
          }
        }, 1800);

        multiPhotoTimers.push(timer);
      }
    });

    // Obsługa kliknięcia kafelka galerii (otwarcie lightboxa)
    galleryGrid.querySelectorAll('.polaroid-card:not(.add-card)').forEach(card => {
      card.addEventListener('click', (e) => {
        // Ignoruj kliknięcie w przycisk usuwania
        if (e.target.closest('.delete-memory-btn')) return;
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx, 0);
      });
    });

    // Obsługa kliknięcia kafelka "+ Dodaj"
    const gridAddBtn = document.getElementById('grid-add-memory-card');
    if (gridAddBtn) {
      gridAddBtn.addEventListener('click', openMemoryModal);
    }

    // Obsługa usuwania wspomnienia
    galleryGrid.querySelectorAll('.delete-memory-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (confirm('Czy na pewno chcesz usunąć to dodane wspomnienie?')) {
          await deleteStoredMemory(id);
          playPopSound();
          renderGallery();
        }
      });
    });
  }

  // --- OBSŁUGA LIGHTBOXA ---
  function openLightbox(cardIdx, photoIdx = 0) {
    if (!lightbox || !allGalleryItems[cardIdx]) return;
    activeCardIndex = cardIdx;
    activePhotoIndex = photoIdx;
    updateLightbox();
    lightbox.classList.remove('hidden');
    playPopSound();
  }

  function updateLightbox() {
    const item = allGalleryItems[activeCardIndex];
    if (!item) return;

    const hasMultiple = Array.isArray(item.images) && item.images.length > 1;
    const totalPhotos = hasMultiple ? item.images.length : 1;
    const currentSrc = hasMultiple ? item.images[activePhotoIndex] : item.url;

    if (lightboxImg) {
      lightboxImg.style.opacity = '0.3';
      setTimeout(() => {
        lightboxImg.src = currentSrc;
        lightboxImg.style.opacity = '1';
      }, 120);
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption || '';
    }

    if (lightboxCounter) {
      if (hasMultiple) {
        lightboxCounter.textContent = `${activePhotoIndex + 1} / ${totalPhotos}`;
        lightboxCounter.style.display = 'block';
      } else {
        lightboxCounter.textContent = `${activeCardIndex + 1} / ${allGalleryItems.length}`;
        lightboxCounter.style.display = 'block';
      }
    }

    if (lightboxPrev) lightboxPrev.style.display = 'flex';
    if (lightboxNext) lightboxNext.style.display = 'flex';
  }

  function prevPhoto() {
    const item = allGalleryItems[activeCardIndex];
    if (!item) return;
    const hasMultiple = Array.isArray(item.images) && item.images.length > 1;

    if (hasMultiple) {
      activePhotoIndex = (activePhotoIndex - 1 + item.images.length) % item.images.length;
    } else {
      activeCardIndex = (activeCardIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
      activePhotoIndex = 0;
    }
    updateLightbox();
    playPopSound();
  }

  function nextPhoto() {
    const item = allGalleryItems[activeCardIndex];
    if (!item) return;
    const hasMultiple = Array.isArray(item.images) && item.images.length > 1;

    if (hasMultiple) {
      activePhotoIndex = (activePhotoIndex + 1) % item.images.length;
    } else {
      activeCardIndex = (activeCardIndex + 1) % allGalleryItems.length;
      activePhotoIndex = 0;
    }
    updateLightbox();
    playPopSound();
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.add('hidden');
  }

  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // --- OBSŁUGA MODALA DODAWANIA WSPOMNIEŃ ---
  function openMemoryModal() {
    if (!memoryModal) return;
    memoryModal.classList.remove('hidden');
    resetMemoryForm();
    playPopSound();
  }

  function closeMemoryModal() {
    if (!memoryModal) return;
    memoryModal.classList.add('hidden');
    resetMemoryForm();
  }

  function resetMemoryForm() {
    stagedImageDataUrl = null;
    if (memoryForm) memoryForm.reset();
    if (memoryFileInput) memoryFileInput.value = '';
    if (uploadPreview) uploadPreview.classList.add('hidden');
    if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
    if (previewImg) previewImg.src = '';
  }

  async function handleFileSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Proszę wybrać plik graficzny (zdjęcie)!');
      return;
    }

    try {
      if (uploadPlaceholder) {
        uploadPlaceholder.innerHTML = `<span class="upload-icon">⏳</span><span class="upload-text">Przetwarzanie zdjęcia...</span>`;
      }
      const compressedDataUrl = await compressImage(file, 1400, 0.85);
      stagedImageDataUrl = compressedDataUrl;

      if (previewImg) previewImg.src = compressedDataUrl;
      if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
      if (uploadPreview) uploadPreview.classList.remove('hidden');
      playPopSound();
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd podczas wczytywania zdjęcia. Spróbuj wybrać inne!');
      resetMemoryForm();
    }
  }

  if (openMemoryModalBtn) {
    openMemoryModalBtn.addEventListener('click', openMemoryModal);
  }
  if (memoryModalClose) {
    memoryModalClose.addEventListener('click', closeMemoryModal);
  }
  if (memoryCancelBtn) {
    memoryCancelBtn.addEventListener('click', closeMemoryModal);
  }
  if (memoryBackdrop) {
    memoryBackdrop.addEventListener('click', closeMemoryModal);
  }

  if (memoryFileInput) {
    memoryFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFileSelected(file);
    });
  }

  if (changeImgBtn) {
    changeImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (memoryFileInput) memoryFileInput.click();
    });
  }

  // Drag and drop w strefie uploadu
  if (fileDropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      fileDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      fileDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileDropZone.classList.remove('dragover');
      });
    });

    fileDropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelected(files[0]);
      }
    });
  }

  // Zapis formularza
  if (memoryForm) {
    memoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!stagedImageDataUrl) {
        alert('Proszę wybrać lub przeciągnąć zdjęcie! 📷');
        return;
      }

      const captionVal = (memoryCaptionInput ? memoryCaptionInput.value : '').trim();
      if (!captionVal) {
        alert('Napisz chociaż krótki podpis lub wspomnienie! 💕');
        return;
      }

      const dateVal = (memoryDateInput ? memoryDateInput.value : '').trim();

      const newMemory = {
        url: stagedImageDataUrl,
        caption: captionVal,
        date: dateVal,
        createdAt: Date.now()
      };

      const submitBtn = document.getElementById('memory-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Zapisywanie... ✨';
      }

      try {
        await saveStoredMemory(newMemory);
        closeMemoryModal();
        await renderGallery();
        playSuccessSound();

        // Efekt konfetti serduszkowego
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            spawnFloatingHeart(
              Math.random() * window.innerWidth,
              window.innerHeight - 80,
              ['💖', '📸', '✨', '🥰', '💕'][Math.floor(Math.random() * 5)]
            );
          }, i * 50);
        }
      } catch (err) {
        console.error('Błąd zapisu wspomnienia:', err);
        alert('Nie udało się zapisać zdjęcia. Sprawdź, czy masz wolne miejsce w przeglądarce!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Zapisz wspomnienie 💖';
        }
      }
    });
  }

  // Klawisz Escape zamyka otwarty modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (memoryModal && !memoryModal.classList.contains('hidden')) {
        closeMemoryModal();
      }
    }
  });

  // Startowe załadowanie galerii
  renderGallery();

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    }
  });

  // Obsługa gestów swipe na telefonie w lightboxie
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) prevPhoto();
        else nextPhoto();
      }
    }, { passive: true });
  }

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
        const letter = ['A', 'B', 'C', 'D'][index] || '';
        btn.innerHTML = `<span class="opt-letter">${letter}</span><span class="opt-text">${optText}</span>`;
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

    const cheerEl = document.getElementById('result-cheer-text');
    if (cheerEl) {
      if (percent === 100) {
        cheerEl.textContent = "100% poprawnych odpowiedzi! Znasz naszą historię perfekcyjnie, jesteś najcudowniejsza! 🏆🥰❤️";
      } else if (percent >= 75) {
        cheerEl.textContent = "Prawie bezbłędnie! Znasz nas lepiej niż ktokolwiek inny na świecie! 🥰✨";
      } else {
        cheerEl.textContent = "Najważniejsze, że od teraz piszemy kolejne wspólne wspomnienia każdego dnia! 🥰❤️";
      }
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
