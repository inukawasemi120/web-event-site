ちいさな拍手箱 / GitHub Pages 用

1. script.js の APP_URL を自分の Apps Script WebアプリURL（/execで終わるもの）に変更。
2. index.html をダブルクリックしてローカル表示確認。
3. 拍手を押し、Googleスプレッドシートの「受信シート」に「拍手」が追加されるか確認。
4. メッセージを送信し、同じく「コメント」が追加されるか確認。
5. 正常なら clap フォルダごと web-event-site に追加。URLは通常 /web-event-site/clap/ 。

注意：フォームは hidden iframe 宛に通常の POST を送る方式です。
Google Apps Scriptからのレスポンスをサイト側では読み取れないため、
画面上では「保存できました」とは断言しません。最初は必ず受信シートで確認してください。
匿名投稿用の Webアプリは誰でも呼び出せるので、受信シートは非公開のままにしてください。
