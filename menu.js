/* 篠ノ井乗務区 S.R.C.C. Official Navigation Script (menu.js) */

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // --- 全ページ共通メニュー（GitHub Pages対応のため相対パスに変更） ---
const menuItems = [
    { name: 'HOME', url: 'index.html' },
    { name: 'ABOUT', url: 'about.html' },
    { name: 'SERVICES', url: 'services.html' },
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

        const currentPath = window.location.pathname;

        menuItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.name;

            // アクティブページの判定ロジック修正
            const isHome = (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html'));

            if (isHome && item.url === 'index.html') {
                a.classList.add('active-page');
            } else if (!isHome && currentPath.includes(item.url)) {
                a.classList.add('active-page');
            }

            li.appendChild(a);
            navUl.appendChild(li);
        });

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
        }
    }
});

/* スクロールフェードイン */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

/* ローディング解除（CSSの loaded / loader-fadeout の両方に対応） */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
            loader.classList.add('loader-fadeout');
        }, 500);
    }
});

/* 全ページ強制メンテナンスモード */
const maintenanceMode = false; // ← メンテナンス中は true / 通常は false

if (maintenanceMode) {
    const current = window.location.pathname;
    if (!current.endsWith("maintenance.html")) {
        window.location.replace("maintenance.html");
    }
}