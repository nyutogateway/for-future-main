/* =========================================================
   FOR FUTURE 30 — 企業詳細の描画（データ駆動テンプレ）
   company.html?id=<id> を読み、window.FF_COMPANIES から該当社を
   誌面フォーマット（interview.css）で描画する。
   reveal.js より前に読み込むこと（.mag-section を先に生成するため）。
   ========================================================= */
(function () {
  "use strict";

  var TOTAL = 30; // 「01 ／ 25」の分母
  var data = window.FF_COMPANIES || [];
  var root = document.querySelector("[data-company]");
  if (!root) return;

  var id = new URLSearchParams(window.location.search).get("id");
  var c = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { c = data[i]; break; }
  }

  if (!c) {
    root.innerHTML =
      '<section class="mag-notfound">' +
      "<p>お探しの記事が見つかりませんでした。</p>" +
      '<a class="mag-back" href="index.html#article">← BACK TO 30 STORIES</a>' +
      "</section>";
    document.title = "記事が見つかりません ｜ FOR FUTURE 30";
    return;
  }

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---- <head> のタイトル / メタ / OGP ---- */
  document.title = c.nameJa + " ｜ " + c.company + " ｜ FOR FUTURE 30";
  var desc =
    c.metaDesc ||
    c.tagline + "──" + c.company + "、" + c.nameJa + "の挑戦を綴る特集。FOR FUTURE 30";
  setMeta("name", "description", desc);
  setMeta("property", "og:title", document.title);
  setMeta("property", "og:description", c.tagline + "。九州から選ばれた30の物語。");
  setMeta("property", "og:image", c.ogImage || c.hero);
  setMeta("property", "og:type", "article");

  function setMeta(attr, key, val) {
    var el = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", val);
  }

  /* ---- 表紙 ---- */
  var cover =
    '<section class="mag-cover" id="top">' +
      '<div class="mag-cover__text">' +
        '<p class="mag-cover__kicker"><img class="mag-cover__logo" src="img/logononum.svg" alt="FOR FUTURE 30" /></p>' +
        '<p class="mag-cover__tagline">' + esc(c.tagline) + "</p>" +
        '<h1 class="mag-cover__name">' + esc(c.nameRoman) +
          "<span>" + esc(c.nameJa) + "</span></h1>" +
        '<p class="mag-cover__meta"><strong>' + esc(c.company) + "</strong><br />" +
          esc(c.title) + "</p>" +
        (c.profile && c.profile.bio
          ? '<p class="mag-cover__bio">' + esc(c.profile.bio) + "</p>"
          : "") +
        (c.url
          ? '<a class="mag-cover__link" href="' + esc(c.url) +
            '" target="_blank" rel="noopener">' + esc(c.url) + "</a>"
          : "") +
      "</div>" +
      '<div class="mag-cover__photo">' +
        '<img src="' + esc(c.hero) + '" alt="' +
          esc(c.nameJa + " ｜ " + c.company + " " + c.title) + '" />' +
      "</div>" +
    "</section>";

  /* ---- 記事本文 ---- */
  var sections = "";
  for (var s = 0; s < c.sections.length; s++) {
    var sec = c.sections[s];
    var paras = "";
    for (var p = 0; p < sec.body.length; p++) {
      paras += "<p>" + esc(sec.body[p]) + "</p>";
    }
    var figure = sec.image
      ? '<figure class="mag-figure"><img src="' + esc(sec.image) +
        '" alt="' + esc(c.company + "｜" + sec.heading) + '" loading="lazy" decoding="async" /></figure>'
      : "";
    sections +=
      '<section class="mag-section">' +
        '<h2 class="mag-section__head">' + esc(sec.heading) + "</h2>" +
        '<div class="mag-section__body">' + paras + "</div>" +
        figure +
      "</section>";
  }

  var article =
    '<article class="mag-article"><div class="mag-article__inner">' +
      sections +
      '<a class="mag-back" href="index.html#article">← BACK TO 30 STORIES</a>' +
    "</div></article>";

  root.innerHTML = cover + article;

  /* ---- タグラインを1行に収める（はみ出す時だけ縮小） ---- */
  fitTagline();
  window.addEventListener("resize", fitTagline);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTagline);
  }

  function fitTagline() {
    var el = document.querySelector(".mag-cover__tagline");
    if (!el) return;
    // いったんCSSの通常状態に戻して、収まる幅（＝列幅）を取得
    el.style.fontSize = "";
    el.style.whiteSpace = "";
    var available = el.clientWidth;
    // 1行にして、はみ出す間だけフォントを少しずつ縮小
    el.style.whiteSpace = "nowrap";
    var size = parseFloat(window.getComputedStyle(el).fontSize);
    var guard = 0;
    while (el.scrollWidth > available && size > 16 && guard < 240) {
      size -= 0.5;
      el.style.fontSize = size + "px";
      guard++;
    }
  }

  /* ---- 最小限のHTMLエスケープ ---- */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
