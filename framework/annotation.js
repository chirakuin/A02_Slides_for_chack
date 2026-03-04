// ======================================
// Slide Annotation Layer
// ======================================
(function () {
  const STORAGE_KEY = 'slide-annotations';
  let enabled = false;
  let drawing = false;
  let penColor = '#EF4444';
  let penSize = 3;
  let erasing = false;
  let canvas, ctx;
  const annotations = {}; // slideIndex -> imageData

  // --- Toolbar ---
  const toolbar = document.createElement('div');
  toolbar.id = 'annotation-toolbar';
  toolbar.innerHTML = `
    <style>
      #annotation-toolbar {
        position: fixed; top: 12px; right: 12px; z-index: 10000;
        display: flex; align-items: center; gap: 6px;
        background: rgba(30,41,59,0.92); padding: 6px 10px;
        border-radius: 8px; font-family: 'Inter','Noto Sans JP',sans-serif;
        font-size: 13px; color: #fff; user-select: none;
        backdrop-filter: blur(4px);
      }
      #annotation-toolbar button {
        background: rgba(255,255,255,0.12); border: none; color: #fff;
        padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 13px;
      }
      #annotation-toolbar button:hover { background: rgba(255,255,255,0.22); }
      #annotation-toolbar button.active { background: #2563EB; }
      #annotation-toolbar input[type=color] {
        width: 28px; height: 28px; border: none; padding: 0;
        border-radius: 4px; cursor: pointer; background: none;
      }
      #annotation-toolbar input[type=range] { width: 60px; accent-color: #2563EB; }
      #annotation-toolbar .sep { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
      #annotation-canvas {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 9999; cursor: crosshair;
      }
      #annotation-canvas.hidden { display: none; }
      @media print {
        #annotation-toolbar, #annotation-canvas { display: none !important; }
      }
    </style>
    <button id="ann-toggle" title="書き込みモード切替">✏️ 書き込み</button>
    <div class="sep"></div>
    <input type="color" id="ann-color" value="#EF4444" title="色">
    <input type="range" id="ann-size" min="1" max="12" value="3" title="太さ">
    <button id="ann-eraser" title="消しゴム">🧹</button>
    <button id="ann-clear" title="このスライドをクリア">🗑</button>
  `;
  document.body.appendChild(toolbar);

  // --- Canvas ---
  canvas = document.createElement('canvas');
  canvas.id = 'annotation-canvas';
  canvas.classList.add('hidden');
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const data = enabled ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (data) ctx.putImageData(data, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Current slide index ---
  function currentIndex() {
    const slides = document.querySelectorAll('.slide');
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) return i;
    }
    return 0;
  }

  // --- Save / Restore per slide ---
  function saveCurrentSlide() {
    annotations[currentIndex()] = canvas.toDataURL();
  }

  function restoreSlide() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = annotations[currentIndex()];
    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = data;
    }
  }

  // Watch slide changes via MutationObserver
  const presentation = document.getElementById('presentation');
  if (presentation) {
    const observer = new MutationObserver(() => {
      if (enabled) restoreSlide();
    });
    presentation.querySelectorAll('.slide').forEach(slide => {
      observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // Also listen for keydown to catch slide navigation
  let lastIndex = 0;
  document.addEventListener('keydown', () => {
    setTimeout(() => {
      const idx = currentIndex();
      if (idx !== lastIndex && enabled) {
        saveForIndex(lastIndex);
        lastIndex = idx;
        restoreSlide();
      }
    }, 50);
  });

  function saveForIndex(idx) {
    annotations[idx] = canvas.toDataURL();
  }

  // --- Toggle ---
  const btnToggle = document.getElementById('ann-toggle');
  btnToggle.addEventListener('click', () => {
    enabled = !enabled;
    btnToggle.classList.toggle('active', enabled);
    btnToggle.textContent = enabled ? '✏️ ON' : '✏️ 書き込み';
    canvas.classList.toggle('hidden', !enabled);
    if (enabled) {
      lastIndex = currentIndex();
      restoreSlide();
    } else {
      saveCurrentSlide();
    }
  });

  // --- Color & Size ---
  document.getElementById('ann-color').addEventListener('input', (e) => {
    penColor = e.target.value;
    erasing = false;
    document.getElementById('ann-eraser').classList.remove('active');
  });
  document.getElementById('ann-size').addEventListener('input', (e) => {
    penSize = parseInt(e.target.value);
  });

  // --- Eraser ---
  const btnEraser = document.getElementById('ann-eraser');
  btnEraser.addEventListener('click', () => {
    erasing = !erasing;
    btnEraser.classList.toggle('active', erasing);
    canvas.style.cursor = erasing ? 'cell' : 'crosshair';
  });

  // --- Clear ---
  document.getElementById('ann-clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    delete annotations[currentIndex()];
  });

  // --- Drawing ---
  function getPos(e) {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchmove', draw, { passive: false });

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (erasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penSize * 6;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = penSize;
    }
    ctx.strokeStyle = penColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchend', endDraw);

  function endDraw() {
    if (drawing) {
      drawing = false;
      ctx.closePath();
      saveCurrentSlide();
    }
  }

  // --- Prevent slide navigation while drawing ---
  canvas.addEventListener('click', (e) => { e.stopPropagation(); });
})();
