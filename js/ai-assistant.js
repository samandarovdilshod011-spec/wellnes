/**
 * Youth Mental Wellness — ChatGPT Universal AI Companion
 * Universal Sun'iy Intellekt (ChatGPT-4o-mini & Kognitiv Yordamchi)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ymw_ai_api_key';
  var STORAGE_PROVIDER = 'ymw_ai_provider';

  var history = [];
  var sending = false;
  var defIdx = 0;

  var SYSTEM_PROMPT =
    "Siz universal, o'ta aqlli, do'stona va har qanday savolga aniq, to'g'ri, lo'nda javob beruvchi sun'iy intellektsiz (ChatGPT kabi). O'zbek tilida erkin va ravon gaplashasiz.\n" +
    "Foydalanuvchi sizdan xohlagan mavzuda: salomlashish, hol-ahvol so'rash (masalan, 'zormisan', 'nima gap'), dasturlash va kod yozish, matematika va hisob-kitob, psixologiya va CBT maslahatlari, ilm-fan, ta'lim, tarix, falsafa yoki oddiy erkin suhbat uchun savol berishi mumkin.\n" +
    "Har bir savolga ChatGPT kabi tabiiy, to'liq va tartibli formatda javob bering.";

  /* ═══ MATEMATIK HISOB-KITOBLARNI TEZKOR YECHISH ═══ */
  function trySolveMath(text) {
    var raw = (text || '').trim();
    var m = raw.match(/^([0-9\s+\-*/().^%]+)$/);
    if (m && /[0-9]/.test(raw) && /[+\-*/^%]/.test(raw) && !/[a-zA-Z_]/.test(raw)) {
      try {
        var exp = raw.replace(/\^/g, '**');
        var res = Function('"use strict";return (' + exp + ')')();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return "**Natija:** `" + raw + " = " + res + "`\n\nYana biror hisob-kitob yoki boshqa savolingiz bo'lsa, bemalol yozing.";
        }
      } catch (e) {}
    }
    return null;
  }

  /* ═══ 1. LIVE CHATGPT (PUTER.JS) ═══ */
  function callPuterAI(text, callback) {
    if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
      var prompt = SYSTEM_PROMPT + "\n\nSuhbat tarixi:\n";
      var recent = history.slice(-6);
      for (var i = 0; i < recent.length; i++) {
        prompt += (recent[i].role === 'assistant' ? 'AI: ' : 'Foydalanuvchi: ') + recent[i].content + "\n";
      }
      prompt += "Foydalanuvchi: " + text + "\nAI:";

      window.puter.ai.chat(prompt)
        .then(function (res) {
          var reply = '';
          if (typeof res === 'string') {
            reply = res;
          } else if (res && res.message && res.message.content) {
            reply = res.message.content;
          } else if (res && res.text) {
            reply = res.text;
          } else if (res && typeof res.toString === 'function') {
            reply = res.toString();
          }

          if (reply && reply.trim() && reply.trim() !== '[object Object]') {
            callback(null, reply.trim());
          } else {
            callback(new Error('Puter empty'));
          }
        })
        .catch(function (err) {
          callback(err);
        });
    } else {
      callback(new Error('Puter not initialized'));
    }
  }

  /* ═══ 2. SMART NATURAL CONVERSATIONAL ENGINE (OFFLINE/FALLBACK) ═══ */
  function getSmartChatGPTReply(text) {
    var l = (text || '').toLowerCase().trim();
    var clean = l.replace(/['`’‘]/g, '').replace(/[^a-z0-9\s]/g, ' ');

    if (clean.match(/\b(zormisan|zormisiz|zo'rmisan|zo'rmisiz|qalesan|qalesiz|qandaysan|qandaysiz|qalaysan|qalaysiz|ahvol|ahvollar|tinchmi|tinchlikmi|nima gap|nima gaplar|ishlar qalay|yaxshimisiz|tuzukmisiz)\b/)) {
      var salomResponses = [
        "Rahmat, juda yaxshi! O'zingizda nima gaplar? Kuningiz qanday o'tyapti? Qanday savolingiz bo'lsa bemalol bering, barchasiga javob berishga tayyorman.",
        "Zo'r, rahmat! Siz yaxshimisiz? Bugun qanday rejalaringiz bor yoki qaysi mavzuda suhbatlashamiz?",
        "Hammasi ajoyib! Sizning hol-ahvollaringiz qalay? Sizga qanday yordam bera olaman?"
      ];
      return salomResponses[Math.floor(Math.random() * salomResponses.length)];
    }

    if (clean.match(/\b(salom|assalom|assalomu|privet|salam|hayrli tong|xayrli tong|hayrli kun|xayrli kun|hayrli kech|xayrli kech)\b/)) {
      return "Assalomu alaykum! Xush kelibsiz. Qanday savolingiz yoki yordam kerak bo'lgan mavzu bor? Bemalol yozing.";
    }

    if (clean.match(/\b(kimsan|kimsen|sen kimsan|nima qila olasan|vazifang nima|nima bilasan|botmisan|robotmisan|isming nima|qobiliyating)\b/)) {
      return "Men sizning shaxsiy ChatGPT sun'iy intellekt yordamchingizman.\n\nMenga xohlagan savolingizni berishingiz mumkin:\n• Ilm-fan, texnologiya, dasturlash va kod yozish\n• Matematik va mantiqiy masalalar\n• Psixologiya, stressni boshqarish va hayotiy maslahatlar\n• O'qish, imtihonlar va vaqtni rejalashtirish\n• Erkin do'stona suhbat va savol-javoblar\n\nHozir sizni qaysi mavzu qiziqtiryapti?";
    }

    if (clean.match(/\b(rahmat|raxmat|katta rahmat|tashakkur|minnatdorman|spasibo|yordam berding|gap yoq|gap yo'q|tushundim)\b/)) {
      return "Arzimaydi, yordam berganimdan juda xursandman! Yana biror savolingiz yoki fikringiz bo'lsa, bemalol yozavering.";
    }

    if (clean.match(/\b(zor|zo'r|yaxshiman|ajoyib|juda yaxshi|alhamdulillah|shukur|yomon emas)\b/)) {
      return "Buni eshitishdan xursandman! Ijobiy kayfiyat davom etsin. Bugun nimalar ustida ishlamoqchisiz yoki qanday mavzuda fikr almashamiz?";
    }

    if (clean.match(/\b(kod|dasturlash|programming|python|javascript|html|css|react|sql|java|c\+\+|sayt|backend|frontend)\b/)) {
      return "**Dasturlash bo'yicha yordam:**\n\nMen JavaScript, Python, C++, HTML/CSS, SQL va boshqa ko'plab tillarda kod yozish, xatolarni (bug) topish yoki loyihangiz arxitekturasini tuzishda yordam bera olaman.\n\nAynan qaysi tilda qanday kod yozishimiz kerak? Kod parchasini yoki vazifani yozing.";
    }

    if (clean.match(/\b(xavotir|qorquv|qo'rquv|vahima|stress|bezovta|siqildim|asab|tashvish)\b/)) {
      return "**Stress va xavotirni yengish bo'yicha tavsiyalar:**\n\n1. **Fakt va taxminni ajrating:** Xavotir ko'pincha miyaning noaniqlikni eng yomon ssenariy sifatida tasavvur qilishidan kelib chiqadi. Haqiqatda nima sodir bo'layotganiga qarang.\n2. **Nazorat zonasi:** Faqat o'zingiz o'zgartira oladigan narsalarga diqqat qarating.\n3. **Chuqur nafas oling:** 4 soniya burundan nafas oling, 4 soniya ushlab turing va 6 soniya og'izdan chiqaring.\n\nSizni aynan nima bezovta qilyapti? Xohlasangiz batafsil aytib bering.";
    }

    if (clean.match(/\b(dangasa|erinchoq|erin|surish|kechiktir|boshlay olmayapman|iroda|prokrastinatsiya)\b/)) {
      return "**Dangasalikni yengish strategiyasi:**\n\n• **2 daqiqa qoidasi:** Ishni butunlay qilish haqida emas, faqat birinchi 2 daqiqasini qilish haqida o'ylang (masalan, daftarni ochish yoki bitta qator kod yozish).\n• **5-4-3-2-1 hisobi:** Orqaga sanang va ortiqcha o'ylamay darhol harakatga o'ting.\n\nQaysi vazifani boshlash kerak? Keling, uni eng kichik qadamlarga bo'lamiz.";
    }

    if (clean.match(/\b(uyqu|uxlay|charchad|quvvat|holsiz|uyqusizlik|kechasi)\b/)) {
      return "**Uyqu va quvvatni tiklash:**\n\n• Uyqudan 1 soat oldin ekranlarni (telefon, noutbuk) chetga suring.\n• Xonani shamollatib, salqin havo yarating.\n• Bir stakan iliq suv yoki choy ichib, miyani tinchlantirish.\n\nBugun o'zingizga to'liq dam olish uchun imkoniyat bering.";
    }

    var defaults = [
      "Fikringizni tushundim. Bu masala haqida yana qanday aniq savollaringiz yoki rejalaringiz bor? Batafsil davom ettirishimiz mumkin.",
      "Ajoyib savol. Buni tahlil qilish uchun quyidagi jihatlarga e'tibor qaratishimiz mumkin. Sizga aynan qaysi yo'nalishda batafsil ma'lumot kerak?",
      "Sizni tinglayapman. Istalgan mavzuda — bilim, maslahat, tahlil yoki kod bo'yicha savolingizni bering, to'liq tushuntirib beraman."
    ];

    return defaults[(defIdx++) % defaults.length];
  }

  /* ═══ 3. CHAT XABARLARINI CHIQARISH ═══ */
  function addMsg(role, text) {
    var c = document.getElementById('chat-messages');
    if (!c) return;
    var isUser = role === 'user';

    var wrap = document.createElement('div');
    wrap.className = 'ai-msg-row' + (isUser ? ' ai-msg-user' : ' ai-msg-ai');

    var av = document.createElement('div');
    av.className = 'ai-msg-avatar';
    av.textContent = isUser ? 'Siz' : 'AI';

    var bub = document.createElement('div');
    bub.className = 'ai-msg-bubble';
    bub.innerHTML = '<p>' + fmt(text) + '</p>';

    wrap.appendChild(av);
    wrap.appendChild(bub);
    c.appendChild(wrap);
    c.scrollTop = c.scrollHeight;

    history.push({ role: isUser ? 'user' : 'assistant', content: text });
    if (history.length > 40) history.splice(0, 2);
  }

  function showTyping() {
    var c = document.getElementById('chat-messages');
    if (!c) return;
    var d = document.createElement('div');
    d.id = 'ai-typing';
    d.className = 'ai-msg-row ai-msg-ai';
    d.innerHTML =
      '<div class="ai-msg-avatar">AI</div>' +
      '<div class="ai-msg-bubble" style="display:flex;gap:5px;align-items:center;padding:12px 18px">' +
      '<span class="aidot"></span><span class="aidot" style="animation-delay:.2s"></span><span class="aidot" style="animation-delay:.4s"></span>' +
      '</div>';
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  function hideTyping() {
    var e = document.getElementById('ai-typing');
    if (e) e.remove();
  }

  /* ═══ 4. API CALL HANDLERS ═══ */
  function callGemini(apiKey, text, callback) {
    var endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
    var contents = [];
    var recent = history.slice(-8);
    for (var i = 0; i < recent.length; i++) {
      contents.push({ role: recent[i].role === 'assistant' ? 'model' : 'user', parts: [{ text: recent[i].content }] });
    }
    var payload = { systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents: contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1000 } };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var res = JSON.parse(xhr.responseText);
        callback(null, res.candidates[0].content.parts[0].text);
      } else { callback(new Error('Gemini error')); }
    };
    xhr.send(JSON.stringify(payload));
  }

  function callOpenAI(apiKey, provider, text, callback) {
    var url = provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    var payload = { model: provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini', messages: [{ role: 'system', content: SYSTEM_PROMPT }].concat(history.slice(-8)), temperature: 0.7 };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey.trim());
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var res = JSON.parse(xhr.responseText);
        callback(null, res.choices[0].message.content);
      } else { callback(new Error('API error')); }
    };
    xhr.send(JSON.stringify(payload));
  }

  /* ═══ 5. SEND PROCESSOR ═══ */
  function send(text) {
    text = (text || '').trim();
    if (!text || sending) return;
    sending = true;

    var inp = document.getElementById('chat-input');
    if (inp) { inp.value = ''; inp.style.height = 'auto'; }

    addMsg('user', text);
    showTyping();

    var apiKey = (localStorage.getItem(STORAGE_KEY) || '').trim();
    var provider = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';

    function finish(replyText) {
      hideTyping();
      addMsg('assistant', replyText);
      sending = false;
    }

    var mathRes = trySolveMath(text);
    if (mathRes) { setTimeout(function () { finish(mathRes); }, 300); return; }

    function fallbackPuterOrSmart() {
      callPuterAI(text, function (err, reply) {
        if (!err && reply) { finish(reply); } else {
          setTimeout(function () { finish(getSmartChatGPTReply(text)); }, 400);
        }
      });
    }

    if (apiKey) {
      if (provider === 'gemini') {
        callGemini(apiKey, text, function (err, reply) {
          if (!err && reply) finish(reply); else fallbackPuterOrSmart();
        });
      } else {
        callOpenAI(apiKey, provider, text, function (err, reply) {
          if (!err && reply) finish(reply); else fallbackPuterOrSmart();
        });
      }
    } else {
      fallbackPuterOrSmart();
    }
  }

  function welcome() {
    var c = document.getElementById('chat-messages');
    if (!c) return;
    c.innerHTML = '';
    history = [];
    defIdx = 0;
    setTimeout(function () {
      addMsg('assistant', "Assalomu alaykum! Men sizning universal ChatGPT sun'iy intellekt yordamchingizman.\n\nMenga istalgan mavzuda savol berishingiz, fikr almashishingiz, maslahat olishingiz yoki erkin suhbatlashishingiz mumkin.\n\nBugun sizga qanday yordam bera olaman?");
    }, 150);
  }

  function updateBadge() {
    var badge = document.getElementById('ai-api-status-badge');
    if (!badge) return;
    var apiKey = (localStorage.getItem(STORAGE_KEY) || '').trim();
    var provider = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';
    if (apiKey) {
      var pName = provider === 'gemini' ? 'Gemini' : provider === 'groq' ? 'Groq' : 'OpenAI';
      badge.textContent = 'API Ulangan (' + pName + ')';
      badge.style.color = '#10b981';
    } else {
      badge.textContent = 'ChatGPT Rejimi';
      badge.style.color = 'var(--accent-blue)';
    }
  }

  function initAPIKeyPanel() {
    var toggleBtn = document.getElementById('ai-settings-toggle-btn');
    var panel = document.getElementById('ai-api-config-panel');
    var closeBtn = document.getElementById('ai-api-config-close');
    var saveBtn = document.getElementById('ai-api-key-save-btn');
    var input = document.getElementById('ai-api-key-input');
    var providerSelect = document.getElementById('ai-provider-select');
    var statusEl = document.getElementById('ai-api-key-status');

    if (!toggleBtn || !panel) return;
    if (input) input.value = localStorage.getItem(STORAGE_KEY) || '';
    if (providerSelect) providerSelect.value = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';
    updateBadge();

    toggleBtn.addEventListener('click', function () {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        panel.style.display = 'none';
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var key = (keyInput ? keyInput.value : '').trim();
        var prov = provSelect ? provSelect.value : 'gemini';

        localStorage.setItem(STORAGE_KEY, key);
        localStorage.setItem(STORAGE_PROVIDER, prov);
        updateBadge();

        if (statusEl) {
          if (key) {
            statusEl.textContent = '✅ API kaliti saqlandi! Jonli ' + prov.toUpperCase() + ' modeli faol.';
            statusEl.style.color = '#10b981';
          } else {
            statusEl.textContent = 'ℹ️ Kalit tozalandi. O\'rnatilgan aqlli CBT modeli faol.';
            statusEl.style.color = '#3b82f6';
          }
        }
        if (window.showToast) {
          window.showToast(key ? 'API kaliti saqlandi!' : 'Lokal CBT rejimiga o\'tildi', 'success');
        }
      });
    }
  }

  /* ═══ 7. INIT ═══ */
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('ai-dot-css')) {
      var s = document.createElement('style');
      s.id = 'ai-dot-css';
      s.textContent =
        '@keyframes aidotAnim{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}' +
        '.aidot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#8b5cf6;animation:aidotAnim 1.2s infinite;}';
      document.head.appendChild(s);
    }

    welcome();
    initApiKeySettings();

    /* Send button */
    document.getElementById('chat-send-btn')?.addEventListener('click', function () {
      send((document.getElementById('chat-input') || {}).value || '');
    });

    /* Enter */
    document.getElementById('chat-input')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(this.value);
      }
    });

    /* Prompt chips */
    document.querySelectorAll('.prompt-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var text = chip.textContent.replace(/^[^\w\s\u0400-\u04FF\u00C0-\u024F]+/u, '').trim();
        send(text || chip.textContent.trim());
      });
    });
  });

  window.initAIChat = function () {
    var c = document.getElementById('chat-messages');
    if (!c || c.children.length === 0) {
      welcome();
    }
  };
})();

