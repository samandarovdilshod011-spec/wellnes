/**
 * Youth Mental Wellness — AI Companion & Kognitiv CBT Suhbatdosh
 * Jonli AI API (Google Gemini, OpenAI, Groq) + Offline Kognitiv CBT Dvigateli
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ymw_ai_api_key';
  var STORAGE_PROVIDER = 'ymw_ai_provider';

  var history = [];
  var sending = false;
  var defIdx = 0;

  var SYSTEM_PROMPT =
    "Siz universal, o'ta aqlli va har qanday savolga aniq, tushunarli, to'g'ri va do'stona javob beruvchi sun'iy intellektsiz (ChatGPT kabi). O'zbek tilida so'zlashasiz.\n" +
    "Foydalanuvchi sizdan xohlagan mavzuda: matematika (masalan, 3-2=1), fan, dasturlash, psixologiya, hayotiy maslahat, tarix, qiziqarli faktlar, ta'lim, kognitiv CBT terapiya yoki shunchaki erkin suhbat uchun savol berishi mumkin.\n" +
    "Har bir savolga to'liq, lo'nda va chiroyli formatda (markdown, qalin so'zlar, punktlar va emoji bilan) javob qaytaring.";

  /* ═══ MATEMATIK HISOB-KITOBLARNI ZUMDA YECHISH ═══ */
  function trySolveMath(text) {
    var raw = (text || '').trim();
    var m = raw.match(/([0-9\s+\-*/().^%]+)/);
    var candidate = m ? m[1].replace(/\s+/g, '') : '';
    if (candidate && /[0-9]/.test(candidate) && /[+\-*/^%]/.test(candidate) && !/[a-zA-Z_]/.test(candidate)) {
      try {
        var exp = candidate.replace(/\^/g, '**');
        var res = Function('"use strict";return (' + exp + ')')();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return "**Javob:** `" + candidate + " = " + res + "` 🎯\n\n" +
                 "Agar yana biror hisob-kitob, matematika yoki boshqa savollaringiz bo'lsa, bemalol so'rang!";
        }
      } catch (e) {}
    }
    return null;
  }

  /* ═══ LIVE CHATGPT (PUTER.JS ORQALI) ═══ */
  function callPuterAI(text, callback) {
    if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
      var msgs = [
        { role: 'system', content: SYSTEM_PROMPT }
      ];
      var recent = history.slice(-6);
      for (var i = 0; i < recent.length; i++) {
        msgs.push({ role: recent[i].role === 'assistant' ? 'assistant' : 'user', content: recent[i].content });
      }
      msgs.push({ role: 'user', content: text });

      window.puter.ai.chat(msgs, { model: 'gpt-4o-mini' })
        .then(function (res) {
          var reply = '';
          if (typeof res === 'string') {
            reply = res;
          } else if (res && res.message && res.message.content) {
            reply = res.message.content;
          } else if (res && res.text) {
            reply = res.text;
          }
          if (reply && reply.trim()) {
            callback(null, reply.trim());
          } else {
            callback(new Error('Puter empty response'));
          }
        })
        .catch(function (err) {
          callback(err);
        });
    } else {
      callback(new Error('Puter AI not available'));
    }
  }

  /* ═══ 1. OFFLINE AQLLI CBT & SUHBATDOSH DVIGATELI ═══ */
  var CBT_RESPONSES = [
    // 1. Salomlashish va hol-ahvol
    {
      k: ['qalesan', 'qandaysan', 'qalesiz', 'qandaysiz', 'qalaysan', 'qalaysiz', 'salom', 'assalom', 'privet', 'salam', 'tinchmi', 'nima gap', 'ishlar qalay', 'ahvol', 'yaxshimisiz', 'hormang', 'hayrli tong', 'xayrli kun', 'xayrli kech'],
      r: "Assalomu alaykum! Zo'r, rahmat! 😊 Sizning hol-ahvollaringiz qalay?\n\nBugun kayfiyatingiz va kuningiz qanday o'tmoqda? Qanday yangiliklar yoki qiziq mavzular bor?"
    },
    // 2. Tanishuv va vazifasi
    {
      k: ['kimsan', 'kimsen', 'sen kimsan', 'nima qila olasan', 'vazifang nima', 'nima bilasan', 'botmisan', 'robotmisan', 'isming nima', 'qobiliyating'],
      r: "Men — **Youth Mental Wellness** loyihasining sun'iy intellekt kognitiv-psixologik (CBT) do'stingizman! 🧠✨\n\nMenga quyidagi mavzularda bemalol murojaat qilishingiz mumkin:\n• 🌿 **Stress, vahima va xavotirni kamaytirish**\n• 📚 **O'qish, imtihon va vaqtni boshqarish**\n• 🎯 **O'ziga ishonchni oshirish va dangasalikni yengish**\n• 💭 **To'xtovsiz o'y-fikrlar (overthinking)ni tinchlantirish**\n• 🌙 **Sog'lom uyqu va ruhiy quvvatni tiklash**\n\nBugun sizga qaysi masalada yordam bera olaman?"
    },
    // 3. Ijobiy kayfiyat
    {
      k: ['zo\'r', 'yaxshiman', 'ajoyib', 'juda yaxshi', 'hammasi joyida', 'shukur', 'alhamdulillah', 'yomon emas', 'kayfiyatim yaxshi'],
      r: "Buni eshitishdan juda xursandman! 🎉 Ijobiy kayfiyat — yangi marralar va maqsadlar uchun eng yaxshi quvvat.\n\nBugungi kuningiz yanada unumli va qiziqarli o'tishi uchun qanday rejalaringiz bor?"
    },
    // 4. Minnatdorchilik
    {
      k: ['rahmat', 'raxmat', 'katta rahmat', 'tashakkur', 'minnatdorman', 'yordam berding', 'foydali bo\'ldi'],
      r: "Arzimaydi, sizga foydam tekkanidan juda xursandman! 😊 Doim yoningizdaman. Agar yana biror savol yoki fikringiz bo'lsa, bemalol yozavering. O'zingizni ehtiyot qiling! 💙"
    },
    // 5. Dangasalik va boshlay olmaslik
    {
      k: ['dangasa', 'erinchoq', 'erin', 'surish', 'kechiktir', 'boshlay olmayapman', 'iroda', 'prokrastinatsiya'],
      r: "Dangasalik ko'pincha kuchsizlik emas, balki boshlanajak ishning miyaga haddan tashqari katta yoki noaniq tuyulishidir! 🎯\n\n" +
         "**⚡ 5 soniya qoidasi (Mel Robbins):**\n" +
         "5-4-3-2-1 deb orqaga sanang va hech narsa haqida ortiqcha o'ylamasdan o'rningizdan turib eng kichik birinchi qadamni qo'ying (masalan, daftarni ochish yoki stolga o'tirish).\n\n" +
         "Qaysi ishni orqaga suryapsiz? Keling, uni hozir birgalikda 2 daqiqalik kichik bo'lakka ajratamiz!"
    },
    // 6. Xavotir, vahima, qo'rquv, stress
    {
      k: ['xavotir', 'qo\'rq', 'vahima', 'panik', 'stress', 'bezovta', 'yuragim', 'tashvish', 'asab'],
      r: "Sizdagi bu xavotirni tushunaman va buni his qilish mutlaqo tabiiy. 🌿\n\n" +
         "**🧠 CBT Tahlili: Fikr va Dalil (Fact vs Thought)**\n" +
         "Xavotir ko'pincha noaniqlikni \"eng yomon ssenariy\" sifatida talqin qilishdan kelib chiqadi.\n\n" +
         "**💡 Kognitiv qayta baholash savollari:**\n" +
         "1. Bu qo'rquvingizni 100% tasdiqlovchi aniq faktlar bormi yoki bu shunchaki ongingiz taxminimi?\n" +
         "2. Eng yomon holat yuz berganda ham, sizda bunga qarshi qanday ichki kuch va choralar bor?\n\n" +
         "✨ **Amaliy mikro-mashq (4-4-6 nafas):** Hozir 4 soniya burun orqali chuqur nafas oling, 4 soniya ushlab turing va 6 soniya og'iz orqali sekin chiqaring."
    },
    // 7. O'ziga ishonchsizlik
    {
      k: ['ishonch', 'uddalay', 'xato', 'omadsiz', 'aybdor', 'yetarli', 'imposter', 'qo\'limdan kelm', 'yaramsiz', 'past baholash'],
      r: "O'zingizga nisbatan haddan tashqari qattiqqo'l bo'layotganingizni sezmoqdaman. Siz yolg'iz emassiz. 💙\n\n" +
         "**🧠 CBT Tahlili: \"Barchasi yoki hech narsa\" tuzog'i**\n" +
         "Miya bitta xato yoki vaqtinchalik qiyinchilik tufayli butun shaxsingizni \"omadsiz\" deb tamg'alashga moyil bo'ladi. Ammo bu xolis haqiqat emas.\n\n" +
         "**💡 Do'stona nigoh mashqi:**\n" +
         "Agar eng yaqin do'stingiz xuddi shunday vaziyatga tushsa, unga nima degan bo'lardingiz? Siz unga tanqid emas, dalda bergan bo'lardingiz. O'zingizga ham xuddi shunday mehr bilan munosabatda bo'ling.\n\n" +
         "🌱 **Yodda tuting:** Har bir xato — bu yangi tajriba va o'sish imkoniyati."
    },
    // 8. Overthinking va to'xtovsiz fikrlar
    {
      k: ['overthinking', 'o\'ylayapman', 'miyam', 'tinchlan', 'uxlay', 'xayol', 'uyqu', 'fikrlar', 'boshim qotdi'],
      r: "Ongingiz to'xtovsiz aylanayotgan fikrlar girdobida qolganga o'xshaydi. 🌌\n\n" +
         "**🧠 CBT Tahlili: Fikrlar — bu fakt emas**\n" +
         "Ongimiz kuniga minglab tasodifiy fikrlarni ishlab chiqaradi. Har bir fikr haqiqat ekanligini anglatmaydi.\n\n" +
         "**⚓ 5-4-3-2-1 Grounding (Yerga ulanish) mashqi:**\n" +
         "• **5 ta** xonadagi ko'rinib turgan narsani ko'z bilan toping.\n" +
         "• **4 ta** teginishingiz mumkin bo'lgan narsani his qiling.\n" +
         "• **3 ta** eshitilayotgan tovushga diqqat qarating.\n" +
         "• **2 ta** chuqur va xotirjam nafas oling.\n" +
         "• **1 ta** ijobiy haqiqat: *\"Men hozirgi lahzada xavfsizman va hammasi o'tib ketadi.\"*"
    },
    // 9. Ruhiy charchoq va tushkunlik
    {
      k: ['charchad', 'quvvat', 'kuchim', 'tushkun', 'yig\'la', 'ma\'nosiz', 'og\'ir', 'yolg\'iz', 'holsiz', 'siqildim', 'kayfiyatim yo\'q', 'zerikdim'],
      r: "Ichingizdagi bu og'irlik va charchoqni tushunaman. O'zingizni erkin his qiling. 🕊️\n\n" +
         "**🧠 Kichik tanaffus va tiklanish:**\n" +
         "Ruhiy charchoq paytida miya hamma narsadan toliqadi. Hozir o'zingizni hech narsaga majburlamang.\n\n" +
         "**🌱 Kichik qadam:**\n" +
         "Bir piyola iliq choy yoki suv iching, derazadan toza havodan nafas oling yoki shunchaki 10 daqiqa ko'zingizni yumib dam oling. Siz tiklanishga to'la haqlisiz."
    },
    // 10. Imtihon, dars, o'qish, test
    {
      k: ['imtihon', 'dars', 'o\'qish', 'sessiya', 'karyera', 'ulgur', 'ish', 'bosim', 'dtm', 'universitet', 'maktab', 'test'],
      r: "O'qish va imtihon bosimi paytida xavotirga tushish ko'pchilikda bo'ladi. 🎯\n\n" +
         "**💡 Pomodoro va bo'laklarga ajratish strategiyasi:**\n" +
         "Katta hajmdagi darslarni birdaniga ko'rib vahimaga tushmang. Diqqatingizni faqat keyingi **25 daqiqaga** qarating va keyin 5 daqiqa tanaffus qiling.\n\n" +
         "Aynan qaysi fan yoki mavzuda qiynalyapsiz? Rejani birgalikda tuzamiz!"
    },
    // 11. Ijtimoiy munosabatlar va boshqalarning fikri
    {
      k: ['odamlar', 'ijtimoiy', 'taqqos', 'xijolat', 'gap-so\'z', 'boshqalar', 'uyal', 'munosabat', 'do\'stim', 'ota-onam'],
      r: "Boshqalarning fikri yoki ijtimoiy taqqoslash sababli yuzaga kelgan bosim og'ir tuyulishi mumkin. 🤝\n\n" +
         "**💡 Shaxsiy mezonlar:**\n" +
         "Har kimning o'z yo'li va hayotiy sur'ati bor. Sizning qadringiz boshqalarning bahosi bilan belgilanmaydi. O'z qadriyatlaringizga ishoning."
    },
    // 12. Motivatsiya yoki maslahat so'rash
    {
      k: ['motivatsiya', 'maslahat', 'maslahating', 'nima qilay', 'yordam ber', 'ilhom', 'fakt'],
      r: "Sizga hozir kerak bo'lgan eng muhim maslahat: **katta natijalar kichik odatlarning yig'indisidir!** 🌟\n\n" +
         "Mukammallik (perfeksionizm)ni quvmang, shunchaki har kuni 1% yaxshiroq bo'lishga harakat qiling. Bugun o'zingiz uchun qaysi kichik qadamni tashlashga tayyorsiz?"
    }
  ];

  function getLocalCBTReply(text) {
    var l = (text || '').toLowerCase().trim();
    for (var i = 0; i < CBT_RESPONSES.length; i++) {
      for (var j = 0; j < CBT_RESPONSES[i].k.length; j++) {
        if (l.indexOf(CBT_RESPONSES[i].k[j]) !== -1) {
          return CBT_RESPONSES[i].r;
        }
      }
    }
    var defaults = [
      "Sizni diqqat bilan tinglamoqdaman. 🌿 Bu mavzu haqida batafsilroq aytib bera olasizmi? Aynan qaysi jihati sizni ko'proq o'ylantiryapti?",
      "Fikringizni tushundim. 💙 Keling, bunga yangicha nigoh bilan qaraymiz: bu vaziyatda siz uchun eng yaxshi yechim nima bo'lishi mumkin?",
      "Ochiq yozganingiz uchun rahmat. 🌟 Keling, birgalikda bu masalani bosqichma-bosqich yechamiz. Qanday his qilyapsiz?"
    ];
    return defaults[(defIdx++) % defaults.length];
  }

  /* ═══ 2. MATN FORMATLASH ═══ */
  function fmt(t) {
    return (t || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p style="margin-top:10px">')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '<span style="color:var(--accent-blue)">•</span>');
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

  /* ═══ 4. API CALL HANDLERS (GEMINI, OPENAI, GROQ) ═══ */

  function callGemini(apiKey, text, callback) {
    var endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

    var contents = [];
    var recent = history.slice(-8);
    for (var i = 0; i < recent.length; i++) {
      contents.push({
        role: recent[i].role === 'assistant' ? 'model' : 'user',
        parts: [{ text: recent[i].content }]
      });
    }

    var payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 25000;

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          var replyText = res.candidates[0].content.parts[0].text;
          callback(null, replyText);
        } catch (e) {
          callback(e);
        }
      } else {
        callback(new Error('Gemini HTTP ' + xhr.status));
      }
    };

    xhr.onerror = xhr.ontimeout = function () {
      callback(new Error('Gemini Network Error'));
    };

    xhr.send(JSON.stringify(payload));
  }

  function callOpenAI(apiKey, provider, text, callback) {
    var url = provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    var model = provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

    var msgs = [{ role: 'system', content: SYSTEM_PROMPT }];
    var recent = history.slice(-8);
    for (var i = 0; i < recent.length; i++) {
      msgs.push({ role: recent[i].role, content: recent[i].content });
    }

    var payload = {
      model: model,
      messages: msgs,
      temperature: 0.7,
      max_tokens: 1000
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey.trim());
    xhr.timeout = 25000;

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          var reply = res.choices[0].message.content;
          callback(null, reply);
        } catch (e) {
          callback(e);
        }
      } else {
        callback(new Error('OpenAI HTTP ' + xhr.status));
      }
    };

    xhr.onerror = xhr.ontimeout = function () {
      callback(new Error('OpenAI Network Error'));
    };

    xhr.send(JSON.stringify(payload));
  }

  /* ═══ 5. SEND PROCESSOR ═══ */
  function send(text) {
    text = (text || '').trim();
    if (!text || sending) return;
    sending = true;

    var inp = document.getElementById('chat-input');
    if (inp) {
      inp.value = '';
      inp.style.height = 'auto';
    }

    addMsg('user', text);
    showTyping();

    var apiKey = (localStorage.getItem(STORAGE_KEY) || '').trim();
    var provider = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';

    function finish(replyText) {
      hideTyping();
      addMsg('assistant', replyText);
      sending = false;
      checkCrisis(text);
    }

    // 1. Matematik tezkor hisob-kitob (3-2, 5*5, 100/4...)
    var mathRes = trySolveMath(text);
    if (mathRes) {
      setTimeout(function () {
        finish(mathRes);
      }, 300);
      return;
    }

    function fallbackPuterOrLocal() {
      // 3. Bepul Jonli ChatGPT (Puter.js orqali)
      callPuterAI(text, function (err, reply) {
        if (!err && reply) {
          finish(reply);
        } else {
          // 4. Offline aqlli kognitiv CBT modeli
          var delay = 450 + Math.floor(Math.random() * 300);
          setTimeout(function () {
            finish(getLocalCBTReply(text));
          }, delay);
        }
      });
    }

    // 2. Foydalanuvchi kiritgan shaxsiy API kalit (agar mavjud bo'lsa)
    if (apiKey) {
      if (provider === 'gemini') {
        callGemini(apiKey, text, function (err, reply) {
          if (!err && reply) {
            finish(reply);
          } else {
            fallbackPuterOrLocal();
          }
        });
      } else {
        callOpenAI(apiKey, provider, text, function (err, reply) {
          if (!err && reply) {
            finish(reply);
          } else {
            fallbackPuterOrLocal();
          }
        });
      }
    } else {
      fallbackPuterOrLocal();
    }
  }

  function checkCrisis(text) {
    var t = text.toLowerCase();
    if (['o\'lim', 'suicid', 'zarar', 'yashashni'].some(function (w) { return t.indexOf(w) !== -1; })) {
      setTimeout(function () {
        if (window.YMWSos) window.YMWSos.open();
      }, 1200);
    }
  }

  function welcome() {
    var c = document.getElementById('chat-messages');
    if (!c) return;
    c.innerHTML = '';
    history = [];
    defIdx = 0;
    setTimeout(function () {
      addMsg(
        'assistant',
        "Assalomu alaykum! 🌿 Men Youth Mental Wellness **AI CBT Companion** suhbatdoshingizman.\n\n" +
        "Kognitiv-xulq-atvor psixologiyasi tamoyillari orqali stress, imtihon, o'ziga ishonch, overthinking yoki ruhiy charchoqni tahlil qilishga yordam beraman.\n\n" +
        "Hozir sizni nima bezovta qilyapti? O'zingizni bemalol ifoda eting."
      );
    }, 150);
  }

  /* ═══ 6. API KALITI SOZLAMALARI UI ═══ */
  function updateBadge() {
    var badge = document.getElementById('ai-api-status-badge');
    if (!badge) return;
    var apiKey = (localStorage.getItem(STORAGE_KEY) || '').trim();
    var provider = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';

    if (apiKey) {
      var pName = provider === 'gemini' ? 'Gemini' : provider === 'groq' ? 'Groq' : 'OpenAI';
      badge.textContent = '🟢 ' + pName + ' Ulangan';
    } else {
      badge.textContent = '⚙️ API Kaliti (CBT Faol)';
    }
  }

  function initApiKeySettings() {
    var toggleBtn = document.getElementById('ai-settings-toggle-btn');
    var panel = document.getElementById('ai-api-config-panel');
    var closeBtn = document.getElementById('ai-api-config-close');
    var saveBtn = document.getElementById('ai-api-key-save-btn');
    var keyInput = document.getElementById('ai-api-key-input');
    var provSelect = document.getElementById('ai-provider-select');
    var statusEl = document.getElementById('ai-api-key-status');

    if (!toggleBtn || !panel) return;

    var savedKey = localStorage.getItem(STORAGE_KEY) || '';
    var savedProv = localStorage.getItem(STORAGE_PROVIDER) || 'gemini';

    if (keyInput) keyInput.value = savedKey;
    if (provSelect) provSelect.value = savedProv;
    updateBadge();

    toggleBtn.addEventListener('click', function () {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        if (keyInput) keyInput.focus();
        if (window.lucide) lucide.createIcons();
      }
    });

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
})();

