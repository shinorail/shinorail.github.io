/**
 * SHINONOI DEPOT - Universal Logic
 */
const app = {
    lang: localStorage.getItem('depot_lang') || 'ja',
    cart: JSON.parse(localStorage.getItem('depot_cart') || '[]'),
    INVITE_CODE: "SHINO2026",

    // 翻訳データ
    i18n: {
        ja: { home: "ホーム", items: "配布物", excl: "限定ページ", guide: "ガイド", contact: "お問い合わせ", legal: "特定商取引法", terms: "規約", privacy: "プライバシー", cart: "リスト", add: "追加", lang: "ENGLISH", mail: "メールを起動" },
        en: { home: "Home", items: "Assets", excl: "Exclusive", guide: "Guide", contact: "Contact", legal: "Legal", terms: "Terms", privacy: "Privacy", cart: "List", add: "Add", lang: "日本語", mail: "Open Mailer" }
    },

    init() {
        this.renderUI();
        this.checkAuth();
        this.updateCartBadge();
    },

    // 言語切り替えロジック
    langToggle() {
        this.lang = (this.lang === 'ja') ? 'en' : 'ja';
        localStorage.setItem('depot_lang', this.lang);
        location.reload(); // 全ページに適用させるためリロード
    },

    // UIのテキストを動的に書き換え
    renderUI() {
        const dict = this.i18n[this.lang];
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (dict[key]) el.textContent = dict[key];
        });
        const langBtn = document.getElementById('langBtn');
        if (langBtn) langBtn.textContent = dict.lang;
    },

    // カート追加 (ボタンが反応しないバグを修正)
    addToCart(id, name) {
        if (!this.cart.find(i => i.id === id)) {
            this.cart.push({ id, name });
            localStorage.setItem('depot_cart', JSON.stringify(this.cart));
            this.updateCartBadge();
            this.renderCartList();
            alert(this.lang === 'ja' ? "リストに追加しました" : "Added to list");
        }
    },

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = this.cart.length;
    },

    // カートの中身をドロワーに表示
    renderCartList() {
        const list = document.getElementById('cartItems');
        if (!list) return;
        list.innerHTML = this.cart.map((item, idx) => `
            <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                <span class="small fw-bold">${item.name}</span>
                <button class="btn btn-sm btn-danger" onclick="app.removeCart(${idx})">×</button>
            </div>
        `).join('');
    },

    removeCart(idx) {
        this.cart.splice(idx, 1);
        localStorage.setItem('depot_cart', JSON.stringify(this.cart));
        this.updateCartBadge();
        this.renderCartList();
    },

    // 認証チェック
    checkAuth() {
        if (window.location.pathname.includes('exclusive.html')) {
            if (sessionStorage.getItem('depot_auth') !== 'true') {
                window.location.href = 'auth.html';
            }
        }
    },

    verify() {
        const input = document.getElementById('passInput').value;
        if (input === this.INVITE_CODE) {
            sessionStorage.setItem('depot_auth', 'true');
            window.location.href = 'exclusive.html';
        } else {
            alert("Error");
        }
    },

    // メール起動
    sendMail() {
        const subject = encodeURIComponent("SHINONOI DEPOT Inquiry");
        window.location.href = `mailto:support@example.com?subject=${subject}`;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
