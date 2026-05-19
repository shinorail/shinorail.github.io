// Stripe公開可能キー (本番時は自分のキーに差し替え)
const stripe = Stripe('pk_test_your_key_here');

const i18n = {
    ja: {
        nav_home: "ホーム", nav_products: "商品一覧", nav_guide: "ご利用ガイド", nav_contact: "お問い合わせ",
        nav_cart: "カート", hero_title: "新作アセット登場", total: "合計", f_legal: "特定商取引法",
        f_terms: "利用規約", f_privacy: "プライバシーポリシー", unlock: "解除", invite_title: "招待者限定アクセス",
        type_dl: "DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
    },
    en: {
        nav_home: "Home", nav_products: "Products", nav_guide: "Guide", nav_contact: "Contact",
        nav_cart: "Cart", hero_title: "NEW ARRIVALS", total: "Total", f_legal: "Legal Notice",
        f_terms: "Terms", f_privacy: "Privacy", unlock: "Unlock", invite_title: "Exclusive Access",
        type_dl: "DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
    }
};

const products = [
    { id: 1, type: "dl", name: {ja:"開発テンプレート v2", en:"Dev Template v2"}, price: 3000, stock: 999, featured: true },
    { id: 2, type: "lim", name: {ja:"限定シリアルキー", en:"Limited Serial Key"}, price: 5000, stock: 3, featured: true },
    { id: 3, type: "inv", name: {ja:"VIP限定ツール", en:"VIP Tool"}, price: 10000, code: "SHINO2026", featured: false }
];

const news = [
    { date: "2026.05.19", text: {ja:"2026年度新作販売開始", en:"2026 New Items Released"} },
    { date: "2026.04.10", text: {ja:"GW休業期間のお知らせ", en:"Holiday Notice"} }
];

let lang = localStorage.getItem('s_lang') || 'ja';
let cart = JSON.parse(localStorage.getItem('s_cart')) || [];
let activeInviteId = null;

function showPage(id) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('d-none'));
    document.getElementById(id).classList.remove('d-none');
    const menu = document.getElementById('sideMenu');
    const instance = bootstrap.Offcanvas.getInstance(menu);
    if(instance) instance.hide();
    window.scrollTo(0,0);
}

function toggleLang() {
    lang = (lang === 'ja') ? 'en' : 'ja';
    localStorage.setItem('s_lang', lang);
    renderAll();
}

function renderAll() {
    document.querySelectorAll('[data-t]').forEach(el => {
        el.textContent = i18n[lang][el.getAttribute('data-t')];
    });
    document.getElementById('langBtn').textContent = (lang === 'ja') ? 'ENGLISH' : '日本語';

    // 商品描画
    const draw = (target, filter) => {
        const list = products.filter(p => filter ? p.featured : true);
        document.getElementById(target).innerHTML = list.map(p => `
            <div class="col-6 col-md-4">
                <div class="item-card text-center p-3">
                    <div class="item-img"><span class="tag">${i18n[lang]['type_'+p.type]}</span><i class="bi bi-cpu"></i></div>
                    <div class="mt-2 fw-bold small">${p.name[lang]}</div>
                    <div class="fw-bold">¥${p.price.toLocaleString()}</div>
                    <button class="btn btn-dark btn-sm w-100 rounded-pill mt-2" onclick="action(${p.id})">
                        ${p.type === 'inv' ? i18n[lang].unlock : 'ADD TO CART'}
                    </button>
                </div>
            </div>
        `).join('');
    };
    draw('featuredList', true);
    draw('allProductList', false);

    // ニュース
    document.getElementById('newsList').innerHTML = news.map(n => `
        <div class="py-2 border-bottom small fw-bold">
            <span class="date-tag">${n.date}</span>${n.text[lang]}
        </div>
    `).join('');

    // リーガル・ガイド・規約（長文注入）
    renderTextDocs();
    updateCart();
}

function renderTextDocs() {
    const isJa = lang === 'ja';
    document.getElementById('guide-content').innerHTML = isJa ? 
        `<h5>購入方法</h5><p>商品を選びカートに入れ、決済を完了させてください。ダウンロード商品は即座にマイページより取得可能です。</p>` : 
        `<h5>How to Buy</h5><p>Select items, add to cart, and complete payment via Stripe.</p>`;
    
    document.getElementById('legal-content').innerHTML = `
        <table class="legal-table">
            <tr><th>${isJa?'販売業者':'Provider'}</th><td>SHINONOI DEPOT</td></tr>
            <tr><th>${isJa?'支払時期':'Payment'}</th><td>${isJa?'クレジットカード：即時':'Credit Card: Instant'}</td></tr>
            <tr><th>${isJa?'返品':'Returns'}</th><td>${isJa?'デジタル商品の為不可':'No refunds for digital goods'}</td></tr>
        </table>
    `;

    document.getElementById('terms-content').innerHTML = `<h5>Terms of Service</h5><p>Redistribution of any assets provided by SHINONOI DEPOT is strictly prohibited. Violation will result in legal action.</p>`;
    document.getElementById('privacy-content').innerHTML = `<h5>Privacy Policy</h5><p>We use your data only for transaction and delivery purposes. No third-party sharing.</p>`;
}

function action(id) {
    const p = products.find(x => x.id === id);
    if(p.type === 'inv') { activeInviteId = id; showPage('invite-auth'); }
    else { addToCart(p); }
}

function verifyInvite() {
    const p = products.find(x => x.id === activeInviteId);
    if(document.getElementById('inviteInput').value === p.code) {
        addToCart(p); showPage('home');
    } else { alert("Invalid Code"); }
}

function addToCart(p) {
    if(p.type === 'lim' && p.stock <= 0) return alert("Sold Out");
    cart.push(p); saveCart();
}

function saveCart() {
    localStorage.setItem('s_cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    document.getElementById('cartCount').textContent = cart.length;
    document.getElementById('cartItems').innerHTML = cart.map((item, i) => `
        <div class="d-flex justify-content-between mb-2 p-2 bg-light rounded">
            <span class="small fw-bold">${item.name[lang]}</span>
            <span>¥${item.price.toLocaleString()} <i class="bi bi-x text-danger" onclick="remove(${i})"></i></span>
        </div>
    `).join('');
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cartTotal').textContent = `¥${total.toLocaleString()}`;
}

function remove(i) { cart.splice(i, 1); saveCart(); }

// Stripe Checkout 連携
async function startCheckout() {
    if(cart.length === 0) return;
    const btn = document.getElementById('checkoutBtn');
    btn.disabled = true;
    btn.textContent = "PROCESSING...";

    // 本来はサーバーサイドでSession IDを生成しますが、ここではフロントエンドの動きを再現
    // 実際には fetch('/create-checkout-session') 等を呼び出します
    alert("Stripe Checkout Redirect Simulation\n(サーバー連携が必要です)");
    
    // 成功時シミュレーション
    cart = []; saveCart();
    btn.disabled = false;
    btn.textContent = "PAY WITH STRIPE";
}

renderAll();
