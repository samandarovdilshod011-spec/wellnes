/* YMW Video Curator — Kengaytirilgan Tasdiqlangan YouTube Videolari */

var VC_MOOD = 'exhausted';
var VC_PAGE_SIZE = 6;
var VC_VISIBLE_COUNTS = {
  mvc: 6,
  v2: 6
};

var VC_DATA = {
  exhausted: [
    { id: '5MuIMqhT8DM', title: "Matt Walker: Uyqu — sizning superkuchingiz (Ilmiy tadqiqot)", channel: "TED", dur: '19:10', v: '18.2M' },
    { id: 'qzR62JJCMBQ', title: "Andy Puddicombe: Kuniga atigi 10 daqiqalik mindfulness", channel: "TED", dur: '09:24', v: '14.8M' },
    { id: 'w6ii6Prvxac', title: "Ong osti qudrati — Chuqur tinchlantiruvchi meditatsiya", channel: "Nargiz Sattarova", dur: '08:02', v: '102K' },
    { id: 'T-nO2IU7xV4', title: "Jo Dispenzaning eng yaxshi meditatsiyasi", channel: "ZIYO TV", dur: '12:25', v: '456K' },
    { id: 'inpok4MKVLM', title: "5 Daqiqalik chuqur xotirjamlik va dam olish amaliyoti", channel: "Goodful", dur: '05:15', v: '198K' },
    { id: 'DWcJFNfaw9c', title: "Lofi xotirjam musiqalar — Dam olish va uxlash uchun", channel: "Lofi Girl", dur: 'Jonli', v: '920K' },
    { id: '6p_yaNFSYao', title: "Mindfulness Meditation — 10 daqiqalik yo'naltirilgan dam olish", channel: "The Honest Guys", dur: '10:00', v: '312K' },
    { id: '8KkKuTCFvzI', title: "Robert Waldinger: Baxtli va sog'lom hayot siri nimada?", channel: "TED", dur: '12:45', v: '46.5M' }
  ],
  anxious: [
    { id: 'RcGyVTAoXEU', title: "Kelly McGonigal: Stressni qanday qilib do'stga aylantirish mumkin?", channel: "TED", dur: '14:28', v: '31.2M' },
    { id: 'cTnPqgL8ZPs', title: "David H. Rosmarin: Xavotirni dushmandan do'stga aylantirish", channel: "TED", dur: '13:05', v: '1.8M' },
    { id: 'wnM-6D2LGdg', title: "Jenny Taitz: Stressni bir zumda to'xtatuvchi usullar", channel: "TED", dur: '10:15', v: '920K' },
    { id: 'arj7oStGLkU', title: "Tim Urban: Prokrastinatsiya va kechiktirish psixologiyasi", channel: "TED", dur: '14:03', v: '68.0M' },
    { id: '8z7Oqu_PoaU', title: "Har kuni 1 daqiqa hayotingizni o'zgartiradi — Dilshod Mannopov", channel: "The Global Trainings", dur: '09:31', v: '420K' },
    { id: 'qzR62JJCMBQ', title: "Andy Puddicombe: Ongni tinchlantirish va xavotirdan chiqish", channel: "TED", dur: '09:24', v: '14.8M' },
    { id: 'iCvmsMzlF7o', title: "Brené Brown: Zaiflikning kuchi va xavotirni yengish", channel: "TED", dur: '20:19', v: '60.5M' }
  ],
  down: [
    { id: '_X0mgOOSpLU', title: "Carol Dweck: O'zingizga ishonch va o'suvchi tafakkur kuchi", channel: "TED", dur: '10:20', v: '14.2M' },
    { id: 'vpW2sGlCtaE', title: "Denzel Washington: Fall Forward — Yiqilishdan qo'rqmang", channel: "University of Pennsylvania", dur: '10:30', v: '8.1M' },
    { id: 'V80-gPkpH6M', title: "Jim Carrey: Qo'rquvni yengish va orzularingiz sari dadil qadam", channel: "Maharishi University", dur: '11:15', v: '15.4M' },
    { id: 'Ks-_Mh1QhMc', title: "Amy Cuddy: Tana tili sizning o'zingizga ishonchingizni oshiradi", channel: "TED", dur: '21:02', v: '68.5M' },
    { id: '78nsxRxbf4w', title: "Jacqueline Way: Har kuni qanday baxtli bo'lish mumkin?", channel: "TEDx Talks", dur: '15:20', v: '7.8M' },
    { id: 'iCvmsMzlF7o', title: "Brené Brown: O'z qadringizni anglash va ichki kuch", channel: "TED", dur: '20:19', v: '60.5M' },
    { id: '8KkKuTCFvzI', title: "Robert Waldinger: Insoniy munosabatlar va ichki xotirjamlik", channel: "TED", dur: '12:45', v: '46.5M' }
  ],
  motivated: [
    { id: 'UF8uR6Z6KLc', title: "Steve Jobs: Stay Hungry, Stay Foolish — Stanford nutqi", channel: "Stanford", dur: '15:04', v: '42.0M' },
    { id: 'Lp7E973zozc', title: "Mel Robbins: 5 soniya qoidasi — Dangasalikni yengish", channel: "TEDx Talks", dur: '21:40', v: '31.5M' },
    { id: 'qp0HIF3SfI4', title: "Simon Sinek: Buyuk yetakchilar odamlarni qanday ilhomlantiradi?", channel: "TED", dur: '17:48', v: '63.2M' },
    { id: 'H14bBuluwB8', title: "Angela Duckworth: Grit — Iroda va qat'iyat kuchi", channel: "TED", dur: '06:12', v: '32.1M' },
    { id: 'g-jwWYX7Jlo', title: "Dream — Orzular sari tinimsiz harakat (Motivatsiya)", channel: "Mateusz M", dur: '05:40', v: '84.0M' },
    { id: 'vpW2sGlCtaE', title: "Denzel Washington: Katta maqsadlar va tinimsiz mehnat", channel: "University of Pennsylvania", dur: '10:30', v: '8.1M' },
    { id: 'V80-gPkpH6M', title: "Jim Carrey: Muvaffaqiyat va orzular sari ilhomlantiruvchi nutq", channel: "Maharishi University", dur: '11:15', v: '15.4M' },
    { id: 'Ks-_Mh1QhMc', title: "Amy Cuddy: Kuchli va dadil bo'lish sirlari", channel: "TED", dur: '21:02', v: '68.5M' }
  ],
  balanced: [
    { id: '4aYVLpY5FYU', title: "Ali Abdaal: Vaqtni boshqarish va unumdorlikning eng zo'r qoidalari", channel: "Ali Abdaal", dur: '16:20', v: '2.1M' },
    { id: 'tQSKyvjsUuI', title: "Ali Abdaal: Mukammal kun tartibi va hayotiy balans", channel: "Ali Abdaal", dur: '14:15', v: '1.9M' },
    { id: 'arj7oStGLkU', title: "Tim Urban: Ishlarni orqaga surishni to'xtatish", channel: "TED", dur: '14:03', v: '68.0M' },
    { id: 'eIho2S0ZahI', title: "Julian Treasure: Boshqalar sizni tinglashi uchun qanday gapirish kerak?", channel: "TED", dur: '09:58', v: '54.0M' },
    { id: '5MuIMqhT8DM', title: "Matt Walker: Sog'lom aqliy faoliyat uchun to'g'ri uyqu", channel: "TED", dur: '19:10', v: '18.2M' },
    { id: 'iG9CE55wbtY', title: "Sir Ken Robinson: Ijodkorlik va shaxsiy salohiyatni rivojlantirish", channel: "TED", dur: '19:24', v: '75.0M' },
    { id: '_X0mgOOSpLU', title: "Carol Dweck: Doimiy o'sish va ijobiy odatlar", channel: "TED", dur: '10:20', v: '14.2M' },
    { id: 'Lp7E973zozc', title: "Mel Robbins: Kunlik odatlarni o'zgartirish va 5 soniya usuli", channel: "TEDx Talks", dur: '21:40', v: '31.5M' }
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


