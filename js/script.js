// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    const headerUl = document.querySelector('header .header-nav ul.header-buttons');
    const header = document.querySelector('header');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (headerUl) {
        headerUl.classList.toggle('active');
    }
    if (header) {
        header.classList.toggle('nav-open');
    }
    if (toggleBtn) {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', (!expanded).toString());
    }
    // After opening/closing, position the nav to the toggle (if open)
    requestAnimationFrame(() => positionNavToToggle());
}

// Position the header nav so it appears anchored to the menu toggle button
function positionNavToToggle() {
    const header = document.querySelector('header');
    const headerNav = document.querySelector('header .header-nav');
    const headerUl = document.querySelector('header .header-nav ul.header-buttons');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (!header || !headerNav || !headerUl || !toggleBtn) return;

    // On small screens use the full-width CSS behavior (do not reposition)
    if (window.matchMedia('(max-width: 768px)').matches) {
        headerNav.style.left = '';
        headerNav.style.right = '';
        headerNav.style.top = '';
        return;
    }

    // Only position when menu is open
    const isOpen = headerUl.classList.contains('active') || header.classList.contains('nav-open');
    if (!isOpen) return;

    // Wait a frame so styles are applied and sizes are measurable
    requestAnimationFrame(() => {
        const headerRect = header.getBoundingClientRect();
        const toggleRect = toggleBtn.getBoundingClientRect();
        const navRect = headerNav.getBoundingClientRect();

        // Center the nav under the toggle button (clamped inside header)
        const toggleCenter = (toggleRect.left - headerRect.left) + (toggleRect.width / 2);
        let left = Math.round(toggleCenter - navRect.width / 2);
        const margin = 8; // minimal margin from header edges
        const maxLeft = header.clientWidth - navRect.width - margin;
        let clampedLeft = Math.max(margin, Math.min(left, maxLeft));

        headerNav.style.left = clampedLeft + 'px';
        headerNav.style.top = (toggleRect.bottom - headerRect.top + 6) + 'px';
        headerNav.style.right = 'auto';
    });
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const toggle = document.querySelector('.menu-toggle');
    const headerUl = document.querySelector('header .header-nav ul.header-buttons');
    const header = document.querySelector('header');
    if (toggle && headerUl && !toggle.contains(event.target) && !headerUl.contains(event.target)) {
        headerUl.classList.remove('active');
        if (header) header.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        const headerNav = document.querySelector('header .header-nav');
        if (headerNav) {
            headerNav.style.left = '';
            headerNav.style.top = '';
            headerNav.style.right = '';
        }
    }
});

// Close menu when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        const headerUl = document.querySelector('header .header-nav ul.header-buttons');
        const header = document.querySelector('header');
        const toggle = document.querySelector('.menu-toggle');
        if (headerUl) headerUl.classList.remove('active');
        if (header) header.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        const headerNav = document.querySelector('header .header-nav');
        if (headerNav) {
            headerNav.style.left = '';
            headerNav.style.top = '';
            headerNav.style.right = '';
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards for animation
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== ACTIVE NAV HIGHLIGHT =====
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Reposition dropdown on resize so it stays anchored to the toggle
window.addEventListener('resize', function() {
    positionNavToToggle();
});

// ===== ADD ACTIVE CLASS STYLING =====
const style = document.createElement('style');
style.innerHTML = `
    nav a.active {
        color: var(--primary-yellow);
    }
    
    nav a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Set initial body opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
