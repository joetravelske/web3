// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Update URL hash without jumping
            history.pushState(null, null, href);
        }
    });
});

// Hero slider
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
let slideInterval;

function nextSlide() {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function startSlider() {
    if (slides.length > 0) {
        // Clear existing interval if any
        if (slideInterval) clearInterval(slideInterval);
        // Start new interval
        slideInterval = setInterval(nextSlide, 5000);
    }
}

// Initialize slider if slides exist
if (slides.length > 0) {
    startSlider();
    
    // Pause slider on hover for better UX
    const heroSection = document.querySelector('.hero-slider');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            if (slideInterval) clearInterval(slideInterval);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            startSlider();
        });
    }
}

// Simple AOS implementation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Initialize AOS observer
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Form validation for contact page
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        let isValid = true;
        const requiredFields = ['name', 'email', 'message'];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                const input = this.querySelector(`[name="${field}"]`);
                if (input) {
                    input.classList.add('error');
                }
            }
        });
        
        if (!isValid) {
            // Show error message
            const errorDiv = document.getElementById('formError') || document.createElement('div');
            errorDiv.id = 'formError';
            errorDiv.textContent = 'Please fill in all required fields';
            errorDiv.style.cssText = 'color: #e74c3c; background: #fdf2f2; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;';
            
            if (!document.getElementById('formError')) {
                contactForm.insertBefore(errorDiv, contactForm.firstChild);
            }
            return;
        }
        
        // Remove any existing error messages
        const existingError = document.getElementById('formError');
        if (existingError) existingError.remove();
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : 'Submit';
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.id = 'formSuccess';
            successDiv.textContent = 'Thank you! Joe will get back to you within 24 hours.';
            successDiv.style.cssText = 'color: #27ae60; background: #f3faf7; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; font-weight: 600;';
            
            contactForm.innerHTML = '';
            contactForm.appendChild(successDiv);
            
            // Reset button state
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            
            // Track form submission in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'submit', {
                    'event_category': 'contact',
                    'event_label': 'contact_form_submission'
                });
            }
            
        }, 1500);
    });
    
    // Remove error class on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorDiv = document.getElementById('formError');
            if (errorDiv) errorDiv.remove();
        });
    });
}

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');
if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;
            
            lightbox.innerHTML = `
                <div class="lightbox-content" style="position: relative; max-width: 90%; max-height: 90%;">
                    <span class="lightbox-close" style="position: absolute; top: -50px; right: 0; color: white; font-size: 3rem; cursor: pointer; font-weight: 300; line-height: 1;">&times;</span>
                    <img src="${this.src}" alt="${this.alt}" style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 10px;">
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Add CSS animation if not already in stylesheet
            if (!document.querySelector('#lightbox-animation')) {
                const style = document.createElement('style');
                style.id = 'lightbox-animation';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Close on X click
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            });
            
            // Close on background click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
            });
            
            // Close on Escape key
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
    });
}

// Package card interactions
const packageCards = document.querySelectorAll('.package-card');
if (packageCards.length > 0) {
    packageCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking a link
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const link = this.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });
}

// WhatsApp float button hover effect
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    whatsappFloat.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Track WhatsApp clicks in Google Analytics
    whatsappFloat.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'engagement',
                'event_label': 'whatsapp_button',
                'value': 1
            });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearSpans = document.querySelectorAll('.current-year');
    if (yearSpans.length > 0) {
        const currentYear = new Date().getFullYear();
        yearSpans.forEach(span => {
            span.textContent = currentYear;
        });
    }
    
    // Add loading class to body and remove after load
    document.body.classList.add('page-loading');
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('page-loading');
        }, 300);
    });
});