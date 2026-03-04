    // ======================================
    // Slide Navigation
    // ======================================
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
      slides[currentSlide].classList.add('active');

      // Update counter
      document.getElementById('slideCounter').textContent =
        `${currentSlide + 1} / ${totalSlides}`;

      // Update progress bar
      document.getElementById('progressBar').style.width =
        `${((currentSlide + 1) / totalSlides) * 100}%`;

      // Initialize charts on this slide if needed
      initSlideCharts(currentSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          showSlide(currentSlide + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          showSlide(currentSlide - 1);
          break;
        case 'Home':
          e.preventDefault();
          showSlide(0);
          break;
        case 'End':
          e.preventDefault();
          showSlide(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    });

    // Click navigation
    document.addEventListener('click', (e) => {
      // Ignore clicks on interactive elements
      if (e.target.closest('canvas, .chart-container, button, a, input')) return;

      if (e.clientX > window.innerWidth / 2) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }
    });

    // Touch navigation
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    document.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
      }
    });

    // Fullscreen toggle
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    // ======================================
    // Slide Scaling
    // ======================================
    function scaleSlides() {
      const sw = window.innerWidth / 1280;
      const sh = window.innerHeight / 720;
      const scale = Math.min(sw, sh);

      slides.forEach(s => {
        s.style.transform = `scale(${scale})`;
        s.style.left = `${(window.innerWidth - 1280 * scale) / 2}px`;
        s.style.top = `${(window.innerHeight - 720 * scale) / 2}px`;
      });
    }

    window.addEventListener('resize', scaleSlides);

    // ======================================
    // Chart.js Initialization
    // ======================================
    const chartInstances = {};

    Chart.defaults.font.family = "'Noto Sans JP', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.color = '#64748B';

    const chartColors = [
      '#2563EB', '#F59E0B', '#10B981', '#EF4444',
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];

    function initSlideCharts(slideIndex) {
      const slide = slides[slideIndex];
      if (!slide) return;

      const canvases = slide.querySelectorAll('canvas[data-chart]');
      canvases.forEach(canvas => {
        const chartId = canvas.id;
        if (chartInstances[chartId]) return; // Already initialized

        const chartType = canvas.dataset.chart;
        const labels = JSON.parse(canvas.dataset.labels || '[]');
        const values = JSON.parse(canvas.dataset.values || '[]');
        const datasetLabel = canvas.dataset.datasetLabel || '';

        const ctx = canvas.getContext('2d');

        let config = {};

        switch(chartType) {
          case 'bar':
            config = {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: datasetLabel,
                  data: values,
                  backgroundColor: chartColors.slice(0, values.length),
                  borderRadius: 6,
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: !!datasetLabel } },
                scales: { y: { beginAtZero: true } }
              }
            };
            break;

          case 'pie':
          case 'doughnut':
            config = {
              type: chartType,
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: chartColors.slice(0, values.length),
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
              }
            };
            break;

          case 'line':
            config = {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: datasetLabel,
                  data: values,
                  borderColor: '#2563EB',
                  backgroundColor: 'rgba(37,99,235,0.1)',
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                  pointBackgroundColor: '#2563EB',
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
              }
            };
            break;

          case 'radar':
            config = {
              type: 'radar',
              data: {
                labels: labels,
                datasets: [{
                  label: datasetLabel,
                  data: values,
                  borderColor: '#2563EB',
                  backgroundColor: 'rgba(37,99,235,0.2)',
                  pointBackgroundColor: '#2563EB',
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { r: { beginAtZero: true } }
              }
            };
            break;

          case 'waterfall':
            config = {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  data: values, // Array of [start, end] pairs
                  backgroundColor: function(ctx) {
                    const idx = ctx.dataIndex;
                    const total = ctx.dataset.data.length - 1;
                    if (idx === 0 || idx === total) return '#2563EB';
                    const d = ctx.dataset.data[idx];
                    return d[1] >= d[0] ? '#10B981' : '#EF4444';
                  },
                  borderRadius: 4,
                  borderSkipped: false,
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(ctx) {
                        const d = ctx.raw;
                        const diff = d[1] - d[0];
                        return diff >= 0 ? `+${diff}` : `${diff}`;
                      }
                    }
                  }
                },
                scales: { y: { beginAtZero: true } }
              }
            };
            break;
        }

        if (config.type) {
          chartInstances[chartId] = new Chart(ctx, config);
        }
      });
    }

    // ======================================
    // Mermaid.js Initialization
    // ======================================
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#DBEAFE',
        primaryBorderColor: '#2563EB',
        primaryTextColor: '#1E293B',
        lineColor: '#93C5FD',
        secondaryColor: '#FEF3C7',
        tertiaryColor: '#EFF6FF',
        fontFamily: "'Noto Sans JP', sans-serif",
      }
    });

    // ======================================
    // Keyboard Hint Auto-hide
    // ======================================
    setTimeout(() => {
      const hint = document.getElementById('keyboardHint');
      if (hint) hint.style.opacity = '0';
      setTimeout(() => { if (hint) hint.style.display = 'none'; }, 500);
    }, 3000);

    // ======================================
    // Initialize
    // ======================================
    scaleSlides();
    if (totalSlides > 0) showSlide(0);
