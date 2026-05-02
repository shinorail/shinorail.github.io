document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    // メニュー項目（ここで一括管理）　
    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'ABOUT', url: 'about.html' },
        { name: 'SERVICES', url: 'services.html' },
        { name: 'WORKS', url: 'works.html' }
    ];

    // メニューの組み立て
    const navUl = document.createElement('ul');
    navUl.className = 'nav-links';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.name;
        
        // 現在のページ判定
        if (window.location.pathname.endsWith(item.url)) {
            a.style.color = 'var(--accent-green)';
            a.style.fontWeight = 'bold';
        }

        li.appendChild(a);
        navUl.appendChild(li);
    });

    navContainer.appendChild(navUl);

    // ハンバーガー開閉
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navUl.classList.toggle('active');
    });
});
