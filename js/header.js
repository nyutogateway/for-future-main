// ナビゲーション制御
$(".h-open").click(function () {
  $(this).toggleClass("active");
  $("#h-nav").toggleClass("panelactive");
});

$("#h-nav a").click(function () {
  $(".h-open").removeClass("active");
  $("#h-nav").removeClass("panelactive");
});
