// すべての本ボタン取得

const bookButtons = document.querySelectorAll(".book-button");


// popup取得

const popup = document.querySelector("#popup");


// 閉じるボタン取得

const closeButton = document.querySelector("#close-button");


// popup内取得

const popupTitle = document.querySelector("#popup-title");

const popupDescription = document.querySelector("#popup-description");

const popupImage = document.querySelector("#popup-image");

const popupLink = document.querySelector("#popup-link");


// 各本クリック

bookButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // data取得

    const title = button.dataset.title;

    const description = button.dataset.description;

    const image = button.dataset.image;

    const link = button.dataset.link;


    // popup変更

    popupTitle.textContent = title;

    popupDescription.innerHTML = description;

    popupImage.src = image;

    popupLink.href = link;


    // popup表示

    popup.style.display = "flex";

  });

});


// 閉じるボタン

closeButton.addEventListener("click", () => {

  popup.style.display = "none";

});

const bird = document.querySelector("#bird-hitbox");
const birdImage = document.querySelector("#bird-image");
const birdMessage = document.querySelector("#bird-message");

bird.addEventListener("mouseenter", () => {

   // 鳥ぴょこ

  birdImage.style.transform = "scale(1.08)";

  // 一旦消す

  birdMessage.style.display = "none";


  // 再描画（おまじない）

  void birdMessage.offsetWidth;


  // 表示

  birdMessage.style.display = "block";


  // 1秒後戻す

  setTimeout(() => {

    birdMessage.style.display = "none";

    birdImage.style.transform = "scale(1)";

  }, 1000);

});