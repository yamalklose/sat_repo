/* ==========================================================================
   Avto Privoz — main.js
   Handles: mobile nav toggle, closing menu on link click,
            contact form front-end validation + success message.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile navigation toggle ---------- */

  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', toggleNav);

    // Close the menu whenever a nav link is tapped (mobile UX)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Back to top button ---------- */

  var backToTop = document.querySelector('.back-to-top');

  function updateBackToTop() {
    if (!backToTop) return;
    var shouldShow = window.pageYOffset > 400;
    backToTop.classList.toggle('show', shouldShow);
    backToTop.hidden = !shouldShow;
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', updateBackToTop);
    updateBackToTop();
  }

  /* ---------- Catalog filtering ---------- */

  var filterBrand = document.getElementById('filter-brand');
  var filterModel = document.getElementById('filter-model');
  var filterYear = document.getElementById('filter-year');
  var filterPriceMin = document.getElementById('filter-price-min');
  var filterPriceMax = document.getElementById('filter-price-max');
  var filterMileageMax = document.getElementById('filter-mileage-max');
  var clearFilters = document.getElementById('clear-filters');
  var carCards = Array.prototype.slice.call(document.querySelectorAll('.catalog .car-card'));

  function parseNumber(value) {
    var number = parseInt(value, 10);
    return Number.isNaN(number) ? 0 : number;
  }

  function populateCatalogFilters() {
    if (!filterBrand || !filterYear || !carCards.length) return;

    var brands = [];
    var years = [];

    carCards.forEach(function (card) {
      var brand = card.dataset.brand || '';
      var year = card.dataset.year || '';

      if (brand && brands.indexOf(brand) === -1) brands.push(brand);
      if (year && years.indexOf(year) === -1) years.push(year);
    });

    brands.sort();
    years.sort(function (a, b) { return parseInt(b, 10) - parseInt(a, 10); });

    brands.forEach(function (brand) {
      var option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      filterBrand.appendChild(option);
    });

    years.forEach(function (year) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      filterYear.appendChild(option);
    });
  }

  function filterCatalog() {
    if (!carCards.length) return;

    var brandValue = filterBrand ? filterBrand.value : '';
    var modelValue = filterModel ? filterModel.value.trim().toLowerCase() : '';
    var yearValue = filterYear ? filterYear.value : '';
    var priceMinValue = parseNumber(filterPriceMin ? filterPriceMin.value : '');
    var priceMaxValue = parseNumber(filterPriceMax ? filterPriceMax.value : '');
    var mileageMaxValue = parseNumber(filterMileageMax ? filterMileageMax.value : '');

    carCards.forEach(function (card) {
      var cardBrand = (card.dataset.brand || '').toLowerCase();
      var cardModel = (card.dataset.model || '').toLowerCase();
      var cardYear = card.dataset.year || '';
      var cardPrice = parseNumber(card.dataset.price);
      var cardMileage = parseNumber(card.dataset.mileage);

      var isVisible = true;

      if (brandValue && cardBrand !== brandValue.toLowerCase()) {
        isVisible = false;
      }

      if (yearValue && cardYear !== yearValue) {
        isVisible = false;
      }

      if (modelValue && cardModel.indexOf(modelValue) === -1) {
        isVisible = false;
      }

      if (priceMinValue && cardPrice < priceMinValue) {
        isVisible = false;
      }

      if (priceMaxValue && cardPrice > priceMaxValue) {
        isVisible = false;
      }

      if (mileageMaxValue && cardMileage > mileageMaxValue) {
        isVisible = false;
      }

      card.style.display = isVisible ? '' : 'none';
    });
  }

  function resetCatalogFilters() {
    if (!filterBrand || !filterModel || !filterYear || !filterPriceMin || !filterPriceMax || !filterMileageMax) return;
    filterBrand.value = '';
    filterModel.value = '';
    filterYear.value = '';
    filterPriceMin.value = '';
    filterPriceMax.value = '';
    filterMileageMax.value = '';
    filterCatalog();
  }

  if (filterBrand && filterModel && filterYear) {
    populateCatalogFilters();
    filterBrand.addEventListener('change', filterCatalog);
    filterModel.addEventListener('input', filterCatalog);
    filterYear.addEventListener('change', filterCatalog);
    if (filterPriceMin) filterPriceMin.addEventListener('input', filterCatalog);
    if (filterPriceMax) filterPriceMax.addEventListener('input', filterCatalog);
    if (filterMileageMax) filterMileageMax.addEventListener('input', filterCatalog);
    if (clearFilters) clearFilters.addEventListener('click', resetCatalogFilters);
  }

  /* ---------- Contact form ---------- */

  var form = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // NOTE: This site has no backend wired up yet.
      // Replace this block with a real submission (fetch() to your API,
      // a form service such as Formspree/EmailJS, etc).
      successMsg.hidden = false;
      form.reset();

      window.setTimeout(function () {
        successMsg.hidden = true;
      }, 6000);
    });
  }
})();
