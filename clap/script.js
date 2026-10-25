// ここにデプロイしたGoogle Apps Scriptの /exec URLを入れてください。
const APP_URL = "https://script.google.com/macros/s/AKfycbzKLhNqkMFUIRpYnPHr7r7VYr7JkUlOCIhXZ9cgVY-_uq9AYTjtqs25OkjAORNNEA6jFQ/exec";

const clapForm = document.getElementById("clap-form");
const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");

for (const form of [clapForm, messageForm]) {
  form.action = APP_URL;
}

function configureSubmit(form, statusId, validate) {
  const status = document.getElementById(statusId);
  form.addEventListener("submit", event => {
    if (!APP_URL.startsWith("https://script.google.com/macros/s/") || !APP_URL.endsWith("/exec")) {
      event.preventDefault();
      status.textContent = "先にscript.jsにApps ScriptのURLを設定してね。";
      return;
    }
    if (validate && !validate()) {
      event.preventDefault();
      return;
    }
    // クロスオリジンのiframeのため、保存成功の可否はこの画面では確認できません。
    status.textContent = "♡ありがとう♡ ♡好き♡";
  });
}

configureSubmit(clapForm, "clap-status");
configureSubmit(messageForm, "message-status", () => {
  if (!message.value.trim()) {
    document.getElementById("message-status").textContent = "メッセージを入力してね。";
    return false;
  }
  return true;
});
