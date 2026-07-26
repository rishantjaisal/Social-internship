// LocalBiz Frontend Engine (Vanilla JS)

document.addEventListener('DOMContentLoaded', () => {
  const shopsGrid = document.getElementById('shopsGrid');
  const searchInput = document.getElementById('searchInput');
  const voiceSearchBtn = document.getElementById('voiceSearchBtn');
  const voiceModal = document.getElementById('voiceModal');
  const closeVoiceBtn = document.getElementById('closeVoiceBtn');
  const voiceTranscript = document.getElementById('voiceTranscript');
  const categoryFilters = document.querySelectorAll('.category-filter');

  let currentCategory = 'All';
  let currentSearch = '';

  // Fetch Shops from API
  async function loadShops() {
    if (!shopsGrid) return;
    try {
      shopsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
          <p style="margin-top: 12px; font-weight: 600;">Loading verified local stores...</p>
        </div>
      `;

      const query = new URLSearchParams();
      if (currentCategory !== 'All') query.append('category', currentCategory);
      if (currentSearch) query.append('search', currentSearch);

      const response = await fetch(`/api/shops?${query.toString()}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        renderShops(data.data);
      } else {
        shopsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border);">
            <i class="fa-solid fa-store-slash fa-3x" style="color: #cbd5e1;"></i>
            <h3 style="font-weight: 800; margin-top: 16px;">No Stores Found</h3>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Try adjusting your category filter or search keywords.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
    }
  }

  // Render Shop Cards in DOM
  function renderShops(shops) {
    shopsGrid.innerHTML = shops
      .map(
        (shop) => `
      <div class="shop-card">
        <div>
          <div class="shop-banner" style="background-image: url('${shop.banner}');">
            <div class="shop-banner-overlay"></div>
            <div class="shop-badge-group">
              <span class="badge badge-primary">${shop.category}</span>
              ${shop.isVerified ? '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Verified</span>' : ''}
            </div>
            <div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800;">
              <i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${shop.rating} (${shop.reviews})
            </div>
            <img src="${shop.logo}" alt="${shop.name}" class="shop-logo">
          </div>

          <div class="shop-body">
            <h3 class="shop-title">${shop.name}</h3>
            <p class="shop-desc">${shop.description}</p>
            <div class="shop-meta">
              <div><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${shop.address}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span><i class="fa-solid fa-clock" style="color: #16a34a;"></i> 08:00 AM - 11:00 PM</span>
                <span class="badge badge-success">Open Now</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 0 20px 20px 20px;">
          <a href="shop.html?slug=${shop.slug}" class="btn btn-primary" style="width: 100%;">
            Visit Digital Storefront <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `
      )
      .join('');
  }

  // Search Input Event Handler
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        loadShops();
      }, 300);
    });
  }

  // Category Filters Event Handler
  categoryFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      categoryFilters.forEach((f) => f.classList.remove('active'));
      filter.classList.add('active');
      currentCategory = filter.dataset.category;
      loadShops();
    });
  });

  // Web Speech Voice Search Logic
  if (voiceSearchBtn && voiceModal) {
    voiceSearchBtn.addEventListener('click', () => {
      voiceModal.classList.add('active');
      startVoiceRecognition();
    });

    if (closeVoiceBtn) {
      closeVoiceBtn.addEventListener('click', () => {
        voiceModal.classList.remove('active');
      });
    }
  }

  function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      voiceTranscript.textContent = 'Voice search not supported in this browser.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (e) => {
      const result = e.results[0][0].transcript;
      voiceTranscript.textContent = `"${result}"`;
      if (searchInput) {
        searchInput.value = result;
        currentSearch = result;
        loadShops();
      }
      setTimeout(() => {
        voiceModal.classList.remove('active');
      }, 1000);
    };

    recognition.onerror = () => {
      voiceTranscript.textContent = 'Could not catch voice. Please try again.';
    };
  }

  // Initial Load
  loadShops();
});
