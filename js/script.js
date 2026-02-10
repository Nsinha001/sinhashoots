// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Lightbox Gallery Functionality with Protection
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('.placeholder-img');
            if (imgElement && lightbox && lightboxImage) {
                // Copy the background style to lightbox
                const bgStyle = imgElement.style.background;
                lightboxImage.style.background = bgStyle;
                lightboxImage.style.width = '800px';
                lightboxImage.style.height = '600px';
                lightboxImage.style.borderRadius = '10px';
                
                // Show lightbox
                lightbox.classList.add('active');
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Close lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Disable right-click on lightbox
    lightbox.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Disable common screenshot shortcuts
    lightbox.addEventListener('keydown', (e) => {
        // Prevent Print Screen, Ctrl+P, Cmd+P, Ctrl+S, Cmd+S
        if (
            e.key === 'PrintScreen' ||
            (e.ctrlKey && (e.key === 'p' || e.key === 's')) ||
            (e.metaKey && (e.key === 'p' || e.key === 's'))
        ) {
            e.preventDefault();
            return false;
        }
        // Close on Escape
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Disable right-click on all gallery images
document.querySelectorAll('.gallery-item, .placeholder-img').forEach(item => {
    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Disable dragging
    item.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
});

// Disable keyboard shortcuts for saving
document.addEventListener('keydown', (e) => {
    // Disable Ctrl+S, Cmd+S on images
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.closest('.gallery-item') || 
            activeElement.closest('.lightbox')
        )) {
            e.preventDefault();
            return false;
        }
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission (in a real scenario, you'd send this to a server)
        console.log('Form submitted:', data);

        // Show success message
        formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        formMessage.className = 'form-message success';

        // Reset form
        contactForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    });
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all gallery items and service cards
document.querySelectorAll('.gallery-item, .service-card, .stat-item').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// Add active state to current page in navigation
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});
