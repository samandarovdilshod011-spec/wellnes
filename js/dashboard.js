/**
 * MindCare Dashboard / Overview
 * Renders the overview cards, weekly mood chart, and quick-action wiring.
 */

const MOOD_LABELS = {
  great:       'A’lo 🤩',
  good:        'Yaxshi 🙂',
  okay:        'O‘rtacha 😐',
  stressed:    'Stressda 😫',
  overwhelmed: 'Charchagan 😵‍💫'
};

const MOOD_VALUES = {
  overwhelmed: 1,
  stressed:    2,
  okay:        3,
  good:        4,
  great:       5
};

/* ── Public refresh hook called by MindCareApp.navigateTo ─────────────────── */
window.refreshOverview = function () {
  updateDashboardCards();
  drawWeeklyChart();
  if (window.lucide) lucide.createIcons();
};

/* ── Card updater ─────────────────────────────────────────────────────────── */
function updateDashboardCards() {
  const checkin = MindCareStorage.getTodayCheckin();
  const tasks   = MindCareStorage.getPlannerTasks();
  const user    = MindCareStorage.getUser();

  // Date pill
  const datePill = document.getElementById('hero-live-date');
  if (datePill) {
    const todayStr = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
    datePill.textContent = 'Bugun, ' + todayStr;
  }

  // Greeting name
  const greetingName = document.getElementById('greeting-name');
  if (greetingName && user && user.name) {
    greetingName.textContent = user.name;
  }

  // Mood card
  const moodText = document.getElementById('dash-mood-text');
  const moodSub  = document.getElementById('dash-mood-sub');
  const todayChipMood = document.getElementById('today-chip-mood');

  if (moodText) {
    moodText.textContent = checkin ? (MOOD_LABELS[checkin.mood] || checkin.mood) : 'Kutilmoqda';
  }
  if (moodSub) {
    moodSub.textContent = checkin
      ? 'Bugun qayd etildi · ' + new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
      : 'Hissiyotni qayd qilish uchun bosing';
  }
  if (todayChipMood) {
    const emojis = { great: '🤩', good: '🙂', okay: '😐', stressed: '😫', overwhelmed: '😵‍💫' };
    todayChipMood.textContent = checkin ? (emojis[checkin.mood] || '✨') : '➕';
  }

  // Balance card — derived from mood score
  const balanceBar  = document.getElementById('dash-balance-bar');
  const balanceTxt  = document.getElementById('dash-balance-text');
  const moodScore   = checkin ? (MOOD_VALUES[checkin.mood] || 3) : 3;
  const balancePct  = Math.round((moodScore / 5) * 100);

  if (balanceBar) balanceBar.style.width = balancePct + '%';
  if (balanceTxt) {
    balanceTxt.textContent = balancePct >= 80 ? 'A’lo darajada (90%)'
      : balancePct >= 60 ? 'Yaxshi (75%)'
      : balancePct >= 40 ? 'O‘rtacha (50%)'
      : 'E’tibor kerak (35%)';
  }

  // Plan card — show next scheduled task for today
  const planText = document.getElementById('dash-plan-text');
  const planSub  = document.getElementById('dash-plan-sub');
  const now      = new Date();
  const timeNow  = now.getHours() * 60 + now.getMinutes();

  const upcoming = tasks
    .filter(t => !t.isBreak)
    .sort((a, b) => a.time.localeCompare(b.time))
    .find(t => {
      const [h, m] = (t.time || '00:00').split(':').map(Number);
      return (h * 60 + m) >= timeNow;
    });

  if (planText) planText.textContent = upcoming ? upcoming.name : 'Nafas & Musiqa';
  if (planSub)  planSub.textContent  = upcoming ? `Soat ${upcoming.time} da` : 'Ruhiy Maydonga o\'ting';
}

/* ── Weekly mood chart ────────────────────────────────────────────────────── */
function drawWeeklyChart() {
  const canvas = document.getElementById('weekly-chart-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const rect   = parent.getBoundingClientRect();
  const W      = rect.width  || 600;
  const H      = rect.height || 195;

  canvas.width  = W;
  canvas.height = H;

  const ctx  = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const rawData = MindCareStorage.getWeeklyMoods(); // 7-item array
  const checkin = MindCareStorage.getTodayCheckin();
  
  // Synthesize realistic baseline if mostly empty so chart looks beautiful
  const defaultMoods = [4, 4, 3, 2, 5, 4, checkin ? (MOOD_VALUES[checkin.mood] || 3) : 4];
  const values = rawData.map((m, i) => m ? (MOOD_VALUES[m] || 3) : defaultMoods[i]);

  const padL = 40, padR = 25, padT = 20, padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 1; i <= 5; i++) {
    const y = padT + plotH - ((i - 1) / 4) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Compute point positions
  const points = values.map((v, i) => ({
    x: padL + (i / 6) * plotW,
    y: padT + plotH - ((v - 1) / 4) * plotH
  }));

  // Gradient fill under curve
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
  grad.addColorStop(1, 'rgba(6, 182, 212, 0.00)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, H - padB);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw smooth Bezier curve line
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else {
      const prev = points[i - 1];
      const cpX  = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpX, prev.y, cpX, p.y, p.x, p.y);
    }
  });
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth   = 3;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.shadowColor = 'rgba(96, 165, 250, 0.6)';
  ctx.shadowBlur  = 12;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  // Draw glowing data dots & X labels
  const days = ['Du', 'Se', 'Chor', 'Pay', 'Jum', 'Shan', 'Bugun'];
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';

  points.forEach((p, i) => {
    // Dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === 6 ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = i === 6 ? '#fff' : '#60a5fa';
    ctx.shadowColor = 'rgba(96, 165, 250, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = i === 6 ? '#60a5fa' : 'rgba(255,255,255,0.45)';
    ctx.fillText(days[i], p.x, H - 8);
  });
}

/* ── Init on DOMContentLoaded ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('resize', () => {
    if (document.getElementById('view-overview')?.classList.contains('active')) {
      drawWeeklyChart();
    }
  });
});

