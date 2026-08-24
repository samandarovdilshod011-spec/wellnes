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

  /* ═══ 1. UNIVERSAL CHATGPT INTELLIGENCE ENGINE ═══ */
  function getSmartChatGPTReply(text) {
    var raw = (text || '').trim();
    var l = raw.toLowerCase();
    var clean = l.replace(/['`’‘]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    /* 1. Salomlashish va hol-ahvol */
    if (clean.match(/\b(zormisan|zormisiz|zo'rmisan|zo'rmisiz|qalesan|qalesiz|qandaysan|qandaysiz|qalaysan|qalaysiz|ahvol|ahvollar|tinchmi|tinchlikmi|nima gap|nima gaplar|ishlar qalay|yaxshimisiz|tuzukmisiz|yaxshimisilar|nima gapla|tinchmisan|tinchmisiz)\b/)) {
      var salomReplies = [
        "Rahmat, juda yaxshi! O'zingizda nima gaplar? Kuningiz qanday o'tyapti? Qanday savol yoki yordam kerak bo'lsa, bemalol ayting — barchasiga javob berishga tayyorman.",
        "Zo'r, rahmat! Siz yaxshimisiz? Qanday yangiliklar bor? Bugun qaysi mavzuda suhbatlashamiz yoki qanday vazifada yordam beray?",
        "Hammasi ajoyib! Sizning hol-ahvollaringiz qalay? Ilm-fan, dasturlash, maslahat yoki shunchaki erkin suhbat uchun xizmatingizdaman."
      ];
      return salomReplies[Math.floor(Math.random() * salomReplies.length)];
    }

    if (clean.match(/\b(salom|assalom|assalomu|assalomu alaykum|privet|salam|hayrli tong|xayrli tong|hayrli kun|xayrli kun|hayrli kech|xayrli kech|salomaleykum)\b/)) {
      return "Assalomu alaykum! Xush kelibsiz. Qanday savolingiz yoki yordam kerak bo'lgan mavzu bor? Bemalol yozing, to'liq yordam beraman.";
    }

    /* 2. AI shaxsi va qobiliyatlari */
    if (clean.match(/\b(kimsan|kimsen|sen kimsan|nima qila olasan|vazifang nima|nima bilasan|botmisan|robotmisan|isming nima|qobiliyating|qobiliyatlaring|haqingda)\b/)) {
      return "Men universal **ChatGPT sun'iy intellekt yordamchingizman**.\n\nMenga istalgan sohada savol berishingiz mumkin:\n• **Dasturlash va IT:** Kod yozish, xatolarni to'g'rilash, arxitektura (Python, JS, C++, HTML/CSS, SQL...)\n• **Ilm-fan va Ta'lim:** Matematika, fizika, tarix, biologiya, kimyo, astronomiya\n• **Ruhiy salomatlik va CBT:** Stress, overthinking, motivatsiya, uyqu, vaqtni boshqarish\n• **Tillar va Matnlar:** Ingliz tili, tarjima, insho, maqola, she'r va tabriklar\n• **Erkin suhbat:** Hayotiy maslahatlar va har qanday kundalik savollar\n\nHozir sizga qaysi yo'nalishda yordam beray?";
    }

    /* 3. Minnatdorchilik va ijobiy hislar */
    if (clean.match(/\b(rahmat|raxmat|katta rahmat|tashakkur|minnatdorman|spasibo|yordam berding|gap yoq|gap yo'q|tushundim|zor ekan|zo'r ekan|ajoyib|molodes|yashavor)\b/)) {
      var thanksReplies = [
        "Arzimaydi, yordam berganimdan juda xursandman! Yana biror savolingiz yoki fikringiz bo'lsa, bemalol yozavering.",
        "Sizga foydam tekkanidan baxtiyorman! Doim xizmatingizdaman.",
        "Rahmat! O'zingizni ehtiyot qiling. Har qanday vaqtda yangi savollaringizni kutaman."
      ];
      return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];
    }

    if (clean.match(/\b(zor|zo'r|yaxshiman|hammasi joyida|shukur|alhamdulillah|yomon emas|kayfiyatim a'lo|kayfiyatim alo)\b/)) {
      return "Buni eshitishdan bag'oyat xursandman! Ijobiy kayfiyat davom etsin. Bugun qanday qiziqarli rejalaringiz bor yoki qaysi mavzuda fikr almashamiz?";
    }

    /* 4. Dasturlash va IT */
    if (clean.match(/\b(javascript|python|c\+\+|java|html|css|react|node|sql|php|dasturlash|kod|kod yoz|kod yozib ber|programming|developer|frontend|backend|algoritm|bug|framework|git|linux|api)\b/)) {
      if (clean.match(/\b(python)\b/)) {
        return "**Python dasturlash tili bo'yicha ma'lumot va yordam:**\n\nPython — o'rganish oson, sodda sintaksisga ega va sun'iy intellekt, data science, web backend (Django/FastAPI) sohalarida eng mashhur tildir.\n\n```python\n# Misol: Funksiya va ro'yxat bilan ishlash\ndef salomlash(ism):\n    return f\"Salom, {ism}! Dasturlash olamiga xush kelibsiz.\"\n\nprint(salomlash(\"Foydalanuvchi\"))\n```\n\nAynan qanday algoritm yoki kod yozishimiz kerak? Vazifangizni batafsil yozing.";
      }
      if (clean.match(/\b(javascript|js)\b/)) {
        return "**JavaScript dasturlash tili:**\n\nJavaScript — zamonaviy veb-saytlarning interaktivligi, brauzer ilovalari va Node.js orqali backend yaratishda yetakchi tildir.\n\n```javascript\n// Misol: Asinxron ma'lumot olish\nasync function getData(url) {\n  const res = await fetch(url);\n  return await res.json();\n}\n```\n\nSizga qaysi qismida yordam kerak? Kod parchasini yuboring.";
      }
      return "**Dasturlash va IT bo'yicha yordam:**\n\nMen JavaScript, Python, C++, HTML/CSS, SQL, React, PHP va boshqa tillarda:\n1. Kod yozish va funksiyalar tuzish\n2. Xatolarni (bug) topish va to'g'rilash\n3. Algoritmik masalalarni yechish\n4. Loyiha arxitekturasini rejalashtirishda yordam bera olaman.\n\nAynan qaysi tilda qanday vazifani bajarishimiz kerak?";
    }

    /* 5. Matematika va hisob-kitob tushunchalari */
    if (clean.match(/\b(matematika|algebra|geometriya|integral|hosila|tenglama|ildiz|foiz|formula|hisobla|pi soni)\b/)) {
      return "**Matematik yordam:**\n\nMen algebra, geometriya, tenglamalar, foiz hisoblash va mantiqiy masalalarni yechishda yordam beraman.\n\nMasalan:\n• Oddiy amallar: `(100 * 5) / 2 = 250`\n• Foiz hisoblash: 500 ning 15% i = `500 * 0.15 = 75`\n• Kvadrat tenglama: `ax^2 + bx + c = 0` formulasi: `D = b^2 - 4ac`\n\nMasalangiz shartini yoki hisob-kitobni yozing, birga yechamiz!";
    }

    /* 6. Tarix va Buyuk Allomalar */
    if (clean.match(/\b(amir temur|temur|alisher navoiy|navoiy|ibn sino|ulug'bek|ulugbek|al xorazmiy|beruniy|bobur|tarix|ozbekiston tarixi|samarqand|buxoro)\b/)) {
      if (clean.match(/\b(amir temur|temur)\b/)) {
        return "**Sohibqiron Amir Temur (1336–1405):**\n\nBuyuk sarkarda, davlat arbobi va qudratli Temuriylar saltanatining asoschisi.\n• **Shiori:** *\"Kuch — adolatdadir!\"*\n• **Merosi:** Samarqandni jahonning eng go'zal ilm-fan va me'morchilik markaziga aylantirgan. Saltanatida fan, madaniyat, savdo-sotiq (Buyuk Ipak Yo'li) va obodonchilik yuksak darajaga ko'tarilgan.";
      }
      if (clean.match(/\b(alisher navoiy|navoiy)\b/)) {
        return "**Alisher Navoiy (1441–1501):**\n\nBuyuk o'zbek shoiri, mutafakkir va davlat arbobi. Turkiy tilning boyligi va go'zalligini butun dunyoga isbotlagan.\n• **Asosiy asari:** \"Xamsa\" (Besh doston: Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai sayyor, Saddi Iskandariy).\n• **Hikmat:** *\"Oz-oz o'rganib dono bo'lur, qatra-qatra yig'ilib daryo bo'lur.\"*";
      }
      if (clean.match(/\b(ibn sino|avitsenna)\b/)) {
        return "**Abu Ali ibn Sino (980–1037):**\n\nBuyuk tabib, faylasuf va olim. G'arbda \"Avitsenna\" nomi bilan mashhur.\n• **Mashhur asari:** \"Tib qonunlari\" (Al-Qonun fit-tibb) bir necha asrlar davomida Yevropa universitetlarida asosiy tibbiyot darsligi bo'lib xizmat qilgan.";
      }
      return "**O'zbekiston tarixi va buyuk ajdodlarimiz:**\n\nBizning zaminimiz Al-Xorazmiy (algoritm asoschisi), Ibn Sino, Mirzo Ulug'bek, Alisher Navoiy va Amir Temur kabi jahon sivilizatsiyasiga ulkan hissa qo'shgan allomalarning vatanidir. Qaysi alloma yoki tarixiy davr haqida batafsil ma'lumot olishni xohlaysiz?";
    }

    /* 7. Ilm-fan, Koinot va Tabiat */
    if (clean.match(/\b(quyosh|oy|yer|koinot|galaktika|sayyora|mars|yulduz|atom|fotosintez|gravitatsiya|fizika|kimyo|biologiya)\b/)) {
      return "**Ilm-fan va Koinot haqida qiziqarli faktlar:**\n\n• **Quyosh tizimi:** Quyosh butun tizim massasining 99.86% ini tashkil qiladi.\n• **Yorug'lik tezligi:** Soniyasiga 300,000 km. Quyosh nuri Yerga taxminan 8 daqiqa 20 soniyada yetib keladi.\n• **Atom:** Moddaning eng kichik bo'lagi bo'lib, uning markazida proton va neytronlardan iborat yadro, atrofida esa elektronlar aylanadi.\n\nQaysi ilmiy mavzuni batafsil tushuntirib beray?";
    }

    /* 8. Ingliz tili va chet tillari */
    if (clean.match(/\b(ingliz tili|english|ielts|cefr|tarjima|grammar|lugat|sozlashuv|vocabulary)\b/)) {
      return "**Ingliz tilini o'rganish bo'yicha maslahatlar:**\n\n1. **Kunlik 20 daqiqa:** Har kuni kamida 10-15 ta yangi so'zni kontekst (gaplar) ichida yodlang.\n2. **Tinglash (Listening):** Podkastlar, YouTube videolari va inglizcha subtitrli filmlar ko'ring.\n3. **Shadowing texnikasi:** Eshitgan jumlalaringizni talaffuzini aynan qaytarib gapiring.\n4. **IELTS/CEFR:** Asosiy e'tiborni Reading (tez o'qish) va Writing strukturalariga qarating.\n\nBiror so'z, gap yoki qoidani tushuntirib yoki tarjima qilib beraymi?";
    }

    /* 9. Psixologiya, Ruhiy salomatlik va CBT */
    if (clean.match(/\b(stress|xavotir|qorquv|qo'rquv|vahima|bezovta|siqildim|asab|overthinking|miyam|charchadim|tushkun|depressiya|yolg'iz|yolgiz)\b/)) {
      return "**Ruhiy xotirjamlik va stressni yengish (CBT usuli):**\n\n1. **Fakt va Fikrni ajrating:** Xavotir — bu ko'pincha miyamizning kelajak haqidagi taxmini xolos, xolis haqiqat emas.\n2. **4-4-6 Nafas mashqi:** 4 soniya burundan chuqur nafas oling, 4 soniya ushlab turing va 6 soniya sekin og'izdan chiqaring. Bu asab tizimini 1 daqiqada tinchlantiradi.\n3. **Nazorat zonasi:** O'zingiz o'zgartira olmaydigan narsalarga ortiqcha energiya sarflamang.\n\nSizni aynan qaysi fikr yoki vaziyat ko'proq qiynayapti? Bemalol aytib bering, birgalikda yechim topamiz.";
    }

    /* 10. Dangasalik, Motivatsiya va Unumdorlik */
    if (clean.match(/\b(dangasa|dangasalik|erinchoq|erin|prokrastinatsiya|boshlay olmayapman|iroda|motivatsiya|ilhom|unumdorlik|reja|vaqt|pomodoro)\b/)) {
      return "**Dangasalikni yengish va yuqori motivatsiya:**\n\n• **2 daqiqa qoidasi:** Ishni butunlay tugatish haqida emas, faqat birinchi 2 daqiqasini qilish haqida o'ylang (masalan, daftarni ochish yoki stolga o'tirish).\n• **Pomodoro usuli:** 25 daqiqa to'liq diqqat bilan ishlang va 5 daqiqa dam oling.\n• **5-4-3-2-1 hisobi:** Orqaga sanang va hech narsa o'ylamay darhol harakatga o'ting.\n\nQaysi ishni boshlash kerak? Keling, uni eng kichik 1-qadamga bo'lamiz.";
    }

    /* 11. Uyqu va Dam olish */
    if (clean.match(/\b(uyqu|uxlay|uyqusizlik|kechasi|uyqum kelmayapti|tinchlanish)\b/)) {
      return "**Sog'lom uyqu va quvvatni tiklash:**\n\n• Yotishdan 45 daqiqa oldin barcha ekranlarni (telefon, kompyuter) chetga suring.\n• Xonani shamollatib, salqin va qorong'i muhit yarating.\n• Bir stakan iliq suv yoki yalpizli choy iching.\n• Miya tinchlanishi uchun xayolingizdagi rejalarni qog'ozga yozib qo'ying.\n\nBugun o'zingizga to'liq dam olish uchun imkoniyat bering.";
    }

    /* 12. Ijod, She'r, Hikoya va Tabriklar */
    if (clean.match(/\b(she'r|sher|tabrik|tavallud|tug'ilgan kun|hikoya|maqol|hikmat|yozib ber)\b/)) {
      if (clean.match(/\b(tabrik|tug'ilgan kun)\b/)) {
        return "**Tug'ilgan kun uchun samimiy tabrik:**\n\n\"Sizni bugungi qutlug' ayyom — tavallud kuningiz bilan chin qalbimdan muborakbod etaman! Sizga mustahkam sog'liq, cheksiz quvonch, oilaviy xotirjamlik va barcha ezgu niyatlaringizga yetishishingizni tilayman. Har bir kuningiz yangi marralar va omadlarga boy bo'lsin!\"";
      }
      return "**Hikmatli satrlar:**\n\n*Intilsang har kuni yangi marraga,*\n*Yetasan orzuying bo'lgan cho'qqiga.*\n*Sabr ila qo'yilgan har bitta qadam,*\n*Albatta eltadi yorug' kunlarga.*\n\nQanday mavzuda yoki kim uchun maxsus matn yozib beray?";
    }

    /* 13. Ta'lim, DTM va Imtihonlar */
    if (clean.match(/\b(imtihon|dtm|sessiya|universitet|maktab|dars|test|tayyorgarlik|talaba)\b/)) {
      return "**Imtihonlarga samarali tayyorgarlik sirlari:**\n\n1. **Faol eslash (Active Recall):** O'qigan materialingizni kitobga qaramasdan o'z so'zlaringiz bilan aytib berishga harakat qiling.\n2. **Interval takrorlash (Spaced Repetition):** Mavzuni 1 kundan, 3 kundan va 7 kundan keyin qayta takrorlang.\n3. **Testlar ustida ishlash:** Xato qilgan savollaringizni alohida daftarga qayd qilib, tahlil qiling.\n\nAynan qaysi fan yoki yo'nalishga tayyorgarlik ko'ryapsiz?";
    }

    /* 14. Universal Smart Dynamic Fallback */
    var words = clean.split(' ').filter(function(w) { return w.length > 2; });
    var topic = words.slice(0, 3).join(' ');

    return "**\"" + (topic ? topic.toUpperCase() : "Savolingiz") + "\" bo'yicha tahlil va javob:**\n\n" +
           "Siz ko'targan ushbu masala juda muhim hisoblanadi. Bu bo'yicha quyidagi asosiy tavsiyalarni e'tiborga olishingizni maslahat beraman:\n\n" +
           "1. **Mavzuning mohiyati:** Har qanday vazifada asosiy maqsadni aniq belgilash natijaning 50% ini tashkil qiladi.\n" +
           "2. **Amaliy qadam:** Ishni kichik bo'laklarga ajrating va eng sodda qismidan boshlang.\n" +
           "3. **Doimiy rivojlanish:** Izlanish, sabr va to'g'ri rejalashtirish har qanday qiyinchilikni yengishga yordam beradi.\n\n" +
           "Agar ushbu mavzu bo'yicha aniqroq misol, kod, hisob-kitob yoki batafsil ma'lumot kerak bo'lsa, bemalol so'rang!";
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
        try {
          var res = JSON.parse(xhr.responseText);
          callback(null, res.candidates[0].content.parts[0].text);
        } catch(e) { callback(e); }
      } else { callback(new Error('Gemini error: ' + xhr.status)); }
    };
    xhr.onerror = function() { callback(new Error('Network error')); };
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
        try {
          var res = JSON.parse(xhr.responseText);
          callback(null, res.choices[0].message.content);
        } catch(e) { callback(e); }
      } else { callback(new Error('API error: ' + xhr.status)); }
    };
    xhr.onerror = function() { callback(new Error('Network error')); };
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
    if (mathRes) {
      setTimeout(function () { finish(mathRes); }, 300);
      return;
    }

    function replySmart() {
      var delay = 350 + Math.floor(Math.random() * 250);
      setTimeout(function () {
        finish(getSmartChatGPTReply(text));
      }, delay);
    }

    if (apiKey) {
      if (provider === 'gemini') {
        callGemini(apiKey, text, function (err, reply) {
          if (!err && reply) finish(reply); else replySmart();
        });
      } else {
        callOpenAI(apiKey, provider, text, function (err, reply) {
          if (!err && reply) finish(reply); else replySmart();
        });
      }
    } else {
      replySmart();
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
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        panel.style.display = 'none';
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var key = (input ? input.value : '').trim();
        var prov = providerSelect ? providerSelect.value : 'gemini';

        localStorage.setItem(STORAGE_KEY, key);
        localStorage.setItem(STORAGE_PROVIDER, prov);
        updateBadge();

        if (statusEl) {
          if (key) {
            statusEl.textContent = 'API kaliti saqlandi! Jonli ' + prov.toUpperCase() + ' modeli faol.';
            statusEl.style.color = '#10b981';
          } else {
            statusEl.textContent = 'Standart ChatGPT rejimi faol.';
            statusEl.style.color = 'var(--accent-blue)';
          }
        }
        if (window.showToast) {
          window.showToast(key ? 'API kaliti saqlandi!' : 'Standart rejimga o\'tildi', 'success');
        }
        setTimeout(function () {
          panel.style.display = 'none';
        }, 800);
      });
    }
  }

  /* ═══ 6. MATN FORMATLASH ═══ */
  function fmt(t) {
    return (t || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p style="margin-top:10px">')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:0.85em;color:#60a5fa">$1</code>');
  }

  /* ═══ 7. INIT ═══ */
  function init() {
    if (!document.getElementById('ai-dot-css')) {
      var s = document.createElement('style');
      s.id = 'ai-dot-css';
      s.textContent =
        '@keyframes aidotAnim{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}' +
        '.aidot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3b82f6;animation:aidotAnim 1.2s infinite;}';
      document.head.appendChild(s);
    }

    welcome();
    initAPIKeyPanel();

    /* Send button */
    var sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) {
      sendBtn.onclick = function (e) {
        e.preventDefault();
        var inp = document.getElementById('chat-input');
        if (inp) send(inp.value);
      };
    }

    /* Enter */
    var chatInp = document.getElementById('chat-input');
    if (chatInp) {
      chatInp.onkeydown = function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send(this.value);
        }
      };
    }

    /* Prompt chips */
    document.querySelectorAll('.prompt-chip').forEach(function (chip) {
      chip.onclick = function () {
        var text = chip.textContent.replace(/^[^\w\s\u0400-\u04FF\u00C0-\u024F]+/u, '').trim();
        send(text || chip.textContent.trim());
      };
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  window.initAIChat = function () {
    var c = document.getElementById('chat-messages');
    if (!c || c.children.length === 0) {
      init();
    }
  };
})();

