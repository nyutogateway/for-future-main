function updateBackgroundPosition() {
  const height = window.innerHeight;
  let position = "40%";

  if (height < 700) {
    position = "50%";
  }
  if (height < 600) {
    position = "30%";
  }
  if (height < 500) {
    position = "0%";
  }

  // CSS変数を更新
  document.documentElement.style.setProperty("--bg-position", position);
}

// 初回実行とリサイズ時に適用
window.addEventListener("load", updateBackgroundPosition);
window.addEventListener("resize", updateBackgroundPosition);
