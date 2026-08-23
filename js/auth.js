/**
 * MindCare Auth
 * Handles registration, session persistence, onboarding, and routing.
 *
 * Flow:
 *   NEW USER     → Registration screen → Onboarding → Dashboard
 *   RETURNING    → Detect session      → Dashboard
 *   LOGOUT       → Clear session       → Registration screen
 */

const MindCareAuth = (() => {
  // ─── Internal helpers ──────────────────────────────────────────────────────

  function getUser()    { return MindCareStorage.getUser(); }
  function getSession() { return MindCareStorage.getSession(); }

  function isLoggedIn() {
    const session = getSession();
    const user    = getUser();
    return !!(session && session.active && user);
  }

  function hasCompletedOnboarding() {
    return MindCareStorage.isOnboardingCompleted();
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  function register(name, email, password) {
    if (!name || !email || !password) {
      return { ok: false, error: 'Iltimos, barcha maydonlarni to‘ldiring.' };
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return { ok: false, error: 'Iltimos, to‘g‘ri email manzilini kiriting.' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.' };
    }

    const user = {
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      createdAt: Date.now()
    };

    MindCareStorage.setUser(user);
    MindCareStorage.setSession({ active: true, loginAt: Date.now() });
    MindCareStorage.remove(MindCareStorage.KEYS.ONBOARDING);

    return { ok: true, user };
  }

  function logout() {
    MindCareStorage.clearSession();
  }

  // ─── Router ────────────────────────────────────────────────────────────────

  /**
   * Decide which screen to show on page load.
   * Returns: 'auth' | 'onboarding' | 'app'
   */
  function getInitialRoute() {
    if (!isLoggedIn())              return 'auth';
    if (!hasCompletedOnboarding())  return 'onboarding';
    return 'app';
  }

  return { register, logout, isLoggedIn, hasCompletedOnboarding, getInitialRoute };
})();

/* ─── Boot: attach registration form handler ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('register-form');
  const regBtn      = document.getElementById('register-btn');
  const nameInput   = document.getElementById('reg-name');
  const emailInput  = document.getElementById('reg-email');
  const passInput   = document.getElementById('reg-password');

  // Password visibility toggles
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input    = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i data-lucide="eye-off" width="18" height="18"></i>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<i data-lucide="eye" width="18" height="18"></i>';
      }
      // Re-render Lucide icon
      if (window.lucide) lucide.createIcons();
    });
  });

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name     = nameInput  ? nameInput.value.trim()  : '';
    const email    = emailInput ? emailInput.value.trim() : '';
    const password = passInput  ? passInput.value         : '';

    // Loading state
    if (regBtn) {
      regBtn.disabled    = true;
      regBtn.textContent = 'Akkaunt yaratilmoqda…';
    }

    // Slight delay for perceived smoothness
    setTimeout(() => {
      const result = MindCareAuth.register(name, email, password);

      if (!result.ok) {
        showToast(result.error, 'error');
        if (regBtn) {
          regBtn.disabled     = false;
          regBtn.innerHTML    = 'Akkaunt yaratish va boshlash <i data-lucide="arrow-right" width="18" height="18"></i>';
          if (window.lucide) lucide.createIcons();
        }
        return;
      }

      // Success — show onboarding
      MindCareApp.showScreen('onboarding');
      MindCareApp.initOnboarding(result.user.name);

    }, 500);
  });
});
