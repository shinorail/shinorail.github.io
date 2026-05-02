document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('js-nav');
    const hamburger = document.getElementById('js-hamburger');

    const menuItems = [
        { name: 'HOME', url: 'index.html' },
        { name: 'ABOUT', url: 'about.html' },
        { name: 'SERVICES', url: 'services.html' },
        { name: 'WORKS', url: 'works.html' }
    ];

    const navUl = document.createElement('ul');
    navUl.className = 'nav-links';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.name;
        
        // 現在のページハイライト
        if (window.location.pathname.endsWith(item.url)) {
            a.style.color = 'var(--accent-green)';
            a.style.fontWeight = 'bold';
        }

        li.appendChild(a);
        navUl.appendChild(li);
    });

    navContainer.appendChild(navUl);

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navUl.classList.toggle('active');
    });
});
