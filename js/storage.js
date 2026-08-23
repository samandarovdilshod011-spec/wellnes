/**
 * MindCare Storage
 * Single source of truth for all localStorage operations.
 */
const MindCareStorage = {
  KEYS: {
    CHECKINS:        'mindcare_checkins',
    PLANNER:         'mindcare_planner',
    SAVED_RESOURCES: 'mindcare_saved',
    CHAT_HISTORY:    'mindcare_chat',
    REFLECTIONS:     'mindcare_reflections',
    STREAK:          'mindcare_streak',
    USER:            'mindcare_user',
    SESSION:         'mindcare_session',
    ONBOARDING:      'mindcare_onboarding'
  },

  // ── Core ──────────────────────────────────────────────────────────────────

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('[MindCare] Storage read error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[MindCare] Storage write error:', e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[MindCare] Storage remove error:', e);
    }
  },

  // ── Auth & Session ─────────────────────────────────────────────────────────

  getUser()  { return this.get(this.KEYS.USER) || null; },
  setUser(u) { this.set(this.KEYS.USER, u); },

  getSession()  { return this.get(this.KEYS.SESSION) || null; },
  setSession(s) { this.set(this.KEYS.SESSION, s); },

  clearSession() { this.remove(this.KEYS.SESSION); },

  // ── Onboarding ─────────────────────────────────────────────────────────────

  isOnboardingCompleted() {
    const ob = this.get(this.KEYS.ONBOARDING);
    return !!(ob && ob.completed);
  },

  setOnboardingCompleted(focus = '') {
    this.set(this.KEYS.ONBOARDING, {
      completed:  true,
      focus:      focus,
      timestamp:  Date.now()
    });
  },

  getOnboardingData() {
    return this.get(this.KEYS.ONBOARDING) || {};
  },

  // ── Check-ins ──────────────────────────────────────────────────────────────

  saveCheckin(mood, factors) {
    const checkins = this.get(this.KEYS.CHECKINS) || [];
    const today    = this._today();

    // Replace today's existing entry if present
    const filtered = checkins.filter(c => c.date !== today);
    filtered.push({ date: today, mood, factors, timestamp: Date.now() });

    this.set(this.KEYS.CHECKINS, filtered);
    this._updateStreak(today);
  },

  getCheckins()    { return this.get(this.KEYS.CHECKINS) || []; },

  getTodayCheckin() {
    const today = this._today();
    return this.getCheckins().find(c => c.date === today) || null;
  },

  getWeeklyMoods() {
    const checkins = this.getCheckins();
    const result   = [];
    for (let i = 6; i >= 0; i--) {
      const d    = new Date();
      d.setDate(d.getDate() - i);
      const key  = d.toISOString().split('T')[0];
      const hit  = checkins.find(c => c.date === key);
      result.push(hit ? hit.mood : null);
    }
    return result;
  },

  // ── Streak ─────────────────────────────────────────────────────────────────

  getStreak() {
    const s = this.get(this.KEYS.STREAK);
    return s ? s.count : 0;
  },

  _updateStreak(dateStr) {
    const streak = this.get(this.KEYS.STREAK) || { count: 0, lastDate: null };
    if (streak.lastDate === dateStr) return;

    if (streak.lastDate) {
      const diff = Math.round(
        (new Date(dateStr) - new Date(streak.lastDate)) / 86400000
      );
      streak.count = diff === 1 ? streak.count + 1 : 1;
    } else {
      streak.count = 1;
    }

    streak.lastDate = dateStr;
    this.set(this.KEYS.STREAK, streak);
  },

  // ── Planner ────────────────────────────────────────────────────────────────

  savePlannerTask(task) {
    const tasks = this.get(this.KEYS.PLANNER) || [];
    if (!task.id)   task.id   = 'task_' + Date.now();
    if (!task.date) task.date = this._today();
    tasks.push(task);
    this.set(this.KEYS.PLANNER, tasks);
    return task;
  },

  getPlannerTasks(date) {
    const tasks  = this.get(this.KEYS.PLANNER) || [];
    const target = date || this._today();
    return tasks.filter(t => t.date === target);
  },

  deletePlannerTask(id) {
    const tasks = (this.get(this.KEYS.PLANNER) || []).filter(t => t.id !== id);
    this.set(this.KEYS.PLANNER, tasks);
  },

  // ── Resources ──────────────────────────────────────────────────────────────

  toggleSavedResource(id) {
    let saved = this.get(this.KEYS.SAVED_RESOURCES) || [];
    if (saved.includes(id)) {
      saved = saved.filter(r => r !== id);
    } else {
      saved.push(id);
    }
    this.set(this.KEYS.SAVED_RESOURCES, saved);
    return saved.includes(id);
  },

  isResourceSaved(id) {
    return (this.get(this.KEYS.SAVED_RESOURCES) || []).includes(id);
  },

  getSavedResources() {
    return this.get(this.KEYS.SAVED_RESOURCES) || [];
  },

  // ── Chat ───────────────────────────────────────────────────────────────────

  saveChatMessage(role, text) {
    const history = this.get(this.KEYS.CHAT_HISTORY) || [];
    history.push({ role, text, timestamp: Date.now() });
    this.set(this.KEYS.CHAT_HISTORY, history);
  },

  getChatHistory() {
    return this.get(this.KEYS.CHAT_HISTORY) || [];
  },

  // ── Reflections ────────────────────────────────────────────────────────────

  saveReflection(text) {
    const reflections = this.get(this.KEYS.REFLECTIONS) || [];
    reflections.push({ text, timestamp: Date.now() });
    this.set(this.KEYS.REFLECTIONS, reflections);
  },

  getReflections() {
    return this.get(this.KEYS.REFLECTIONS) || [];
  },

  // ── Insights ───────────────────────────────────────────────────────────────

  getWeeklyInsights() {
    const checkins = this.getCheckins();
    const tasks    = this.get(this.KEYS.PLANNER) || [];
    const cutoff   = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    cutoff.setHours(0, 0, 0, 0);

    const recentCheckins = checkins.filter(c => new Date(c.date) >= cutoff);
    const recentTasks    = tasks.filter(t => new Date(t.date) >= cutoff);

    const studySessions  = recentTasks.filter(t => !t.isBreak).length;
    const breaks         = recentTasks.filter(t =>  t.isBreak).length;

    // Busiest day
    const counts = {};
    recentTasks.forEach(t => { counts[t.date] = (counts[t.date] || 0) + 1; });

    let busiestDate = null, maxCount = -1;
    for (const [date, count] of Object.entries(counts)) {
      if (count > maxCount) { maxCount = count; busiestDate = date; }
    }

    let busiestDay = 'None yet';
    if (busiestDate) {
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      busiestDay = days[new Date(busiestDate).getDay()];
    }

    return {
      totalCheckins: recentCheckins.length,
      studySessions,
      breaks,
      busiestDay
    };
  },

  // ── Demo data (only if storage is completely empty) ────────────────────────

  _initDemoData() {
    // Only seed planner — do NOT seed checkins so mood shows "Not yet" for new users
    if (!this.get(this.KEYS.PLANNER)) {
      const today = this._today();
      const demo  = [
        { id: 't1', name: 'Maths homework',   time: '17:00', duration: '45', priority: 'high',   isBreak: false, date: today },
        { id: 't2', name: 'Break',             time: '17:45', duration: '15', priority: 'low',    isBreak: true,  date: today },
        { id: 't3', name: 'English essay',     time: '18:00', duration: '45', priority: 'medium', isBreak: false, date: today },
        { id: 't4', name: 'Break',             time: '18:45', duration: '15', priority: 'low',    isBreak: true,  date: today },
        { id: 't5', name: 'Biology revision',  time: '19:00', duration: '60', priority: 'high',   isBreak: false, date: today },
      ];
      this.set(this.KEYS.PLANNER, demo);
    }
  },

  // ── Helpers ────────────────────────────────────────────────────────────────

  _today() {
    return new Date().toISOString().split('T')[0];
  }
};

// Seed demo planner data on first load
MindCareStorage._initDemoData();
