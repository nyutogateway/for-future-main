// ナビゲーション制御
// WordPress は jQuery を noConflict モードで読み込むため $ がグローバルに存在しない。
// jQuery(function ($) { ... }) で囲むことで、静的サイト・WordPress の両方で動く。
jQuery(function ($) {
  $(".h-open").on("click", function () {
    $(this).toggleClass("active");
    $("#h-nav").toggleClass("panelactive");
  });

  $("#h-nav").on("click", "a", function () {
    $(".h-open").removeClass("active");
    $("#h-nav").removeClass("panelactive");
  });
});
