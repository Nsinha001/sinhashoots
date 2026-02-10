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

// Load uploaded photos from localStorage and add to portfolio
document.addEventListener('DOMContentLoaded', () => {
    loadUploadedPhotos();
});

// Helper function to validate data URL
function isValidDataUrl(url) {
    return typeof url === 'string' && url.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/);
}

function loadUploadedPhotos() {
    let photos = [];
    try {
        const data = JSON.parse(localStorage.getItem('portfolioPhotos') || '[]');
        // Validate that data is an array
        if (Array.isArray(data)) {
            // Filter and validate each photo object including data URL validation
            photos = data.filter(p => 
                p && typeof p === 'object' && 
                p.id && p.title && p.category && p.imageData &&
                isValidDataUrl(p.imageData)
            );
        }
    } catch (e) {
        console.error('Error loading photos from localStorage:', e);
        photos = [];
    }
    
    if (photos.length === 0) return;

    // Map category names to gallery sections
    const categoryMap = {
        'portrait': 'Portrait Photography',
        'wedding': 'Wedding & Events',
        'landscape': 'Landscape & Nature',
        'commercial': 'Commercial & Product'
    };

    // Find all gallery sections and add uploaded photos
    Object.keys(categoryMap).forEach(category => {
        const categoryPhotos = photos.filter(p => p.category === category);
        
        if (categoryPhotos.length > 0) {
            // Find the section with this category title
            const sections = document.querySelectorAll('.gallery-section');
            sections.forEach(section => {
                const title = section.querySelector('.gallery-section-title');
                if (title && title.textContent.includes(categoryMap[category])) {
                    const grid = section.querySelector('.gallery-grid');
                    if (grid) {
                        // Add uploaded photos to this gallery
                        categoryPhotos.forEach(photo => {
                            const photoItem = document.createElement('div');
                            photoItem.className = 'gallery-item';
                            photoItem.setAttribute('data-img', `uploaded-${photo.id}`);
                            photoItem.innerHTML = `
                                <div class="placeholder-img uploaded-img" style="background-image: url('${photo.imageData}'); background-size: cover; background-position: center;"></div>
                                <div class="item-overlay">
                                    <h3>${photo.title}</h3>
                                    <p>${photo.description || 'Click to view'}</p>
                                </div>
                                <div class="watermark">© Sinha Shoots</div>
                            `;
                            grid.appendChild(photoItem);
                            
                            // Add click handler for lightbox
                            photoItem.addEventListener('click', () => {
                                const imgElement = photoItem.querySelector('.placeholder-img');
                                const lightbox = document.getElementById('lightbox');
                                const lightboxImage = document.getElementById('lightboxImage');
                                
                                if (imgElement && lightbox && lightboxImage) {
                                    // For uploaded images, validate and use the actual image
                                    if (isValidDataUrl(photo.imageData)) {
                                        // Safely escape single quotes in data URL for CSS
                                        const safeDataUrl = photo.imageData.replace(/'/g, "\\'");
                                        lightboxImage.style.backgroundImage = `url('${safeDataUrl}')`;
                                        lightboxImage.style.backgroundSize = 'contain';
                                        lightboxImage.style.backgroundRepeat = 'no-repeat';
                                        lightboxImage.style.backgroundPosition = 'center';
                                        lightboxImage.style.width = '800px';
                                        lightboxImage.style.height = '600px';
                                        lightboxImage.style.borderRadius = '10px';
                                        
                                        lightbox.classList.add('active');
                                        document.body.style.overflow = 'hidden';
                                    }
                                }
                            });
                            
                            // Disable right-click and dragging
                            photoItem.addEventListener('contextmenu', (e) => {
                                e.preventDefault();
                                return false;
                            });
                            photoItem.addEventListener('dragstart', (e) => {
                                e.preventDefault();
                                return false;
                            });
                        });
                    }
                }
            });
        }
    });
}

// Add active state to current page in navigation
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});
