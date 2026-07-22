/* =========================================================
   FOR FUTURE 30 — 一覧（30 STORIES）を5章立てで描画
   window.FF_COMPANIES から実在社を order 順に配置し、25枠を
   CHAPTER 01〜05（各5枠）にグループ化。未定枠は COMING SOON。
   reveal.js より前に読み込むこと。
   ========================================================= */
(function () {
  "use strict";

  var root = document.querySelector("[data-stories]");
  if (!root) return;

  var TOTAL = 30;
  var PER_CHAPTER = 5;
  var data = window.FF_COMPANIES || [];

  // order をキーに 25 枠へ配置
  var byOrder = {};
  data.forEach(function (c) { byOrder[c.order] = c; });

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  function nameLines(roman) {
    var i = roman.indexOf(" ");
    if (i < 0) return esc(roman);
    return esc(roman.slice(0, i)) + "<br>" + esc(roman.slice(i + 1));
  }

  function realCard(c) {
    return (
      '<a href="company.html?id=' + esc(c.id) + '" class="article-wrap__body__card">' +
        '<div class="article-wrap__body__card__img">' +
          '<img src="' + esc(c.card) + '" alt="' + esc(c.company) + '" class="card-img-front" loading="lazy" decoding="async">' +
          '<div class="card-img-backs">' +
            '<img src="' + esc(c.logo) + '" alt="" class="card-img-back" loading="lazy" decoding="async">' +
          "</div>" +
        "</div>" +
        '<div class="article-wrap__body__card__under">' +
          '<p class="article-wrap__body__card__kinds">' + esc(c.category || "") + "</p>" +
          '<div class="article-wrap__body__card__name">' + nameLines(c.nameRoman) + "</div>" +
          '<div class="article-wrap__body__card__job">' + esc(c.company) + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function comingCard(no) {
    return (
      '<div class="article-wrap__body__card is-coming" aria-hidden="true">' +
        '<div class="article-wrap__body__card__img">' +
          '<span class="card-coming">COMING SOON</span>' +
        "</div>" +
        '<div class="article-wrap__body__card__under">' +
          '<p class="article-wrap__body__card__kinds">—</p>' +
          '<div class="article-wrap__body__card__name">NO.' + pad(no) + "</div>" +
          '<div class="article-wrap__body__card__job">準備中</div>' +
        "</div>" +
      "</div>"
    );
  }

  var html = "";
  for (var ch = 0; ch < TOTAL / PER_CHAPTER; ch++) {
    var from = ch * PER_CHAPTER + 1;
    var to = from + PER_CHAPTER - 1;
    var cards = "";
    for (var n = from; n <= to; n++) {
      cards += byOrder[n] ? realCard(byOrder[n]) : comingCard(n);
    }
    html +=
      '<div class="chapter">' +
        '<div class="chapter__head">' +
          '<span class="chapter__no">CHAPTER ' + pad(ch + 1) + "</span>" +
        "</div>" +
        '<div class="article-wrap__body">' + cards + "</div>" +
      "</div>";
  }

  root.innerHTML = html;

  /* ---------------------------------------------------------
     HERO のロゴマーキー（2段）を FF_COMPANIES から生成
     上段＝前半 / 下段＝後半。各段はシームレスループ用に2倍展開。
     --------------------------------------------------------- */
  (function buildLogoMarquee() {
    // 行はどこに置いてもよいようグローバルに探す（ヒーローを上下スライダーで挟む構成に対応）
    var row1 = document.querySelector('[data-marquee-row="1"]');
    var row2 = document.querySelector('[data-marquee-row="2"]');
    if (!row1 && !row2) return;

    var logos = data
      .slice()
      .sort(function (a, b) { return a.order - b.order; })
      .filter(function (c) { return c.logo; });
    if (!logos.length) return;

    var half = Math.ceil(logos.length / 2);
    var top = logos.slice(0, half);
    var bottom = logos.slice(half);

    // クリックで該当記事へ遷移。clone=trueは無限ループ用の複製（重複タブ移動を防ぐ）
    function links(list, clone) {
      return list
        .map(function (c) {
          var extra = clone
            ? ' aria-hidden="true" tabindex="-1"'
            : ' aria-label="' + esc(c.company) + 'の記事へ"';
          var alt = clone ? "" : esc(c.company);
          return (
            '<a class="cover__marquee-item" href="company.html?id=' + esc(c.id) + '"' + extra + ">" +
              '<img src="' + esc(c.logo) + '" alt="' + alt + '" />' +
            "</a>"
          );
        })
        .join("");
    }
    // 2セット並べて無限ループ（後半は装飾クローン）
    if (row1) row1.innerHTML = links(top, false) + links(top, true);
    if (row2) row2.innerHTML = links(bottom, false) + links(bottom, true);
  })();
})();
