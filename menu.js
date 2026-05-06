/* ==========================================================================
   篠ノ井乗務区 S.R.C.C. Official Navigation Script (menu.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // 1. メニューデータ (全ページ一新に合わせたリンク構成)
    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'SERVICES', url: 'services.html' },
        { name: 'WORKS', url: 'works.html' },
        { name: 'LINKS', url: 'links.html' }
    ];

    // 2. メニュー生成
    // ※ navContainerが存在しないページでのエラーを防ぐ
    if (!navContainer) return;

    const navUl = document.createElement('ul');
    navUl.className = 'nav-links';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.name;
        
        // 現在のページ判定ロジック
        const currentPath = window.location.pathname;
        const isHomePage = (currentPath === '/' || currentPath.endsWith('index.html'));
        
        if (isHomePage && item.url === 'index.html') {
            a.classList.add('active-page');
        } else if (currentPath.endsWith(item.url)) {
            a.classList.add('active-page');
        }

        li.appendChild(a);
        navUl.appendChild(li);
    });
    navContainer.appendChild(navUl);

    // 3. 開閉制御関数 (ハンバーガーメニュー用)
    const toggleMenu = () => {
        if (!hamburger) return;
        hamburger.classList.toggle('active');
        navUl.classList.toggle('active');
        
        // メニュー開閉時に背景固定をする場合はここに追加
        if (navUl.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const closeMenu = () => {
        if (!hamburger) return;
        hamburger.classList.remove('active');
        navUl.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // ボタンクリックイベント
    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // イベントの伝搬を止める
            toggleMenu();
        });
    }

    // リンクをクリックしたらメニューを閉じる
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // メニューの外側をクリックしたら閉じる (スマホ時のUX向上)
    document.addEventListener('click', (e) => {
        if (navUl.classList.contains('active')) {
            if (!navContainer.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        }
    });
});
// --- スクロール監視 (Intersection Observer) ---
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

// --- ローディング解除 ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-fadeout');
        }, 1200); // 出発進行を見せる時間
    }
});
