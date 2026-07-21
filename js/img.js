document.addEventListener("DOMContentLoaded", () => {
  const imageList = [
    "img/kyouwa/kyouwatop.jpg",
    "img/kensetsu.jpeg",
    "img/tudumi/tudumitop.jpg",
    "img/NK/NKtop.jpg",
    "img/pre2.jpeg",
    "img/pre3.jpeg",
    "img/nishitetsu/top.jpg",
    "img/kamiyama/top.jpg",
  ];

  // ランダム表示対象のimg要素たち
  const imgElements = Array.from(
    document.querySelectorAll('img[data-random="top-img"]')
  );

  // 要素数より画像が少ないとエラーになるので制限
  const usableImages = imageList.slice(0, imgElements.length);

  // シャッフル関数
  const shuffledImages = usableImages.sort(() => Math.random() - 0.5);

  // 各imgに重複なく画像を割り当てる
  imgElements.forEach((img, i) => {
    img.src = shuffledImages[i];
  });
});
function adjustBgPos() {
  const h = window.innerHeight;
  const topEl = document.querySelector(".top");
  if (!topEl) return;

  // 高さによって切り替え
  if (h < 600) {
    topEl.style.setProperty("--bg-pos", "60%");
  } else if (h < 670) {
    topEl.style.setProperty("--bg-pos", "50%");
  }
  else if (h < 800) {
    topEl.style.setProperty("--bg-pos", "45%");
  } else {
    topEl.style.setProperty("--bg-pos", "40%");
  }
}

// 初期ロードとリサイズ時に実行
window.addEventListener("load", adjustBgPos);
window.addEventListener("resize", adjustBgPos);