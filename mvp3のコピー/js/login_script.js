// DOMContentLoadedイベントを待ってから処理を開始
document.addEventListener('DOMContentLoaded', function() {

    // --- 正しいIDとパスワードをここで設定 ---
    const CORRECT_USER = "admin";
    const CORRECT_PASS = "password123";
    // ------------------------------------

    // HTML要素を取得
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // --- ▼▼▼ ここから追記 ▼▼▼ ---
    
    // 自動入力ボタンの要素を取得
    const autoFillButton = document.getElementById('auto-fill-button');

    // 自動入力ボタンにクリックイベントを設定
    autoFillButton.addEventListener('click', function() {
        // 定義済みの正しいIDとパスワードを入力欄にセットする
        usernameInput.value = CORRECT_USER;
        passwordInput.value = CORRECT_PASS;
    });

    // --- ▲▲▲ ここまで追記 ▲▲▲ ---

    // フォームが送信されたときのイベントを設定
    loginForm.addEventListener('submit', function(event) {
        // デフォルトのフォーム送信（ページのリロード）を防ぐ
        event.preventDefault();

        // 入力された値を取得
        const username = usernameInput.value;
        const password = passwordInput.value;

        // IDとパスワードが正しいかチェック
        if (username === CORRECT_USER && password === CORRECT_PASS) {
            // 正しい場合
            errorMessage.textContent = ""; // エラーメッセージをクリア
            window.location.href = "home.html"; 
            // 実際のアプリケーションでは、ここで別ページに遷移させる
            // window.location.href = "dashboard.html"; 
        } else {
            // 間違っている場合
            errorMessage.textContent = "ユーザーIDまたはパスワードが間違っています。";
            passwordInput.value = ""; // パスワード欄を空にする
        }
    });
});