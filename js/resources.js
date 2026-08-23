/**
 * MindCare Resources
 * Handles category filtering, search, and save/unsave resource cards.
 */

/* ── Expose for router ────────────────────────────────────────────────────── */
window.initResourceSaveButtons = function () {
  document.querySelectorAll('.resource-save-btn').forEach(btn => {
    const card = btn.closest('.resource-card');
    const id   = card ? card.getAttribute('data-id') : null;
    if (!id) return;

    // Remove old listeners by cloning
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    const isSaved = MindCareStorage.isResourceSaved(id);
    newBtn.innerHTML  = isSaved ? '❤️' : '🤍';
    newBtn.title      = isSaved ? 'Saqlanganlardan o‘chirish' : 'Resursni saqlash';

    newBtn.addEventListener('click', e => {
      e.stopPropagation();
      const nowSaved = MindCareStorage.toggleSavedResource(id);
      newBtn.innerHTML = nowSaved ? '❤️' : '🤍';
      newBtn.title     = nowSaved ? 'Saqlanganlardan o‘chirish' : 'Resursni saqlash';
      showToast(nowSaved ? 'Resurs saqlandi!' : 'Saqlanganlardan olib tashlandi.', nowSaved ? 'success' : 'info');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput   = document.getElementById('resource-search');
  const clearBtn      = document.getElementById('resource-search-clear');
  const categoryBtns  = document.querySelectorAll('.category-btn');
  const resourceCards = document.querySelectorAll('.resource-card');

  if (!searchInput && categoryBtns.length === 0) return;

  let activeCategory = 'all';
  let searchQuery    = '';

  // Brauzer avtomatik email to'ldirib qo'ygan bo'lsa tozalash
  if (searchInput && searchInput.value.includes('@')) {
    searchInput.value = '';
  }

  /* ── Filter logic ───────────────────────────────────────────────────────── */
  function filterCards() {
    let visible = 0;

    if (clearBtn && searchInput) {
      clearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
    }

    resourceCards.forEach(card => {
      const cat   = card.getAttribute('data-category') || '';
      const title = card.querySelector('.resource-title')?.textContent.toLowerCase() || '';
      const desc  = card.querySelector('.resource-desc')?.textContent.toLowerCase()  || '';

      const matchCat    = activeCategory === 'all' || cat === activeCategory;
      const matchSearch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery) || cat.includes(searchQuery);

      if (matchCat && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Empty state
    let emptyEl = document.getElementById('resources-empty');
    if (visible === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('p');
        emptyEl.id           = 'resources-empty';
        emptyEl.textContent  = 'Hech qanday resurs topilmadi. Boshqa qidiruv so‘zi yoki toifani tanlab ko‘ring.';
        emptyEl.style.cssText = 'grid-column:1/-1; text-align:center; color:var(--text-tertiary); padding:2rem; font-size:0.9rem;';
        document.getElementById('resources-grid')?.appendChild(emptyEl);
      } else {
        emptyEl.style.display = '';
      }
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  /* ── Category buttons ───────────────────────────────────────────────────── */
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterCards();
    });
  });

  /* ── Search ─────────────────────────────────────────────────────────────── */
  let debounce;
  searchInput?.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterCards();
    }, 200);
  });

  /* ── Clear button ────────────────────────────────────────────────────────── */
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      filterCards();
      searchInput.focus();
    });
  }

  // Initial check
  filterCards();

  window.refreshResources = function () {
    if (searchInput && searchInput.value.includes('@')) {
      searchInput.value = '';
      searchQuery = '';
    }
    filterCards();
    window.initResourceSaveButtons();
  };

  /* ── Init save buttons ──────────────────────────────────────────────────── */
  window.initResourceSaveButtons();
});
