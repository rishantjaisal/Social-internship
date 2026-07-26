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
      console.warn('Backend API fetch failed, rendering fallback local store data:', err);
      // Inline Fallback Data for offline or file:// protocol viewing
      const FALLBACK_SHOPS = [
        {
          id: 'b1',
          name: 'Kusum Medical Store',
          slug: 'kusum-medical',
          category: 'Medical',
          description: '24/7 Licensed Pharmacy providing authentic medicines, healthcare products, surgical supplies, and online prescription delivery.',
          logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=300',
          banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200',
          address: 'Shop 14, Main Market, Civil Lines, Delhi - 110054',
          rating: 4.9,
          reviews: 128,
          isVerified: true
        },
        {
          id: 'b2',
          name: 'Sharma Organic Grocery',
          slug: 'sharma-grocery',
          category: 'Grocery',
          description: 'Fresh farm vegetables, organic pulses, pure dairy, spices, and daily household essentials delivered to your doorstep in 30 minutes.',
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
          banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200',
          address: 'Block C, Sector 18, Noida - 201301',
          rating: 4.8,
          reviews: 95,
          isVerified: true
        },
        {
          id: 'b3',
          name: 'RK Electronics & Mobile Repair',
          slug: 'rk-electronics',
          category: 'Electronics',
          description: 'Authorized smartphone repair, laptop accessories, smart TVs, soundbars, and home appliance repair services with genuine warranty.',
          logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=300',
          banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=1200',
          address: 'Shop 8, Electronic Complex, Laxmi Nagar, Delhi',
          rating: 4.7,
          reviews: 64,
          isVerified: true
        }
      ];

      let filtered = FALLBACK_SHOPS;
      if (currentCategory !== 'All') {
        filtered = filtered.filter(s => s.category.toLowerCase() === currentCategory.toLowerCase());
      }
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      renderShops(filtered);
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
