/* =========================================================
   FOR FUTURE 30 — Hero「一流誌の特集」
   右ステージに選出者を"表紙の顔"として順に掲げる。氏名・社名つきで
   要人として扱い、「選ばれた名誉」を演出する。
   氏名はカード準拠のローマ字表記（実データ）。
   将来は companies.json から生成する。
   ========================================================= */
(function () {
  "use strict";

  const stage = document.querySelector("[data-hero-stage]");
  if (!stage) return;

  const capName = stage.querySelector("[data-cap-name]");
  const capCom = stage.querySelector("[data-cap-com]");

  // 選出者（表紙の顔）— 氏名はカードのローマ字表記に準拠
  const featured = [
    { img: "img/nishitetsu/bumon.jpg", name: "NIYAMA HIROKAZU", com: "西鉄車体技術株式会社" },
    { img: "img/SAGA/sagatop.jpg", name: "KOBAYAKAWA TAKENORI", com: "SAGA久光スプリングス株式会社" },
    { img: "img/kamiyama/top.jpg", name: "KAMIYAMA MAKOTO", com: "株式会社上山建設" },
    { img: "img/NK/NKtop.jpg", name: "NAGAO YUKI", com: "NK Wealth Management株式会社" },
    { img: "img/kyouwa/kyouwatop.jpg", name: "KASHIRO KAZUNARI", com: "協和商工株式会社" },
    { img: "img/tudumi/tudumitop.jpg", name: "OISHI SYOTA", com: "株式会社つづみ" },
  ];

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // スライド生成＋プリロード（caption より背面に差し込む）
  const caption = stage.querySelector(".hero-mag__caption");
  const slides = featured.map((f) => {
    const el = document.createElement("div");
    el.className = "hero-mag__slide";
    el.style.backgroundImage = 'url("' + f.img + '")';
    stage.insertBefore(el, caption);
    const pre = new Image();
    pre.src = f.img;
    return el;
  });

  let index = 0;
  function show(n) {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === n));
    if (capName) capName.textContent = featured[n].name;
    if (capCom) capCom.textContent = featured[n].com;
    index = n;
  }

  show(0);

  if (prefersReduced || slides.length <= 1) return;

  const INTERVAL = 5000;
  let timer = window.setInterval(function () {
    show((index + 1) % slides.length);
  }, INTERVAL);

  // タブ非表示中は停止
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.clearInterval(timer);
      timer = null;
    } else if (!timer) {
      timer = window.setInterval(function () {
        show((index + 1) % slides.length);
      }, INTERVAL);
    }
  });
})();
