document.getElementById("form").addEventListener("submit", function (e) {
  const inputs = document.querySelectorAll(
    ".contact-wrap__con__input, .contact-wrap__con__area"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("input-error");
      isValid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  if (!isValid) {
    e.preventDefault(); // フォーム送信を止める
    alert("未入力の項目があります。すべてご記入ください。");
  }
});
document.getElementById("form").addEventListener("submit", function (e) {
  const inputs = document.querySelectorAll(
    ".contact-wrap__con__input, .contact-wrap__con__area"
  );
  const email = document.getElementById("email");
  const emailConfirm = document.getElementById("email_confirm");
  let isValid = true;

  // すべての入力欄が空でないかチェック
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("input-error");
      isValid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  // メールアドレス一致確認
  if (email.value.trim() !== emailConfirm.value.trim()) {
    email.classList.add("input-error");
    emailConfirm.classList.add("input-error");
    alert("メールアドレスが一致していません。再確認してください。");
    isValid = false;
  } else {
    email.classList.remove("input-error");
    emailConfirm.classList.remove("input-error");
  }

  if (!isValid) {
    e.preventDefault(); // 送信を止める
    return false;
  }
});