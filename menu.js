const mobileMenu = document.querySelector('.nav-movil');

if (mobileMenu) {
    mobileMenu.querySelectorAll('nav a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.removeAttribute('open');
        });
    });
}
