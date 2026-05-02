document.addEventListener('DOMContentLoaded', () => {　
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // 1. メニューデータ
    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'ABOUT', url: 'about.html' },
        { name: 'SERVICES', url: 'services.html' },
        { name: 'WORKS', url: 'works.html' }
    ];

    // 2. メニュー生成
    const navUl = document.createElement('ul');
    navUl.className = 'nav-links';
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.name;
        
        // 現在のページ判定
        const currentPath = window.location.pathname;
        if (currentPath.endsWith(item.url) || (currentPath === '/' && item.url === 'index.html')) {
            a.classList.add('active-page');
        }

        li.appendChild(a);
        navUl.appendChild(li);
    });
    navContainer.appendChild(navUl);

    // 3. 開閉制御関数
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navUl.classList.toggle('active');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navUl.classList.remove('active');
    };

    // ボタンクリックイベント
    hamburger.addEventListener('click', toggleMenu);

    // リンクをクリックしたらメニューを閉じる
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // メニューの外側をクリックしたら閉じる (スマホ時のUX向上)
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
});
