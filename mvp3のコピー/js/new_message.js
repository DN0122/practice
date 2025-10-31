// =================================================================
// 新規送信ページ用スクリプト（タブ関連・保存・サマリー）
// =================================================================

function updateSummary() {
    const sendDate = document.getElementById('send-date');
    const sendTime = document.getElementById('send-time');
    const senderName = document.getElementById('sender-name');
    const senderEmail = document.getElementById('sender-email');
    const subject = document.getElementById('email-subject');

    const summaryDatetime = document.getElementById('summary-datetime');
    const summarySender = document.getElementById('summary-sender');
    const summarySubject = document.getElementById('summary-subject');
    const summaryCount = document.getElementById('summary-count');

    if (summaryDatetime && sendDate && sendTime && sendDate.value && sendTime.value) {
        summaryDatetime.textContent = `${sendDate.value} ${sendTime.value}`;
    } else if (summaryDatetime) {
        summaryDatetime.textContent = '未設定';
    }

    if (summarySender) {
        const name = senderName ? senderName.value : '';
        const email = senderEmail ? senderEmail.value : '';
        summarySender.textContent = (name && email) ? `${name} <${email}>` : (name || email || '未設定');
    }

    if (summarySubject) summarySubject.textContent = (subject && subject.value) ? subject.value : '未設定';
    if (summaryCount) summaryCount.textContent = '1,250件';
}

function confirmSend() {
    Modal.confirm({
        title: '最終確認',
        content: 'この内容で送信します。よろしいですか？',
        okText: '送信する',
        cancelText: 'キャンセル',
        onOk: () => {
            alert('送信処理を開始しました。\n（この機能はデモのため実際には送信されません）');
        }
    });
}

// -----------------------------------------------------------------
// DOMContentLoaded: 保存/読込、タブ切替（存在すれば）等
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    function saveTabData(tabId) {
        const tabPane = document.getElementById(tabId);
        if (!tabPane) return;
        const formData = {};
        const elements = tabPane.querySelectorAll('input:not([type="checkbox"]), input[type="checkbox"], select, textarea');
        elements.forEach(el => {
            if (el.id) formData[el.id] = (el.type === 'checkbox') ? el.checked : el.value;
        });
        localStorage.setItem(`tabData-${tabId}`, JSON.stringify(formData));
        updateTabIndicator(tabId, true);
        const link = document.querySelector(`a[data-tab='${tabId}']`);
        Modal.confirm({ title: '保存完了', content: link ? `「${link.textContent.trim()}」の入力内容を保存しました！` : '保存しました！', okText: 'OK', cancelText: null });
    }

    function loadTabData(tabId) {
        const saved = localStorage.getItem(`tabData-${tabId}`);
        if (!saved) return;
        const data = JSON.parse(saved);
        const tabPane = document.getElementById(tabId);
        if (!tabPane) return;
        for (const elementId in data) {
            const element = document.getElementById(elementId);
            if (element) {
                if (element.type === 'checkbox') element.checked = data[elementId];
                else if (element.type !== 'file') element.value = data[elementId];
            }
        }
        updateTabIndicator(tabId, true);
    }

    function updateTabIndicator(tabId, shouldBeSaved) {
        const tabLink = document.querySelector(`.vertical-tab-link[data-tab="${tabId}"]`);
        if (!tabLink) return;
        if (shouldBeSaved) tabLink.classList.add('saved');
        else tabLink.classList.remove('saved');
    }

    const verticalTabLinks = document.querySelectorAll('.vertical-tab-link');
    const verticalTabPanes = document.querySelectorAll('.vertical-tab-pane');
    const requiredTabs = ['vtab1', 'vtab2', 'vtab3', 'vtab4', 'vtab5'];

    function getUnsavedTabs() {
        const unsaved = [];
        requiredTabs.forEach(tabId => {
            if (!localStorage.getItem(`tabData-${tabId}`)) {
                const link = document.querySelector(`.vertical-tab-link[data-tab="${tabId}"]`);
                if (link) unsaved.push(link.textContent.trim());
            }
        });
        return unsaved;
    }

    verticalTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTabId = this.dataset.tab;
            if (targetTabId === 'vtab6') {
                const unsaved = getUnsavedTabs();
                if (unsaved.length > 0) {
                    let message = "以下の項目が保存されていません。\nすべて保存してから確認画面に進んでください。\n\n";
                    unsaved.forEach(name => { message += `• ${name}\n`; });
                    Modal.confirm({ title: '未保存の項目があります', content: message, okText: 'OK', cancelText: null });
                    return;
                }
            }
            verticalTabLinks.forEach(l => l.classList.remove('active'));
            verticalTabPanes.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const targetPane = document.getElementById(targetTabId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    const saveButtons = document.querySelectorAll('.save-tab-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            if (tabId) saveTabData(tabId);
        });
    });

    const allTabs = document.querySelectorAll('.vertical-tab-link[data-tab]');
    allTabs.forEach(tab => { loadTabData(tab.dataset.tab); });

    ['send-date', 'send-time', 'sender-name', 'sender-email', 'email-subject'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateSummary);
    });
    updateSummary();
});
