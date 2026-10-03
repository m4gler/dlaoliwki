// =============================================================================
// LOGIKA STRONY DLA OLIWII ❤️
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const config = window.CONFIG || {};

  // ---------------------------------------------------------------------------
  // SUPABASE CLIENT INITIALIZATION (ZAPIS W CZASIE RZECZYWISTYM)
  // ---------------------------------------------------------------------------
  const SUPABASE_URL = config.supabaseUrl;
  const SUPABASE_KEY = config.supabaseKey;
  let supabaseClient = null;

  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function' && SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('⚡ Supabase pomyślnie połączony!');
    } catch (e) {
      console.warn('Błąd inicjalizacji Supabase:', e);
      supabaseClient = null;
    }
  }

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
  // 2. SYNTEZATOR DŹWIĘKÓW (Całkowicie wyłączony)
  // ---------------------------------------------------------------------------
  let soundEnabled = false;
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
  let heartSaveDebounce = null;
  const heartsCounterEl = document.getElementById('total-hearts-count');
  const floatingHeartBtn = document.getElementById('floating-heart-btn');
  const showerHeartsBtn = document.getElementById('shower-hearts-btn');

  function updateHeartsUI() {
    if (heartsCounterEl) {
      heartsCounterEl.textContent = totalHearts;
      heartsCounterEl.style.transform = 'scale(1.3)';
      setTimeout(() => {
        heartsCounterEl.style.transform = 'scale(1)';
      }, 200);
    }
  }

  async function fetchGlobalHearts() {
    if (supabaseClient) {
      try {
        const { data } = await supabaseClient
          .from('hearts')
          .select('count')
          .eq('id', 1)
          .single();
        if (data && typeof data.count === 'number') {
          totalHearts = data.count;
          updateHeartsUI();
          return;
        }
      } catch (e) {
        console.warn('Supabase hearts fetch error:', e);
      }
    }
    const stored = localStorage.getItem('oliwka_total_hearts');
    if (stored) {
      totalHearts = parseInt(stored, 10) || 0;
      updateHeartsUI();
    }
  }

  function saveGlobalHearts() {
    localStorage.setItem('oliwka_total_hearts', totalHearts);
    if (heartSaveDebounce) clearTimeout(heartSaveDebounce);
    heartSaveDebounce = setTimeout(async () => {
      if (supabaseClient) {
        try {
          await supabaseClient
            .from('hearts')
            .upsert({ id: 1, count: totalHearts });
        } catch (e) {
          console.warn('Supabase hearts save error:', e);
        }
      }
    }, 400);
  }

  function incrementHearts(amount = 1) {
    totalHearts += amount;
    updateHeartsUI();
    saveGlobalHearts();
  }

  fetchGlobalHearts();

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
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('memories')
          .select('*')
          .order('id', { ascending: true });
        
        if (!error && Array.isArray(data)) {
          return data.map(m => ({
            id: m.id,
            url: m.url,
            caption: m.caption,
            date: m.date || '',
            author: m.author || '',
            images: m.images || null
          }));
        }
      } catch (e) {
        console.warn('Supabase memories fetch error, fallback do lokalu:', e);
      }
    }

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
    if (supabaseClient) {
      try {
        const payload = {
          url: item.url,
          caption: item.caption,
          date: item.date || '',
          author: item.author || '',
          images: item.images || null
        };
        const { data, error } = await supabaseClient
          .from('memories')
          .insert([payload])
          .select();
        
        if (!error && data && data[0]) {
          console.log('Wspomnienie pomyślnie zapisane w chmurze Supabase!');
          return data[0];
        } else {
          console.warn('Supabase insert memories error:', error);
        }
      } catch (e) {
        console.warn('Supabase insert error, fallback do lokalu:', e);
      }
    }

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
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('memories')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase delete error:', e);
      }
    }

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

      const authorClass = (item.author || '').toLowerCase().includes('oliwia') ? 'author-oliwia' : 'author-maks';
      const authorHtml = item.author 
        ? `<span class="polaroid-author-badge ${authorClass}">👤 ${escapeHTML(item.author)}</span>` 
        : '';

      return `
        <div class="polaroid-card ${hasMultiple ? 'has-multiple' : ''}" data-index="${index}">
          ${deleteBtnHtml}
          <div class="polaroid-img-wrapper">
            <img src="${initialImg}" alt="${item.caption || 'Wspomnienie'}" loading="lazy" id="card-img-${index}">
            ${badgeHtml}
            ${dotsHtml}
          </div>
          <p class="polaroid-caption">${item.caption || ''}</p>
          <div class="polaroid-footer-row">
            <span class="polaroid-date">${item.date || ''}</span>
            ${authorHtml}
          </div>
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
      const memoryAuthorInput = document.getElementById('memory-author');
      const authorVal = memoryAuthorInput ? memoryAuthorInput.value : 'Maks ❤️';

      const newMemory = {
        url: stagedImageDataUrl,
        caption: captionVal,
        date: dateVal,
        author: authorVal,
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

  // --- OBSŁUGA EKSPORTU I IMPORTU WSPOMNIEŃ (DLA MAKS & OLIWII) ---
  const exportMemoriesBtn = document.getElementById('export-memories-btn');
  const importMemoriesBtn = document.getElementById('import-memories-btn');
  const importJsonInput = document.getElementById('import-json-input');

  if (exportMemoriesBtn) {
    exportMemoriesBtn.addEventListener('click', async () => {
      const memories = await getStoredMemories();
      const bucketList = await getBucketList();

      const exportData = {
        version: 1,
        createdAt: new Date().toISOString(),
        memories: memories,
        bucketList: bucketList
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `oliwka_dane_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playSuccessSound();
    });
  }

  if (importMemoriesBtn && importJsonInput) {
    importMemoriesBtn.addEventListener('click', () => {
      importJsonInput.click();
    });

    importJsonInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          let memoriesCount = 0;
          let bucketCount = 0;

          if (Array.isArray(importedData)) {
            for (const item of importedData) {
              if (item.url && item.caption) {
                await saveStoredMemory(item);
                memoriesCount++;
              }
            }
          } else if (importedData && typeof importedData === 'object') {
            if (Array.isArray(importedData.memories)) {
              for (const item of importedData.memories) {
                if (item.url && item.caption) {
                  await saveStoredMemory(item);
                  memoriesCount++;
                }
              }
            }
            if (Array.isArray(importedData.bucketList)) {
              saveBucketListLocal(importedData.bucketList);
              bucketCount = importedData.bucketList.length;
            }
          } else {
            alert('Nieprawidłowy format pliku!');
            return;
          }

          await renderGallery();
          renderBucketList();
          playSuccessSound();
          fireHeartConfetti();
          alert(`Pomyślnie zaimportowano! ❤️✨\nWspomnienia: ${memoriesCount}, Marzenia: ${bucketCount}`);
        } catch (err) {
          console.error(err);
          alert('Wystąpił błąd podczas importowania pliku.');
        } finally {
          importJsonInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

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
  // 0. EKRAN WEJŚCIOWY / SPLASH INTRO Z ANIMOWANYM SERCEM I LICZNIKIEM 5S
  // ---------------------------------------------------------------------------
  const entryOverlay = document.getElementById('entry-overlay');
  const entryStep1 = document.getElementById('entry-step-1');
  const entryStep2 = document.getElementById('entry-step-2');
  const entryStartBtn = document.getElementById('entry-start-btn');
  const entryTimerCount = document.getElementById('entry-timer-count');

  let entryCountdownTimer = null;
  let hasEntered = false;

  if (entryOverlay && entryOverlay.style.display !== 'none') {
    document.body.style.overflow = 'hidden';
  }

  function dismissEntryScreen() {
    if (hasEntered) return;
    hasEntered = true;
    if (entryCountdownTimer) clearInterval(entryCountdownTimer);

    document.body.style.overflow = '';

    if (entryOverlay) {
      entryOverlay.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s ease';
      entryOverlay.style.opacity = '0';
      entryOverlay.style.transform = 'scale(1.05)';
      setTimeout(() => {
        entryOverlay.style.display = 'none';
      }, 800);
    }
  }

  function startEntrySequence() {
    initAudio();
    playMagicSound();

    if (entryStep1) entryStep1.classList.add('hidden');
    if (entryStep2) entryStep2.classList.remove('hidden');

    fireHeartConfetti();

    let secondsLeft = 5;
    if (entryTimerCount) entryTimerCount.textContent = secondsLeft;

    entryCountdownTimer = setInterval(() => {
      secondsLeft--;
      if (entryTimerCount) entryTimerCount.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(entryCountdownTimer);
        dismissEntryScreen();
      }
    }, 1000);
  }

  if (entryStartBtn) {
    entryStartBtn.addEventListener('click', startEntrySequence);
  }

  const giantHeartClickable = document.getElementById('giant-heart-clickable');
  if (giantHeartClickable) {
    giantHeartClickable.addEventListener('click', (e) => {
      e.stopPropagation();
      fireHeartConfetti();
      playMagicSound();
      incrementHearts(10);
      setTimeout(() => {
        dismissEntryScreen();
      }, 400);
    });
  }

  const entrySkipBtn = document.getElementById('entry-skip-btn');
  if (entrySkipBtn) {
    entrySkipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissEntryScreen();
    });
  }

  if (entryStep2) {
    entryStep2.addEventListener('click', () => {
      dismissEntryScreen();
    });
  }

  // ---------------------------------------------------------------------------
  // 7. SŁOICZEK Z POWODAMI
  // ---------------------------------------------------------------------------
  const loveNotes = config.loveNotes || [
    "Masz przepiękny uśmiech! 😊❤️",
    "Rozmowy z Tobą zlatują w ułamku sekundy. ⏳✨"
  ];

  const drawNoteBtn = document.getElementById('draw-note-btn');
  const noteDisplayCard = document.getElementById('note-display-card');
  const noteTextContent = document.getElementById('note-text-content');
  const nextNoteBtn = document.getElementById('next-note-btn');

  let lastNoteIdx = -1;

  function drawRandomNote() {
    if (!loveNotes.length) return;
    initAudio();
    playMagicSound();

    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * loveNotes.length);
    } while (loveNotes.length > 1 && randIdx === lastNoteIdx);
    lastNoteIdx = randIdx;

    if (drawNoteBtn) drawNoteBtn.classList.add('hidden');
    if (noteDisplayCard) {
      noteDisplayCard.classList.remove('hidden');
      noteDisplayCard.style.animation = 'none';
      void noteDisplayCard.offsetWidth; // Force reflow
      noteDisplayCard.style.animation = 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (noteTextContent) {
      noteTextContent.textContent = loveNotes[randIdx];
    }
    fireHeartConfetti();
  }

  if (drawNoteBtn) drawNoteBtn.addEventListener('click', drawRandomNote);
  if (nextNoteBtn) nextNoteBtn.addEventListener('click', drawRandomNote);

  // ---------------------------------------------------------------------------
  // 8. RULETKA RANDKOWA / GENERATOR POMYSŁÓW
  // ---------------------------------------------------------------------------
  const dateIdeas = config.dateIdeas || [
    { text: "Wyjście na lody & spacer 🍦🌅", icon: "🍦" },
    { text: "Maraton filmowy z pizzą 🎬🍕", icon: "🍿" }
  ];

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
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.envelope') || e.target.closest('.bucket-item')) return;
      incrementHearts(1);
    });
  }

  // ---------------------------------------------------------------------------
  // OBSŁUGA NASZEJ LISTY 📝✨ (Z SYNCHRONIZACJĄ SUPABASE)
  // ---------------------------------------------------------------------------
  const BUCKET_STORAGE_KEY = 'oliwia_bucket_list_v1';
  const bucketListGrid = document.getElementById('bucket-list-grid');
  const addBucketForm = document.getElementById('add-bucket-form');
  const bucketInput = document.getElementById('bucket-input');

  async function getBucketList() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('list_items')
          .select('*')
          .order('id', { ascending: true });

        if (!error && Array.isArray(data)) {
          if (data.length > 0) {
            return data.map(item => ({
              id: item.id,
              title: item.title,
              completed: Boolean(item.completed),
              author: item.author || ''
            }));
          } else if (Array.isArray(config.bucketList) && config.bucketList.length > 0) {
            // Seeding domyślnych marzeń do Supabase
            const seedItems = config.bucketList.map(item => ({
              title: item.title,
              completed: item.completed || false,
              author: 'Maks ❤️'
            }));
            const { data: seeded, error: seedErr } = await supabaseClient
              .from('list_items')
              .insert(seedItems)
              .select();

            if (!seedErr && Array.isArray(seeded) && seeded.length > 0) {
              return seeded.map(item => ({
                id: item.id,
                title: item.title,
                completed: Boolean(item.completed),
                author: item.author || ''
              }));
            }
          }
        }
      } catch (e) {
        console.warn('Supabase fetch list error:', e);
      }
    }
    try {
      const stored = localStorage.getItem(BUCKET_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return config.bucketList || [];
  }

  function saveBucketListLocal(list) {
    try {
      localStorage.setItem(BUCKET_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  async function renderBucketList() {
    if (!bucketListGrid) return;
    const items = await getBucketList();
    bucketListGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `bucket-item ${item.completed ? 'completed' : ''}`;
      
      const authorClass = (item.author || '').toLowerCase().includes('oliwia') ? 'author-oliwia' : 'author-maks';
      const authorBadge = item.author 
        ? `<span class="bucket-author-tag ${authorClass}">👤 ${escapeHTML(item.author)}</span>` 
        : '';

      card.innerHTML = `
        <div class="bucket-checkbox">${item.completed ? '✓' : ''}</div>
        <div class="bucket-item-content">
          <div class="bucket-title">${escapeHTML(item.title)}</div>
          ${authorBadge}
        </div>
        <span class="bucket-status-badge">${item.completed ? 'Spełnione 🎉' : 'Do zrealizowania ⏳'}</span>
        <button class="bucket-delete-btn" title="Usuń wpis" data-id="${item.id}" data-index="${index}">✕</button>
      `;

      card.addEventListener('click', async (e) => {
        if (e.target.classList.contains('bucket-delete-btn')) {
          e.stopPropagation();
          await deleteBucketItem(item.id, index);
          return;
        }

        const newCompleted = !item.completed;
        item.completed = newCompleted;

        if (supabaseClient) {
          try {
            await supabaseClient
              .from('list_items')
              .update({ completed: newCompleted })
              .eq('id', item.id);
          } catch (e) {
            console.warn('Supabase update list item error:', e);
          }
        }

        items[index].completed = newCompleted;
        saveBucketListLocal(items);
        await renderBucketList();

        if (newCompleted) {
          playSuccessSound();
          fireHeartConfetti();
        }
      });

      bucketListGrid.appendChild(card);
    });
  }

  async function deleteBucketItem(id, index) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('list_items')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase delete list item error:', e);
      }
    }
    const items = await getBucketList();
    const updated = items.filter(i => String(i.id) !== String(id));
    saveBucketListLocal(updated);
    await renderBucketList();
  }

  if (addBucketForm && bucketInput) {
    addBucketForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = bucketInput.value.trim();
      if (!text) return;

      const bucketAuthorSelect = document.getElementById('bucket-author');
      const authorVal = bucketAuthorSelect ? bucketAuthorSelect.value : 'Maks ❤️';

      const newItem = {
        title: text,
        completed: false,
        author: authorVal
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('list_items')
            .insert([newItem])
            .select();

          if (!error && data && data[0]) {
            console.log('Punkt pomyślnie dodany do Supabase!');
          }
        } catch (e) {
          console.warn('Supabase add list item error:', e);
        }
      }

      const items = await getBucketList();
      items.push({ id: Date.now(), ...newItem });
      saveBucketListLocal(items);
      bucketInput.value = '';
      await renderBucketList();
      playMagicSound();
      fireHeartConfetti();
    });
  }

  // NASŁUCHIWACZ ZMIAN W CZASIE RZECZYWISTYM (REALTIME SYNCHRONIZATION)
  if (supabaseClient) {
    try {
      supabaseClient
        .channel('public-db-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, () => {
          renderGallery();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'list_items' }, () => {
          renderBucketList();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hearts' }, (payload) => {
          if (payload.new && typeof payload.new.count === 'number') {
            totalHearts = payload.new.count;
            updateHeartsUI();
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('Supabase realtime channel error:', e);
    }
  }

  renderBucketList();
});
