// --- 多言語データ ---
const i18n = {
    ja: {
        nav_home: "ホーム", nav_products: "商品一覧", nav_guide: "ご利用ガイド", nav_about: "会社概要",
        nav_cart: "カート", hero_title: "新着アイテム", new_goods: "新着商品", total: "合計",
        checkout: "購入・ダウンロード", add: "追加", coming: "近日発売",
        f_terms: "利用規約", f_privacy: "プライバシーポリシー", 
        invite_title: "招待者限定商品", invite_msg: "閲覧には招待コードが必要です", unlock: "解除",
        dl_guide_title: "ダウンロード販売", dl_guide_text: "デジタル商品を即座に受け取れます",
        type_dl: "DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
    },
    en: {
        nav_home: "Home", nav_products: "All Products", nav_guide: "Guide", nav_about: "About",
        nav_cart: "Cart", hero_title: "NEW ARRIVALS", new_goods: "NEW GOODS", total: "Total",
        checkout: "Checkout / Download", add: "Add", coming: "Coming Soon",
        f_terms: "Terms", f_privacy: "Privacy",
        invite_title: "Exclusive Product", invite_msg: "Invitation code required", unlock: "Unlock",
        dl_guide_title: "Digital Delivery", dl_guide_text: "Download files instantly after purchase.",
        type_dl: "DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
    }
};

// --- 商品・ニュースデータ ---
const products = [
    { id: 1, type: "dl", name: {ja:"開発テンプレート v2", en:"Dev Template v2"}, price: 3000, stock: 999, featured: true },
    { id: 2, type: "lim", name: {ja:"限定シリアルキー", en:"Limited Serial Key"}, price: 5000, stock: 3, featured: true },
    { id: 3, type: "inv", name: {ja:"VIP限定ツール", en:"VIP Tool"}, price: 0, code: "SHINO2026", featured: false },
    { id: 4, type: "dl", name: {ja:"背景アセット集", en:"Background Assets"}, price: 1200, stock: 999, featured: false }
];

const news = [
    { date: "2026.05.19", text: {ja:"新作アセット販売開始", en:"New Assets Released"} },
    { date: "2026.04.10", text: {ja:"GW休業のお知らせ", en:"Holiday Notice"} }
];

// --- 状態管理 ---
let lang = localStorage.getItem('s_lang') || 'ja';
let cart = JSON.parse(localStorage.getItem('s_cart')) || [];
let activeInviteId = null;

// --- 初期化 & ページ切替 ---
function showPage(id) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('d-none'));
    document.getElementById(id).classList.remove('d-none');
    // サイドメニューが開いていれば閉じる (Bootstrap)
    const sideMenu = document.getElementById('sideMenu');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(sideMenu);
    if(bsOffcanvas) bsOffcanvas.hide();
    window.scrollTo(0,0);
}

function toggleLang() {
    lang = lang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('s_lang', lang);
    renderAll();
}

// --- 描画ロジック ---
function renderAll() {
    // 翻訳適用
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        el.textContent = i18n[lang][key];
    });
    document.getElementById('langBtn').textContent = lang === 'ja' ? 'ENGLISH' : '日本語';

    // 商品描画 (Home & All)
    const renderList = (targetId, filterFeatured) => {
        const container = document.getElementById(targetId);
        if(!container) return;
        const displayList = filterFeatured ? products.filter(p => p.featured) : products;
        container.innerHTML = displayList.map(p => `
            <div class="col-6 col-md-4">
                <div class="card item-card h-100">
                    <div class="item-img">
                        <span class="badge-tag">${i18n[lang]['type_'+p.type]}</span>
                        <i class="bi bi-box-seam display-4 text-secondary"></i>
                    </div>
                    <div class="p-3 text-center">
                        <div class="small fw-bold mb-1">${p.name[lang]}</div>
                        <div class="fw-bold mb-2">¥${p.price.toLocaleString()}</div>
                        <button class="btn btn-dark btn-sm w-100 rounded-pill" onclick="handleProductAction(${p.id})">
                            ${p.type === 'inv' ? i18n[lang].unlock : i18n[lang].add}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    };
    renderList('featuredList', true);
    renderList('allProductList', false);

    // ニュース描画
    document.getElementById('newsList').innerHTML = news.map(n => `
        <div class="py-2 border-bottom">
            <span class="date-label">${n.date}</span>
            <span class="small fw-bold">${n.text[lang]}</span>
        </div>
    `).join('');

    updateCartUI();
}

// --- カート & 招待ロジック ---
function handleProductAction(id) {
    const p = products.find(x => x.id === id);
    if(p.type === 'inv') {
        activeInviteId = id;
        showPage('invite-auth');
    } else {
        addToCart(p);
    }
}

function verifyInvite() {
    const p = products.find(x => x.id === activeInviteId);
    if(document.getElementById('inviteInput').value === p.code) {
        addToCart(p);
        showPage('home');
        document.getElementById('inviteInput').value = '';
    } else {
        alert("Invalid Code");
    }
}

function addToCart(p) {
    if(p.type === 'lim' && p.stock <= 0) return alert("Sold Out");
    cart.push(p);
    saveCart();
    new bootstrap.Offcanvas(document.getElementById('cartBox')).show();
}

function saveCart() {
    localStorage.setItem('s_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cartCount').textContent = cart.length;
    const body = document.getElementById('cartItems');
    body.innerHTML = cart.map((item, idx) => `
        <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
            <div>
                <div class="small fw-bold">${item.name[lang]}</div>
                <div class="small text-muted">¥${item.price.toLocaleString()}</div>
            </div>
            <i class="bi bi-trash text-danger" style="cursor:pointer" onclick="removeFromCart(${idx})"></i>
        </div>
    `).join('');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('cartTotal').textContent = `¥${total.toLocaleString()}`;
}

function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); }

function checkout() {
    alert(lang === 'ja' ? "購入ありがとうございます！" : "Thank you for your purchase!");
    cart = []; saveCart();
}

// 起動
renderAll();
