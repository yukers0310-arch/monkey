const loadingMessage = document.querySelector(".font-loading-message");
const hidePage = () => {
  document.documentElement.classList.remove("font-loading");
  loadingMessage.hidden = true;
};

const showFallbackFont = () => {
  loadingMessage.textContent = "フォントを読み込めませんでした。代替フォントで表示します。";
  loadingMessage.classList.add("font-load-error");
  document.documentElement.classList.remove("font-loading");
  window.setTimeout(() => {
    loadingMessage.hidden = true;
  }, 3000);
};

document.fonts.load('16px "k-font"').then((loadedFonts) => {
  if (loadedFonts.length > 0 && document.fonts.check('16px "k-font"')) {
    hidePage();
    return;
  }

  showFallbackFont();
}, (error) => {
  console.error("フォントの読み込みに失敗しました。", error);
  showFallbackFont();
});
