/* =========================================================
   FOR FUTURE 25 — Renewal interactions
   1) スクロール連動の登場（IntersectionObserver・スタッガー）
   2) トップ画像の浮遊アニメ発動
   3) ページ遷移（読み込み時フェードイン / 内部リンクでフェードアウト）
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     0. ページ遷移オーバーレイ
     --------------------------------------------------------- */
  function setupPageTransition() {
    if (prefersReduced) return;

    // オーバーレイ生成（HTMLを汚さずJSで挿入）
    let overlay = document.querySelector(".page-transition");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition";
      overlay.innerHTML =
        '<span class="page-transition__mark">FOR FUTURE 25</span>';
      document.body.appendChild(overlay);
    }
    document.documentElement.classList.add("pt-loading");

    // 読み込み完了でフェードアウト
    const hide = () => {
      overlay.classList.add("is-hidden");
      window.setTimeout(() => {
        document.documentElement.classList.remove("pt-loading");
      }, 700);
    };
    if (document.readyState === "complete") {
      window.setTimeout(hide, 250);
    } else {
      window.addEventListener("load", () => window.setTimeout(hide, 250));
    }

    // 内部リンク（同一サイトの別ページ）でフェードアウトしてから遷移
    document.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      // 除外：アンカー / 別タブ / 別ドメイン / ダミー(#) / ダウンロード / メール等
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.host !== window.location.host
      ) {
        return;
      }
      // 同一ページ内アンカー付きリンク（index.html#about 等）はそのまま
      const url = new URL(a.href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.hash &&
        url.hash !== "#"
      ) {
        return;
      }

      e.preventDefault();
      overlay.classList.remove("is-hidden");
      overlay.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = a.href;
      }, 550);
    });
  }

  /* ---------------------------------------------------------
     1. スクロール連動の登場
     --------------------------------------------------------- */
  function setupScrollReveal() {
    // 登場対象を収集
    const groups = [
      { sel: ".about-wrap__title", scale: false, stagger: 0 },
      { sel: ".about-wrap__body__head", scale: false, stagger: 0 },
      { sel: ".about-wrap__body__text", scale: false, stagger: 90 },
      { sel: ".article-wrap__head", scale: false, stagger: 0 },
      { sel: ".article-wrap__body__first", scale: true, stagger: 0 },
      { sel: ".article-wrap__body__card", scale: true, stagger: 70 },
      { sel: ".footer-wrap__img", scale: false, stagger: 0 },
      { sel: ".footer-wrap__imghousou", scale: false, stagger: 80 },
      // TOP：章見出し / サブ見出し
      { sel: ".chapter__no", scale: false, stagger: 0 },
      { sel: ".section-sub", scale: false, stagger: 0 },
      // 記事（company.html）：誌面
      { sel: ".mag-lead", scale: false, stagger: 0 },
      { sel: ".mag-section", scale: false, stagger: 0 },
      { sel: ".mag-figure", scale: true, stagger: 0 },
      { sel: ".mag-pullquote", scale: false, stagger: 0 },
      { sel: ".mag-profile", scale: false, stagger: 0 },
    ];

    const targets = [];
    groups.forEach((g) => {
      const els = document.querySelectorAll(g.sel);
      els.forEach((el, i) => {
        el.classList.add("will-reveal");
        if (g.scale) el.classList.add("reveal-scale");
        // 同種の要素は順番に少し遅らせて登場（スタッガー）
        if (g.stagger) {
          el.style.transitionDelay = Math.min(i * g.stagger, 500) + "ms";
        }
        targets.push(el);
      });
    });

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     2. トップ画像：登場アニメ後に浮遊を開始
     --------------------------------------------------------- */
  function setupHeroFloat() {
    if (prefersReduced) return;
    const wrap = document.querySelector(".top-wrap");
    if (!wrap) return;
    // 既存の順次フェードイン（最大 2.4s + 1s）が終わってから浮遊開始
    window.setTimeout(() => wrap.classList.add("float-on"), 3600);
  }

  /* ---------------------------------------------------------
     3. ヘッダーのロゴ：スクロールで左上に表示
     --------------------------------------------------------- */
  function setupHeaderLogo() {
    var logo = document.querySelector(".header-logo");
    if (!logo) return;
    var onScroll = function () {
      if (window.pageYOffset > 220) logo.classList.add("is-visible");
      else logo.classList.remove("is-visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     4. ハンバーガーメニューの中身を誌面調に組み立て
     --------------------------------------------------------- */
  function setupNav() {
    var list = document.getElementById("h-nav__list");
    if (!list) return;

    var items = [
      { href: "index.html", en: "TOP", jp: "トップ" },
      { href: "index.html#about", en: "ABOUT", jp: "このサイトについて" },
      { href: "index.html#article", en: "STORIES", jp: "25の物語" },
      { href: "policy.html", en: "PRIVACY POLICY", jp: "プライバシーポリシー" },
      { href: "contact.html", en: "CONTACT", jp: "お問い合わせ" }
    ];

    var ul = "<ul>";
    items.forEach(function (it, i) {
      ul +=
        '<li><a href="' + it.href + '">' +
          '<span class="h-nav__no">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
          '<span class="h-nav__en">' + it.en + "</span>" +
          '<span class="h-nav__jp">' + it.jp + "</span>" +
        "</a></li>";
    });
    ul += "</ul>";

    list.innerHTML =
      ul +
      '<p class="h-nav__tagline">九州から、未来をつくる25のストーリー。</p>' +
      '<p class="h-nav__copy">© FOR FUTURE 25</p>';

    // メニュー内リンクで閉じる（header.js の再バインド）
    var closeMenu = function () {
      var open = document.querySelector(".h-open");
      var nav = document.getElementById("h-nav");
      if (open) open.classList.remove("active");
      if (nav) nav.classList.remove("panelactive");
    };
    var links = list.querySelectorAll("a");
    for (var k = 0; k < links.length; k++) {
      links[k].addEventListener("click", closeMenu);
    }
  }

  /* ---------------------------------------------------------
     5. スクロール進捗バー（極細グラデ・全ページ共通）
     --------------------------------------------------------- */
  function setupScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    var ticking = false;
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? window.pageYOffset / max : 0;
      bar.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1) + ")";
      ticking = false;
    };
    var onScroll = function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* --------------------------------------------------------- */
  function init() {
    setupNav();
    setupPageTransition();
    setupScrollReveal();
    setupHeroFloat();
    setupHeaderLogo();
    setupScrollProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
