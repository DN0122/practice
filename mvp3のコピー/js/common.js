// =================================================================
// カスタムモーダル（共通）
// =================================================================
const Modal = {
    confirm: function(options) {
        const overlay = document.getElementById('custom-modal-overlay');
        const titleEl = document.getElementById('modal-title');
        const contentEl = document.getElementById('modal-content');
        const okBtn = document.getElementById('modal-ok-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        titleEl.textContent = options.title || '確認';
        contentEl.textContent = options.content || '';
        okBtn.textContent = options.okText || 'OK';
        cancelBtn.textContent = options.cancelText || 'Cancel';
        cancelBtn.style.display = options.cancelText === null ? 'none' : 'inline-block';
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        const closeModal = () => overlay.classList.remove('active');
        newOkBtn.addEventListener('click', () => {
            if (options.onOk) options.onOk();
            closeModal();
        });
        newCancelBtn.addEventListener('click', () => {
            if (options.onCancel) options.onCancel();
            closeModal();
        });
        overlay.classList.add('active');
    }
};

// =================================================================
// サイドバー & ドロップダウン（共通）
// =================================================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const allDropdowns = document.querySelectorAll('.dropdown');
    allDropdowns.forEach(dd => {
        if (dd.id !== dropdownId) dd.classList.remove('active');
    });
    if (dropdown) dropdown.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown-container')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.classList.remove('active');
    }
});

// =================================================================
// 共通初期化（リセットボタン）
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('reset-storage-btn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            Modal.confirm({
                title: 'すべてのデータをリセットしますか？',
                content: '保存されているすべての入力内容が削除されます。\nこの操作は元に戻せません。',
                okText: 'リセットする',
                cancelText: 'キャンセル',
                onOk: () => {
                    localStorage.clear();
                    location.reload();
                }
            });
        });
    }

    // ログイン画面へボタンの遷移制御
    const goLoginBtn = document.getElementById('go-login-btn');
    if (goLoginBtn) {
        goLoginBtn.addEventListener('click', function() {
            const path = location.pathname || '';
            const onLogin = /(^|\/)login\.html$/.test(path);
            if (onLogin) {
                if (document.referrer) {
                    history.back();
                } else {
                    location.href = './home.html';
                }
            } else {
                location.href = './login.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 関数定義 ---

    /**
     * 指定されたタブ内の全セクションが保存済みかチェックし、
     * 条件を満たしていればタブメニューをハイライトする関数
     * @param {string} tabId - チェック対象のタブID (例: 'vtab1')
     */
    function checkTabCompletion(tabId) {
        const tabPane = document.getElementById(tabId);
        if (!tabPane) return;

        // タブ内の全セクション（IDを持つもの）を取得
        const sectionsInTab = tabPane.querySelectorAll('.form-section[id]');
        if (sectionsInTab.length === 0) return; // チェック対象セクションがなければ何もしない

        let allSectionsSaved = true;
        sectionsInTab.forEach(section => {
            // 1つでも未保存のセクションがあればフラグをfalseにする
            if (localStorage.getItem('saved-section-' + section.id) !== 'true') {
                allSectionsSaved = false;
            }
        });

        // 対応するタブメニューのリンクを取得
        const tabLink = document.querySelector(`.vertical-tab-link[data-tab="${tabId}"]`);
        if (!tabLink) return;

        // 全セクションが保存済みなら、タブに完了クラスを付与
        if (allSectionsSaved) {
            tabLink.classList.add('tab-completed');
        } else {
            tabLink.classList.remove('tab-completed'); // 逆に、一つでも未保存ならクラスを外す
        }
    }

    /**
     * ページ読み込み時に、保存済みのセクションをハイライトする関数
     */
    function applyInitialHighlights() {
        const sections = document.querySelectorAll('.form-section[id]');
        sections.forEach(section => {
            if (localStorage.getItem('saved-section-' + section.id) === 'true') {
                section.classList.add('save-highlight');
            }
        });
    }

    /**
     * セクションを保存し、ハイライトを適用し、タブの完了状態をチェックする関数
     * @param {string} sectionId - 保存対象のセクションID
     */
    function saveAndHighlightSection(sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        // データの保存処理
        const inputsToSave = sectionElement.querySelectorAll('input, select, textarea');
        inputsToSave.forEach(input => {
            if (input.id) {
                localStorage.setItem(input.id, input.value);
            }
        });

        // セクションが保存されたことを記録
        localStorage.setItem('saved-section-' + sectionId, 'true');
        // セクション自体をハイライト
        sectionElement.classList.add('save-highlight');

        // ★★★ このセクションが所属するタブの完了状態をチェックする ★★★
        const parentTabPane = sectionElement.closest('.vertical-tab-pane');
        if (parentTabPane && parentTabPane.id) {
            checkTabCompletion(parentTabPane.id);
        }
    }

    // --- 初期化処理とイベントリスナー ---

    // 1. ページ読み込み時にセクションのハイライトを復元
    applyInitialHighlights();

    // 2. ページ読み込み時に各タブの完了状態をチェックして反映
    const allTabPanes = document.querySelectorAll('.vertical-tab-pane[id]');
    allTabPanes.forEach(pane => checkTabCompletion(pane.id));

    // 3. すべての保存ボタンにクリックイベントを設定
    const saveButtons = document.querySelectorAll('.save-tab-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.dataset.sectionId;
            if (sectionId) {
                saveAndHighlightSection(sectionId);
            }
        });
    });

    // (ここに他のJavaScriptコードがあれば、それはそのまま残してください)
});