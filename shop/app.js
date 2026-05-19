/**
 * SHINONOI DEPOT Core JS
 * マルチページ間でのデータ整合性と、限定ページの認証を管理
 */

const app = {
    // 1. 限定ページのパスワード
    AUTH_CODE: "SHINO2026",

    init() {
        this.updateCartBadge();
        this.checkAccess();
        this.renderHomeGrid();
        this.registerSW();
    },

    // 2. 認証チェックロジック (exclusive.htmlで動作)
    checkAccess() {
        if (window.location.pathname.includes('exclusive.html')) {
            const isAuth = sessionStorage.getItem('depot_verified');
            if (!isAuth) {
                window.location.href = 'auth.html';
            }
        }
    },

    // 3. 限定ページ解除
    verify() {
        const input = document.getElementById('passInput').value;
        if (input === this.AUTH_CODE) {
            sessionStorage.setItem('depot_verified', 'true');
            window.location.href = 'exclusive.html';
        } else {
            document.getElementById('errMsg').classList.remove('d-none');
        }
    },

    // 4. カート管理
    addToCart(id) {
        let cart = JSON.parse(localStorage.getItem('depot_cart') || '[]');
        if (!cart.includes(id)) {
            cart.push(id);
            localStorage.setItem('depot_cart', JSON.stringify(cart));
            this.updateCartBadge();
            alert("ダウンロードリストに追加しました");
        }
    },

    updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('depot_cart') || '[]');
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = cart.length;
    },

    // 5. 動的描画（全ページ共通アイテム定義）
    renderHomeGrid() {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;

        const items = [
            { id: 1, name: "System Core v2", tag: "FREE" },
            { id: 2, name: "UI Framework", tag: "FREE" },
            { id: 3, name: "Database Asset", tag: "FREE" }
        ];

        grid.innerHTML = items.map(item => `
            <div class="col-12 col-md-4">
                <div class="asset-card p-3">
                    <div class="asset-img mb-3"><i class="bi bi-file-earmark-code fs-1"></i></div>
                    <span class="badge bg-dark mb-2" style="width:fit-content">${item.tag}</span>
                    <h3 class="h6 fw-bold">${item.name}</h3>
                    <button class="btn btn-outline-primary btn-sm mt-auto rounded-pill" onclick="app.addToCart(${item.id})">リストに追加</button>
                </div>
            </div>
        `).join('');
    },

    registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }
};

window.onload = () => app.init();
