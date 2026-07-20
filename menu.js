/* ==========================================================================
   篠ノ井乗務区 S.R.C.C. Official Navigation Script (menu.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // --- 全ページ共通メニュー ---
    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'SERVICES', url: 'services.html' },
        { name: 'WORKS', url: 'works.html' },
        { name: 'LINKS', url: 'links.html' },
        { name: '📄 DOCUMENTS', url: 'documents/' },
        { name: '🔐 MEMBER', url: 'member/' }
    ];

    if (!navContainer) return;

    const navUl = document.createElement('ul');
    navUl.className = 'nav-links';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.name;

        const currentPath = window.location.pathname;
        const isHome = (currentPath === '/' || currentPath.endsWith('index.html'));

        if (isHome && item.url === 'index.html') {
            a.classList.add('active-page');
        } else if (currentPath.endsWith(item.url)) {
            a.classList.add('active-page');
        }

        li.appendChild(a);
        navUl.appendChild(li);
    });

    navContainer.appendChild(navUl);

    // --- ハンバーガー開閉 ---
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
});

/* --- スクロールフェードイン --- */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

/* --- ローディング解除 --- */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => loader.classList.add('loader-fadeout'), 1200);
    }
});
