/**
 * MindCare Planner
 * Renders timeline, handles add/delete tasks, shows balance suggestion.
 */

/* ── Public render hook for router ────────────────────────────────────────── */
window.renderPlannerTimeline = function () {
  renderTimeline();
};

document.addEventListener('DOMContentLoaded', () => {
  const nameInput     = document.getElementById('task-name');
  const timeInput     = document.getElementById('task-time');
  const durationSel   = document.getElementById('task-duration');
  const prioritySel   = document.getElementById('task-priority');
  const breakCheckbox = document.getElementById('task-break');
  const addBtn        = document.getElementById('add-task-btn');
  const timeline      = document.getElementById('planner-timeline');
  const suggestion    = document.getElementById('planner-suggestion');

  if (!timeline) return;

  /* ── Render timeline ──────────────────────────────────────────────────────── */
  function renderTimeline() {
    const tasks = MindCareStorage.getPlannerTasks()
      .slice()
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    timeline.innerHTML = '';

    if (tasks.length === 0) {
      timeline.innerHTML =
        '<p style="text-align:center;color:var(--text-tertiary);padding:28px 0;font-size:0.9rem;">Hozircha vazifalar yo‘q — birinchi mashg‘ulotingizni qo‘shing.</p>';
      if (suggestion) suggestion.style.display = 'none';
      return;
    }

    const PRIORITY_LABELS = { low: 'Past', medium: 'O‘rtacha', high: 'Yuqori' };

    tasks.forEach(task => {
      const item = document.createElement('div');
      item.className = `timeline-item${task.isBreak ? ' break' : ''}`;
      item.setAttribute('data-id', task.id);

      const meta = task.isBreak
        ? `Tanaffus · ${task.duration} daqiqa`
        : `${task.duration} daqiqa · ${PRIORITY_LABELS[task.priority] || task.priority} muhimlik`;

      item.innerHTML = `
        <div class="timeline-time">${task.time}</div>
        <div class="timeline-content">
          <div class="timeline-title">${escHtml(task.name)}</div>
          <div class="timeline-meta">${meta}</div>
        </div>
        <button class="timeline-delete" data-id="${task.id}" title="Vazifani o‘chirish">×</button>
      `;

      timeline.appendChild(item);
    });

    // Delete listeners
    timeline.querySelectorAll('.timeline-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.getAttribute('data-id');
        const item = timeline.querySelector(`.timeline-item[data-id="${id}"]`);
        if (item) {
          item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          item.style.opacity    = '0';
          item.style.transform  = 'translateX(20px)';
          setTimeout(() => {
            MindCareStorage.deletePlannerTask(id);
            renderTimeline();
            showToast('Vazifa o‘chirildi.', 'info');
          }, 260);
        }
      });
    });

    updateSuggestion(tasks);
  }

  /* ── Suggestion message ───────────────────────────────────────────────────── */
  function updateSuggestion(tasks) {
    if (!suggestion) return;

    let consecutive = 0, maxConsec = 0, studyMin = 0, hasBreaks = false;

    tasks.forEach(t => {
      if (t.isBreak) {
        hasBreaks  = true;
        consecutive = 0;
      } else {
        consecutive++;
        maxConsec = Math.max(maxConsec, consecutive);
        studyMin += parseInt(t.duration || 0, 10);
      }
    });

    let msg = '';
    if (maxConsec >= 3) {
      msg = '💡 Kun tartibingiz juda zich. Dars bloklari orasiga qisqa tanaffuslar qo‘shishni maslahat beramiz.';
    } else if (studyMin > 180) {
      msg = '💡 Juda ko‘p o‘qish vaqti. Esda tuting: Diqqat + Dam olish = Eng yaxshi natija.';
    } else if (!hasBreaks && tasks.length > 1) {
      msg = "💡 Tanaffuslarni unutmang — miyangizga ham quvvat to‘plash uchun vaqt kerak.";
    } else if (tasks.length > 0) {
      msg = '✨ Ajoyib muvozanat! Jadvalingizda o‘qish va dam olish juda to‘g‘ri taqsimlangan.';
    }

    if (msg) {
      suggestion.textContent = msg;
      suggestion.style.display = 'flex';
    } else {
      suggestion.style.display = 'none';
    }
  }

  /* ── Add task ─────────────────────────────────────────────────────────────── */
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name     = nameInput?.value.trim()  || '';
      const time     = timeInput?.value         || '';
      const duration = durationSel?.value       || '30';
      const priority = prioritySel?.value       || 'medium';
      const isBreak  = breakCheckbox?.checked   || false;

      if (!name) {
        showToast('Iltimos, vazifa nomini kiriting.', 'warning');
        return;
      }
      if (!time) {
        showToast('Iltimos, boshlanish vaqtini belgilang.', 'warning');
        return;
      }

      const task = {
        id:       'task_' + Date.now(),
        name,
        time,
        duration,
        priority,
        isBreak,
        date:     new Date().toISOString().split('T')[0]
      };

      MindCareStorage.savePlannerTask(task);

      // Reset form
      if (nameInput)     nameInput.value      = '';
      if (timeInput)     timeInput.value      = '';
      if (breakCheckbox) breakCheckbox.checked = false;

      renderTimeline();
      showToast('Vazifa jadvalga qo‘shildi!', 'success');
    });
  }

  /* ── Initial render (called when planner view opens) ────────────────────── */
  renderTimeline();

  /* ── Helper ──────────────────────────────────────────────────────────────── */
  function escHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
