/* 篠ノ井乗務区 S.R.C.C. Official Navigation Script (menu.js) */

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // --- 全ページ共通メニュー項目 ---
    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'ABOUT', url: 'about.html' },
        { name: 'SERVICES', url: 'index.html#services' },
        { name: 'WORKS', url: 'works.html' },
        { name: 'LINKS', url: 'links.html' },
    ];

    if (navContainer) {
        // js-nav が ULタグ か NAVタグ かを自動判別して組み立て
        let navUl;
        if (navContainer.tagName === 'UL') {
            navUl = navContainer;
            navUl.innerHTML = '';
        } else {
            navUl = document.createElement('ul');
            navUl.className = 'nav-links';
            navContainer.appendChild(navUl);
        }

        const currentPath = window.location.pathname.split('?')[0].split('#')[0];

        // メニューリンクの生成
        menuItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.name;

            // アクティブページの判定ロジック
            const isHome = (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html'));

            if (isHome && item.url === 'index.html') {
                a.classList.add('active-page');
            } else if (!isHome && item.url.endsWith('.html') && currentPath.includes(item.url)) {
                a.classList.add('active-page');
            }

            li.appendChild(a);
            navUl.appendChild(li);
        });

        // --- CTA (お問い合わせ) ボタンをナビゲーション右端に自動追加 ---
        const ctaLi = document.createElement('li');
        ctaLi.className = 'nav-cta-item';
        const ctaBtn = document.createElement('a');
        ctaBtn.href = 'https://x.com/Shino_Rail';
        ctaBtn.target = '_blank';
        ctaBtn.rel = 'noopener noreferrer';
        ctaBtn.className = 'nav-cta-btn';
        ctaBtn.innerHTML = '<i class="fab fa-x-twitter"></i> CONTACT';
        ctaLi.appendChild(ctaBtn);
        navUl.appendChild(ctaLi);

        // --- ハンバーガー開閉制御 ---
        if (hamburger) {
            const toggleMenu = () => {
                hamburger.classList.toggle('active');
                navUl.classList.toggle('active');
                document.body.style.overflow = navUl.classList.contains('active') ? 'hidden' : 'auto';
            };

            const closeMenu = () => {
                hamburger.classList.remove('active');
                navUl.classList.remove('active');
                document.body.style.overflow = 'auto';
            };

            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            navUl.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            document.addEventListener('click', (e) => {
                if (navUl.classList.contains('active')) {
                    if (!navContainer.contains(e.target) && !hamburger.contains(e.target)) {
                        closeMenu();
                    }
                }
            });

            // Escキーでハンバーガーメニューを閉じる
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navUl.classList.contains('active')) {
                    closeMenu();
                }
            });
        }
    }
});

/* スクロールフェードイン (IntersectionObserver) */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

/* ローディング画面解除（CSSの loaded / loader-fadeout の両方に対応） */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
            loader.classList.add('loader-fadeout');
        }, 500);
    }
});

/* 全ページ強制メンテナンスモード制御 */
const maintenanceMode = false; // ← メンテナンス中は true / 通常は false

if (maintenanceMode) {
    const current = window.location.pathname;
    if (!current.endsWith("maintenance.html")) {
        window.location.replace("maintenance.html");
    }
}
