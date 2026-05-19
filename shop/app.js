const app = {
    // 招待コード
    INVITE_CODE: "SHINO2026",

    init() {
        this.updateCartBadge();
        this.setupAuth();
        this.renderCatalog();
        this.renderDetail();
    },

    // 限定ページアクセス制御
    setupAuth() {
        if (window.location.pathname.includes('exclusive.html')) {
            if (sessionStorage.getItem('shinonoi_auth') !== 'true') {
                window.location.href = 'auth.html';
            }
        }
    },

    // 認証実行
    verify() {
        const val = document.getElementById('passInput').value;
        if (val === this.INVITE_CODE) {
            sessionStorage.setItem('shinonoi_auth', 'true');
            window.location.href = 'exclusive.html';
        } else {
            alert("コードが正しくありません");
        }
    },

    // カート機能
    add(id) {
        let cart = JSON.parse(localStorage.getItem('shinonoi_cart') || '[]');
        if (!cart.includes(id)) {
            cart.push(id);
            localStorage.setItem('shinonoi_cart', JSON.stringify(cart));
            this.updateCartBadge();
            alert("ダウンロードリストに追加しました");
        }
    },

    updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('shinonoi_cart') || '[]');
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = cart.length;
    },

    // カタログ描画
    renderCatalog() {
        const el = document.getElementById('catalogGrid');
        if (!el) return;
        const items = [
            {id:1, name:"System Core v2"}, {id:2, name:"UI Framework"},
            {id:3, name:"Network Tool"}, {id:4, name:"Graphic Assets"}
        ];
        el.innerHTML = items.map(i => `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="asset-card">
                    <div class="asset-img"><i class="bi bi-cpu"></i></div>
                    <div class="p-3">
                        <h3 class="h6 fw-bold">${i.name}</h3>
                        <a href="item-detail.html?id=${i.id}" class="btn btn-outline-dark btn-sm w-100 rounded-pill mb-2">詳細</a>
                        <button class="btn btn-primary btn-sm w-100 rounded-pill" onclick="app.add(${i.id})">入手する</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
};
window.onload = () => app.init();
