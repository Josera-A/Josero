// ============================================
// PRODUCT DETAIL PAGE HANDLER
// ============================================

(function() {
  'use strict';

  /**
   * Load product detail from URL parameter
   */
  function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId || !productsData[productId]) {
      document.querySelector('.product-detail-content').innerHTML = '<p style="color: #666; padding: 40px;">Ապրանքը չի գտնվել։</p>';
      return;
    }

    const product = productsData[productId];

    // Populate text content
    document.getElementById('productName').textContent = product.name || '—';
    document.getElementById('productType').textContent = product.type || '';
    document.getElementById('productMini').textContent = product.mini || '';
    document.getElementById('productDesc').textContent = product.description || '';

    // Populate packaging
    const packagingEl = document.getElementById('productPackaging');
    packagingEl.innerHTML = '';
    if (product.packaging) {
      const packDiv = document.createElement('div');
      packDiv.className = 'packaging-value';
      packDiv.textContent = product.packaging;
      packagingEl.appendChild(packDiv);
    }

    // Populate image
    const imgEl = document.getElementById('productImage');
    if (product.image) {
      imgEl.src = product.image;
      imgEl.alt = product.name || 'Product';
    }
  }

  /**
   * Setup back button
   */
  function setupBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'index.html';
        }
      });
    }
  }

  /**
   * Initialize page on DOM ready
   */
  function init() {
    loadProductDetail();
    setupBackButton();
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
