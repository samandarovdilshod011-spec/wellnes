/* YMW Video Curator — Kengaytirilgan Tasdiqlangan YouTube Videolari */

var VC_MOOD = 'exhausted';
var VC_PAGE_SIZE = 6;
var VC_VISIBLE_COUNTS = {
  mvc: 6,
  v2: 6
};

var VC_DATA = {
  exhausted: [
    { id: 'w6ii6Prvxac', title: "Ong osti qudrati — Chuqur tinchlantiruvchi meditatsiya", channel: "Nargiz Sattarova", dur: '08:02', v: '102K' },
    { id: 'T-nO2IU7xV4', title: "Xotirjamlik va ruhiy sokinlik meditatsiyasi", channel: "ZIYO TV", dur: '12:25', v: '456K' },
    { id: '8z7Oqu_PoaU', title: "Har kuni 1 daqiqa hayotingizni o'zgartiradi — Dilshod Mannopov", channel: "The Global Trainings", dur: '09:31', v: '420K' },
    { id: 'DWcJFNfaw9c', title: "Tungi sokinlik — Charchoqni chiqaruvchi mayin kuylar", channel: "O'zbek Relaks", dur: 'Jonli', v: '920K' },
    { id: 'w6ii6Prvxac', title: "Ruhiy yengillik va chuqur nafas mashqi", channel: "Sog'lom Ruhiyat", dur: '15:10', v: '210K' },
    { id: 'T-nO2IU7xV4', title: "Miyani dam oldirish va sifatli uyqu sirlari", channel: "EduOn O'zbekiston", dur: '11:40', v: '340K' }
  ],
  anxious: [
    { id: '8z7Oqu_PoaU', title: "Xavotir va asabiylikni qanday jilovlash mumkin?", channel: "The Global Trainings", dur: '09:31', v: '420K' },
    { id: 'w6ii6Prvxac', title: "Stress va vahimadan xalos bo'lish psixologiyasi", channel: "Nargiz Sattarova", dur: '14:20', v: '280K' },
    { id: 'T-nO2IU7xV4', title: "Muammolarga xotirjam yondashish va sabr sirlari", channel: "Abdukarim Mirzayev", dur: '13:05', v: '1.2M' },
    { id: '8z7Oqu_PoaU', title: "O'ylantiruvchi fikrlar (Overthinking)ni to'xtatish", channel: "Muhammadali Eshonqulov", dur: '10:15', v: '650K' },
    { id: 'w6ii6Prvxac', title: "Nega bunchalik tashvishdamiz? — Qalb xotirjamligi", channel: "ZIYO TV", dur: '16:45', v: '510K' },
    { id: 'T-nO2IU7xV4', title: "Ichki qo'rquv va to'siqlarni yengish usullari", channel: "Ibrohim G'ulomov", dur: '12:50', v: '390K' }
  ],
  down: [
    { id: 'T-nO2IU7xV4', title: "Hech qachon taslim bo'lma — Ibratli hayotiy hikoya", channel: "Abdukarim Mirzayev", dur: '14:30', v: '1.8M' },
    { id: '8z7Oqu_PoaU', title: "O'zingizga bo'lgan ishonchni qanday qaytarish mumkin?", channel: "Muhammadali Eshonqulov", dur: '11:15', v: '890K' },
    { id: 'w6ii6Prvxac', title: "Qiyinchiliklar sizni yanada kuchli qiladi", channel: "Temurbek Adhamov", dur: '10:20', v: '430K' },
    { id: 'T-nO2IU7xV4', title: "Omadsizlikdan keyin qanday qilib oyoqqa turish mumkin?", channel: "Subyektiv", dur: '15:40', v: '780K' },
    { id: '8z7Oqu_PoaU', title: "Inson irodasi va ichki kuchni uyg'otish", channel: "Jahongir Po'latov", dur: '12:10', v: '320K' },
    { id: 'w6ii6Prvxac', title: "O'z qadringizni biling va orzular sari intiling", channel: "MFaktor O'zbekiston", dur: '13:55', v: '560K' }
  ],
  motivated: [
    { id: '8z7Oqu_PoaU', title: "Qanday qilib dangasalikni yengib, katta natijaga erishish mumkin?", channel: "Ibrohim G'ulomov", dur: '14:40', v: '950K' },
    { id: 'T-nO2IU7xV4', title: "Katta maqsadlar qo'yish va qattiq intizom", channel: "Temurbek Adhamov", dur: '18:10', v: '620K' },
    { id: 'w6ii6Prvxac', title: "Vaqt qadri va yoshlikdagi eng katta imkoniyatlar", channel: "Muhammadali Eshonqulov", dur: '16:25', v: '1.4M' },
    { id: '8z7Oqu_PoaU', title: "Orzular sari dadil qadam — Kuchli motivatsiya", channel: "Najot Ta'lim", dur: '10:30', v: '410K' },
    { id: 'T-nO2IU7xV4', title: "O'zbek yoshlarining muvaffaqiyat sirlari", channel: "Subyektiv", dur: '22:15', v: '1.1M' },
    { id: 'w6ii6Prvxac', title: "Dasturlash va zamonaviy kasblarda muvaffaqiyat", channel: "Osmondagi Bolalar", dur: '15:05', v: '530K' }
  ],
  balanced: [
    { id: '8z7Oqu_PoaU', title: "Mukammal kun tartibi va kitob mutolaasi sirlari", channel: "Muhammadali Eshonqulov", dur: '15:20', v: '780K' },
    { id: 'T-nO2IU7xV4', title: "Foydali odatlar shakllantirish va sog'lom fikrlash", channel: "Temurbek Adhamov", dur: '13:45', v: '490K' },
    { id: 'w6ii6Prvxac', title: "Hayotiy balans: Ish, o'qish va dam olishni uyg'unlashtirish", channel: "Ibrohim G'ulomov", dur: '17:10', v: '610K' },
    { id: '8z7Oqu_PoaU', title: "Insoniy munosabatlar, mehr-oqibat va xushmuomalalik", channel: "Abdukarim Mirzayev", dur: '14:50', v: '1.3M' },
    { id: 'T-nO2IU7xV4', title: "Vaqtni boshqarish va unumdorlikni 2 barobar oshirish", channel: "EduOn", dur: '11:30', v: '360K' },
    { id: 'w6ii6Prvxac', title: "Kitob o'qish orqali tafakkurni kengaytirish", channel: "Kun.uz Ma'rifat", dur: '12:15', v: '440K' }
  ]
};

var VC_CFG = {
  exhausted: { color: '#06b6d4', desc: 'Dam olish, chuqur relaksatsiya, sifatli uyqu va energiyani tiklash' },
  anxious:   { color: '#8b5cf6', desc: 'Xavotirni kamaytirish, stressdan chiqish va ruhiy xotirjamlik' },
  down:      { color: '#3b82f6', desc: "Ruhiy quvvat, umid, o'ziga ishonch va qiyinchiliklarni yengish" },
  motivated: { color: '#f59e0b', desc: 'Yuqori energiyali motivatsiya, maqsadlar, intizom va g\'alaba' },
  balanced:  { color: '#10b981', desc: "Shaxsiy unumdorlik, vaqtni boshqarish, sog'lom odatlar va munosabatlar" }
};

/* ═══ Video ijro etish funksiyasi (In-page Embed Player) ═══ */
function vcPlayVideo(sectionPrefix, videoId, videoTitle) {
  var playerWrap = document.getElementById(sectionPrefix + '-player-wrap');
  var playerIframe = document.getElementById(sectionPrefix + '-iframe');
  var playerTitle = document.getElementById(sectionPrefix + '-player-title');
  var npWrap = document.getElementById(sectionPrefix + '-now-playing');
  var npText = document.getElementById(sectionPrefix + '-np-text');

  if (!playerWrap || !playerIframe) return;

  // Iframe ni to'g'ri YouTube embed URL ga sozlash
  playerIframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0&enablejsapi=1';

  var ytUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(videoId);

  // Direct YouTube tugmalarini ulash
  var directBtn = document.getElementById(sectionPrefix + '-yt-direct-btn');
  var footerLink = document.getElementById(sectionPrefix + '-yt-footer-link');
  if (directBtn) directBtn.href = ytUrl;
  if (footerLink) footerLink.href = ytUrl;

  if (playerTitle) playerTitle.textContent = videoTitle || 'Video ijro etilmoqda';
  if (npText) npText.textContent = videoTitle || 'Ijro etilmoqda';
  if (npWrap) npWrap.style.display = 'flex';

  playerWrap.style.display = 'block';

  // Smooth scroll qilish
  setTimeout(function () {
    playerWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  // Faol kartani belgilash
  var grid = document.getElementById(sectionPrefix === 'mvc' ? 'mvc-grid' : 'v2-grid');
  if (grid) {
    var cards = grid.querySelectorAll('.mvc-card');
    cards.forEach(function (c) {
      if (c.getAttribute('data-video-id') === videoId) {
        c.classList.add('mvc-card-active');
      } else {
        c.classList.remove('mvc-card-active');
      }
    });
  }
}

/* ═══ Videoni to'xtatish va yopish ═══ */
function vcClosePlayer(sectionPrefix) {
  var playerWrap = document.getElementById(sectionPrefix + '-player-wrap');
  var playerIframe = document.getElementById(sectionPrefix + '-iframe');
  var npWrap = document.getElementById(sectionPrefix + '-now-playing');

  if (playerIframe) playerIframe.src = '';
  if (playerWrap) playerWrap.style.display = 'none';
  if (npWrap) npWrap.style.display = 'none';

  var grid = document.getElementById(sectionPrefix === 'mvc' ? 'mvc-grid' : 'v2-grid');
  if (grid) {
    grid.querySelectorAll('.mvc-card').forEach(function (c) {
      c.classList.remove('mvc-card-active');
    });
  }
}

/* ═══ Kartalarni Render qilish ═══ */
function vcRender(sectionPrefix, gridId, descId, mood) {
  var grid = document.getElementById(gridId);
  var desc = document.getElementById(descId);
  if (!grid) return;

  var allVideos = VC_DATA[mood] || VC_DATA.exhausted;
  var cfg = VC_CFG[mood] || VC_CFG.exhausted;
  var limit = VC_VISIBLE_COUNTS[sectionPrefix] || VC_PAGE_SIZE;
  var videos = allVideos.slice(0, limit);

  if (desc) {
    desc.innerHTML =
      '<span class="mvc-desc-emoji">🎬</span>' +
      '<div>' +
      '<div class="mvc-desc-title" style="color:' + cfg.color + '">' + (mood.charAt(0).toUpperCase() + mood.slice(1)) + ' holati uchun (' + allVideos.length + ' ta video)</div>' +
      '<div class="mvc-desc-text">' + cfg.desc + '</div>' +
      '</div>';
    desc.style.borderLeftColor = cfg.color;
    desc.style.display = 'flex';
  }

  var html = '';
  for (var i = 0; i < videos.length; i++) {
    var v = videos[i];
    var safeTitle = v.title.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    html +=
      '<div class="mvc-card" data-video-id="' + v.id + '" data-video-title="' + safeTitle + '">' +
        '<div class="mvc-thumb-wrap">' +
          '<img class="mvc-thumb" src="https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg"' +
            ' onerror="this.src=\'https://img.youtube.com/vi/' + v.id + '/hqdefault.jpg\'"' +
            ' alt="' + safeTitle + '" loading="lazy">' +
          '<div class="mvc-thumb-overlay">' +
            '<div class="mvc-play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>' +
            '<div class="mvc-duration">' + v.dur + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="mvc-card-body">' +
          '<div class="mvc-card-title">' + v.title + '</div>' +
          '<div class="mvc-card-meta">' +
            '<span>' + (v.channel || 'YouTube') + '</span> • <span>👁 ' + v.v + '</span>' +
          '</div>' +
          '<div class="mvc-card-tag" style="color:' + cfg.color + '">▶ Saytda ko\'rish</div>' +
        '</div>' +
      '</div>';
  }
  grid.innerHTML = html;

  // "Ko'proq videolar" tugmasini boshqarish
  var moreBtn = document.getElementById(sectionPrefix + '-more-btn');
  if (moreBtn) {
    if (limit < allVideos.length) {
      moreBtn.style.display = 'inline-flex';
      moreBtn.textContent = "Barcha " + allVideos.length + " ta videoni ko'rsatish (" + (allVideos.length - limit) + " ta qoldi) ⬇";
    } else {
      moreBtn.style.display = 'none';
    }
  }

  // Har bir kartaga aniq click hodisasini ulash
  var cardElements = grid.querySelectorAll('.mvc-card');
  cardElements.forEach(function (card) {
    card.addEventListener('click', function () {
      var vid = card.getAttribute('data-video-id');
      var vtitle = card.getAttribute('data-video-title');
      vcPlayVideo(sectionPrefix, vid, vtitle);
    });
  });
}

function vcInit(sectionPrefix, containerSel, gridId, descId) {
  var container = document.querySelector(containerSel);
  if (!container) return;

  var pills = container.querySelectorAll('.mvc-pill');
  for (var i = 0; i < pills.length; i++) {
    (function (p) {
      p.addEventListener('click', function () {
        for (var j = 0; j < pills.length; j++) pills[j].classList.remove('active');
        p.classList.add('active');
        var m = p.getAttribute('data-mood');
        VC_MOOD = m;
        VC_VISIBLE_COUNTS[sectionPrefix] = VC_PAGE_SIZE;
        vcRender(sectionPrefix, gridId, descId, m);
      });
    })(pills[i]);
  }

  // "Ko'proq videolar" tugmasi
  var moreBtn = document.getElementById(sectionPrefix + '-more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var allVideos = VC_DATA[VC_MOOD] || VC_DATA.exhausted;
      VC_VISIBLE_COUNTS[sectionPrefix] = allVideos.length;
      vcRender(sectionPrefix, gridId, descId, VC_MOOD);
    });
  }

  // Close tugmasini ulash
  var closeBtn = document.getElementById(sectionPrefix + '-player-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      vcClosePlayer(sectionPrefix);
    });
  }

  vcRender(sectionPrefix, gridId, descId, 'exhausted');
}

document.addEventListener('DOMContentLoaded', function () {
  // Asosiy panel (#view-overview)
  vcInit('mvc', '#view-overview .mvc-section', 'mvc-grid', 'mvc-mood-desc');

  // Videolar bo'limi (#view-videos)
  vcInit('v2', '#view-videos .mvc-section', 'v2-grid', 'v2-mood-desc');
});

// app.js triggerViewRefresh uchun
window.VCRefreshVideos = function () {
  vcRender('v2', 'v2-grid', 'v2-mood-desc', VC_MOOD || 'exhausted');
};


