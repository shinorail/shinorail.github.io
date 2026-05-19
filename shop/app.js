/**
 * SHINONOI DEPOT - Logic Core
 */

const app = {
    lang: localStorage.getItem('depot_lang') || 'ja',
    cart: JSON.parse(localStorage.getItem('depot_cart')) || [],
    activeInviteId: null,

    // 多言語辞書
    i18n: {
        ja: {
            nav_home: "ホーム", nav_catalog: "配布物一覧", nav_guide: "ご利用ガイド", nav_contact: "お問い合わせ",
            nav_legal: "特定商取引法", nav_terms: "利用規約", nav_cart: "リスト", hero_h: "デジタル資産ライブラリ",
            hero_p: "クリエイティブと技術の資産を無償提供します", auth_title: "招待制アクセス", 
            auth_desc: "このコンテンツには招待コードが必要です", auth_unlock: "解除", dl_btn: "一括ダウンロード",
            type_dl: "FREE DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
        },
        en: {
            nav_home: "Home", nav_catalog: "Catalog", nav_guide: "Guide", nav_contact: "Contact",
            nav_legal: "Legal Notice", nav_terms: "Terms", nav_cart: "List", hero_h: "Digital Asset Library",
            hero_p: "Providing high-quality engineering assets for free.", auth_title: "Exclusive Access",
            auth_desc: "Invitation code required for this content.", auth_unlock: "Unlock", dl_btn: "Bulk Download",
            type_dl: "FREE DOWNLOAD", type_lim: "LIMITED", type_inv: "EXCLUSIVE"
        }
    },

    // アイテムデータ
    products: [
        { id: 1, type: "dl", name: {ja:"開発コアテンプレート v2", en:"Dev Core v2"}, featured: true, stock: 999 },
        { id: 2, type: "lim", name: {ja:"シリアル生成エンジン", en:"Serial Generator"}, featured: true, stock: 5 },
        { id: 3, type: "inv", name: {ja:"秘密のUIキット", en:"Secret UI Kit"}, featured: false, code: "DEPOT2026" }
    ],

    init() {
        this.render();
        this.registerSW();
        window.navigateTo = (id) => this.showView(id);
    },

    registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => console.error(err));
        }
    },

    showView(viewId) {
        document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.classList.add('active');
        
        // サイドメニューを閉じる
        const sideNav = document.getElementById('sideNavigation');
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(sideNav);
        if(bsOffcanvas) bsOffcanvas.hide();
        window.scrollTo(0,0);
    },

    toggleLanguage() {
        this.lang = this.lang === 'ja' ? 'en' : 'ja';
        localStorage.setItem('depot_lang', this.lang);
        this.render();
    },

    render() {
        // テキスト翻訳
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            el.textContent = this.i18n[this.lang][key];
        });
        document.getElementById('langBtn').textContent = this.lang === 'ja' ? 'ENGLISH' : '日本語';

        // 商品描画ロジック
        const createCard = (p) => `
            <div class="col-6 col-md-4 col-lg-3">
                <article class="item-card d-flex flex-column">
                    <div class="item-img">
                        <span class="item-badge">${this.i18n[this.lang]['type_'+p.type]}</span>
                        <i class="bi bi-file-earmark-zip display-3 text-secondary"></i>
                    </div>
                    <div class="p-3 flex-grow-1">
                        <h3 class="h6 fw-bold mb-3">${p.name[this.lang]}</h3>
                        <button class="btn btn-dark btn-sm w-100 rounded-pill py-2" onclick="app.handleItemAction(${p.id})">
                            ${p.type === 'inv' ? 'UNLOCK' : 'ADD TO LIST'}
                        </button>
                    </div>
                </article>
            </div>
        `;

        document.getElementById('featuredItems').innerHTML = this.products.filter(p => p.featured).map(createCard).join('');
        document.getElementById('allProductGrid').innerHTML = this.products.map(createCard).join('');

        // 法務・ガイド情報の注入
        this.renderDocs();
        this.updateCartUI();
    },

    renderDocs() {
        const isJa = this.lang === 'ja';
        document.getElementById('guideText').innerHTML = `
            <h4 class="fw-bold mb-3">${isJa?'配布物の取り扱い':'Usage'}</h4>
            <p class="small text-muted">${isJa?'当サイトの資産は商用・非商用を問わず自由にご利用いただけますが、再配布のみ禁止しております。':'Free to use for commercial/non-commercial projects. Redistribution is prohibited.'}</p>
        `;

        document.getElementById('legalContent').innerHTML = `
            <table class="legal-table">
                <tr><th>${isJa?'運営':'Provider'}</th><td>SHINONOI DEPOT</td></tr>
                <tr><th>${isJa?'連絡先':'Contact'}</th><td>support@shinonoi-depot.jp</td></tr>
                <tr><th>${isJa?'提供時期':'Delivery'}</th><td>${isJa?'即時':'Immediate download'}</td></tr>
            </table>
        `;

        document.getElementById('termsContent').innerHTML = `
            <div class="small">
                <h6>第1条（目的）</h6><p>本規約は、利用者が本サービスを安全に利用するための条件を定めます。</p>
                <h6>第2条（知的財産権）</h6><p>提供される資産の権利は当方に帰属しますが、利用者は許諾範囲内で自由に使用できます。</p>
            </div>
        `;
    },

    handleItemAction(id) {
        const p = this.products.find(x => x.id === id);
        if(p.type === 'inv') {
            this.activeInviteId = id;
            this.showView('auth');
        } else {
            this.addToCart(p);
        }
    },

    verifyCode() {
        const p = this.products.find(x => x.id === this.activeInviteId);
        const input = document.getElementById('inviteCode').value;
        if(input === p.code) {
            this.addToCart(p);
            this.showView('catalog');
            document.getElementById('inviteCode').value = '';
        } else {
            alert('Invalid Invitation Code');
        }
    },

    addToCart(p) {
        if(this.cart.some(item => item.id === p.id)) return;
        this.cart.push(p);
        this.saveCart();
        new bootstrap.Offcanvas(document.getElementById('cartDrawer')).show();
    },

    saveCart() {
        localStorage.setItem('depot_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    },

    updateCartUI() {
        document.getElementById('cartBadge').textContent = this.cart.length;
        document.getElementById('cartItems').innerHTML = this.cart.map((item, idx) => `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded-3">
                <span class="small fw-bold">${item.name[this.lang]}</span>
                <i class="bi bi-x-circle text-danger" role="button" onclick="app.removeFromCart(${idx})"></i>
            </div>
        `).join('');
    },

    removeFromCart(idx) {
        this.cart.splice(idx, 1);
        this.saveCart();
    },

    processDownload() {
        if(this.cart.length === 0) return;
        alert(this.lang === 'ja' ? 'ダウンロードを開始します。' : 'Preparing downloads...');
        this.cart = [];
        this.saveCart();
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
