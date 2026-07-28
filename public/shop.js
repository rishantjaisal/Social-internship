// Storefront Engine (Vanilla JS)

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'kusum-medical';

  const shopHeaderBanner = document.getElementById('shopHeaderBanner');
  const shopLogoImg = document.getElementById('shopLogoImg');
  const shopNameTitle = document.getElementById('shopNameTitle');
  const shopDescText = document.getElementById('shopDescText');
  const shopRatingSpan = document.getElementById('shopRatingSpan');
  const shopAddressSpan = document.getElementById('shopAddressSpan');
  const productsGrid = document.getElementById('productsGrid');
  const openRxModalBtn = document.getElementById('openRxModalBtn');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
  const rxModal = document.getElementById('rxModal');
  const closeRxBtn = document.getElementById('closeRxBtn');
  const rxForm = document.getElementById('rxForm');
  const rxFileInput = document.getElementById('rxFileInput');
  const cartCount = document.getElementById('cartCount');

  let currentShop = null;
  let cart = JSON.parse(localStorage.getItem('localbiz_cart') || '[]');
  updateCartCount();

  async function loadShopData() {
    try {
      const response = await fetch(`/api/shops/${slug}`);
      const data = await response.json();

      if (data.success) {
        currentShop = data.shop;
        renderShopHeader(data.shop);
        renderProducts(data.products);
      }
    } catch (err) {
      console.warn('Error loading shop data from API, using fallback:', err);
      const fallbackShop = {
        name: 'Kusum Medical Store',
        slug: 'kusum-medical',
        category: 'Medical',
        description: '24/7 Licensed Pharmacy providing authentic medicines, healthcare products, surgical supplies, and online prescription delivery.',
        logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=300',
        banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200',
        address: 'Shop 14, Main Market, Civil Lines, Delhi - 110054',
        rating: 4.9,
        reviews: 128,
        whatsappNumber: '919876543210'
      };
      const fallbackProducts = [
        {
          id: 'p1',
          name: 'Paracetamol 650mg Tablets (Strip of 15)',
          price: 32,
          offerPrice: 28,
          unit: 'strip',
          category: 'Medicines',
          isPrescriptionRequired: false,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
          description: 'Fast relief from fever, body pain, and mild headaches.'
        },
        {
          id: 'p2',
          name: 'Amoxicillin 500mg Antibiotic Capsules',
          price: 110,
          offerPrice: 95,
          unit: 'strip',
          category: 'Prescription Drugs',
          isPrescriptionRequired: true,
          image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
          description: 'Broad-spectrum penicillin antibiotic. Doctor prescription required.'
        }
      ];
      renderShopHeader(fallbackShop);
      renderProducts(fallbackProducts);
    }
  }

  function renderShopHeader(shop) {
    document.title = `${shop.name} | LocalBiz Digital Storefront`;
    if (shopHeaderBanner) shopHeaderBanner.style.backgroundImage = `url('${shop.banner}')`;
    if (shopLogoImg) shopLogoImg.src = shop.logo;
    if (shopNameTitle) shopNameTitle.textContent = shop.name;
    if (shopDescText) shopDescText.textContent = shop.description;
    if (shopRatingSpan) shopRatingSpan.innerHTML = `<i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${shop.rating} (${shop.reviews} Reviews)`;
    if (shopAddressSpan) shopAddressSpan.innerHTML = `<i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${shop.address}`;

    // Show Prescription upload button for Medical stores
    if (shop.category === 'Medical' && openRxModalBtn) {
      openRxModalBtn.style.display = 'inline-flex';
    }

    if (whatsappOrderBtn) {
      whatsappOrderBtn.addEventListener('click', () => {
        const text = encodeURIComponent(`Hello *${shop.name}*! I would like to place an order via LocalBiz.`);
        window.open(`https://wa.me/${shop.whatsappNumber}?text=${text}`, '_blank');
      });
    }
  }

  function renderProducts(products) {
    if (!productsGrid) return;
    productsGrid.innerHTML = products
      .map(
        (product) => `
      <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="height: 140px; background: var(--background); border-radius: var(--radius-md); overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
            <img src="${product.image}" alt="${product.name}" style="max-height: 120px; object-fit: contain;">
            ${product.isPrescriptionRequired ? '<span class="badge badge-warning" style="position: absolute; top: 8px; right: 8px; font-size: 0.65rem;"><i class="fa-solid fa-file-medical"></i> Rx Required</span>' : ''}
          </div>
          <span style="font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-top: 12px; display: block;">${product.category}</span>
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-top: 2px;">${product.name}</h4>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; line-height: 1.3;">${product.description}</p>
        </div>

        <div style="margin-top: 16px;">
          <div style="font-size: 1.125rem; font-weight: 900; margin-bottom: 12px;">
            ₹${product.offerPrice || product.price} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">/ ${product.unit}</span>
          </div>
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.offerPrice || product.price}" style="width: 100%; font-size: 0.8rem; padding: 8px 14px;">
            <i class="fa-solid fa-cart-plus"></i> Add to Order
          </button>
        </div>
      </div>
    `
      )
      .join('');

    document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        const existing = cart.find((i) => i.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, name, price, quantity: 1, shopSlug: slug });
        }

        localStorage.setItem('localbiz_cart', JSON.stringify(cart));
        updateCartCount();
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Order';
        }, 1500);
      });
    });
  }

  function updateCartCount() {
    if (cartCount) {
      const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
      cartCount.textContent = totalItems;
    }
  }

  // Prescription Modal Controls
  if (openRxModalBtn && rxModal) {
    openRxModalBtn.addEventListener('click', () => rxModal.classList.add('active'));
  }
  if (closeRxBtn && rxModal) {
    closeRxBtn.addEventListener('click', () => rxModal.classList.remove('active'));
  }

  if (rxForm) {
    rxForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = rxFileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('prescription', file);

      try {
        const response = await fetch('/api/prescriptions/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          alert('Prescription uploaded successfully! Pharmacist will verify shortly.');
          rxModal.classList.remove('active');
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    });
  }

  // Business QR Code Modal Controls
  const openQrModalBtn = document.getElementById('openQrModalBtn');
  const qrModal = document.getElementById('qrModal');
  const closeQrBtn = document.getElementById('closeQrBtn');
  const printQrBtn = document.getElementById('printQrBtn');
  const qrCodeImg = document.getElementById('qrCodeImg');

  if (openQrModalBtn && qrModal) {
    openQrModalBtn.addEventListener('click', () => {
      if (qrCodeImg) {
        const storeUrl = encodeURIComponent(window.location.href);
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${storeUrl}`;
      }
      qrModal.classList.add('active');
    });
  }

  if (closeQrBtn && qrModal) {
    closeQrBtn.addEventListener('click', () => qrModal.classList.remove('active'));
  }

  if (printQrBtn) {
    printQrBtn.addEventListener('click', () => {
      window.print();
    });
  }

  loadShopData();
});
