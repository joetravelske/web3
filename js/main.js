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

// Web3Forms Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = this.querySelector('button[type="submit"]');
        const submitText = this.querySelector('.submit-text');
        const loadingText = this.querySelector('.loading-text');
        const resultDiv = document.getElementById('form-result');
        
        // Clear previous result
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
        }
        
        // Validate required fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        let isValid = true;
        
        // Simple validation
        [nameField, emailField, messageField].forEach(field => {
            if (field && (!field.value || field.value.trim() === '')) {
                isValid = false;
                field.classList.add('error');
            }
        });
        
        if (!isValid) {
            // Show error message
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div style="color: #e74c3c; background: #fdf2f2; padding: 1rem; border-radius: 8px; text-align: center; border-left: 4px solid #e74c3c;">
                        <p style="margin: 0;">Please fill in all required fields marked with *</p>
                    </div>
                `;
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline';
        }
        
        try {
            // Prepare form data
            const formData = new FormData(this);
            
            // Add additional information
            formData.append('website', 'Joeventure Tours');
            formData.append('page_url', window.location.href);
            
            // Set replyto to the submitted email
            if (emailField && emailField.value) {
                formData.set('replyto', emailField.value);
            }
            
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            // Show result message
            if (resultDiv) {
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    // Success
                    resultDiv.innerHTML = `
                        <div style="color: #27ae60; background: #f3faf7; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #27ae60;">
                            <h4 style="margin-bottom: 0.5rem; color: #27ae60;">🎉 Message Sent Successfully!</h4>
                            <p>Thank you for your inquiry. <strong>Joe will personally respond within 24 hours.</strong></p>
                            <p style="font-size: 0.9rem; margin-top: 1rem;">
                                You'll also receive a copy of this message at the email you provided.
                            </p>
                        </div>
                    `;
                    
                    // Reset form
                    this.reset();
                    
                    // Track successful submission in Google Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'submit', {
                            'event_category': 'contact',
                            'event_label': 'web3forms_success',
                            'value': 1
                        });
                    }
                } else {
                    // Error
                    resultDiv.innerHTML = `
                        <div style="color: #e74c3c; background: #fdf2f2; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #e74c3c;">
                            <h4 style="margin-bottom: 0.5rem; color: #e74c3c;">❌ Something Went Wrong</h4>
                            <p>${result.message || 'Please try again or contact Joe directly via WhatsApp.'}</p>
                            <p style="font-size: 0.9rem; margin-top: 1rem;">
                                You can also reach Joe directly at <strong>+254 705 924974</strong>
                            </p>
                        </div>
                    `;
                    
                    // Track failed submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'exception', {
                            'event_category': 'contact',
                            'event_label': 'web3forms_error',
                            'value': 1
                        });
                    }
                }
                
                // Scroll to result
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div style="color: #e74c3c; background: #fdf2f2; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #e74c3c;">
                        <h4 style="margin-bottom: 0.5rem; color: #e74c3c;">⚠️ Network Error</h4>
                        <p>Unable to send message. Please try again or contact Joe directly via WhatsApp.</p>
                        <p style="margin-top: 1rem;">
                            <a href="https://wa.me/254705924974?text=Hi%20Joe!%20I%20tried%20to%20contact%20you%20via%20your%20website" 
                               class="btn btn-primary" 
                               style="padding: 0.5rem 1rem; font-size: 0.9rem; display: inline-block;">
                                💬 Chat on WhatsApp Instead
                            </a>
                        </p>
                    </div>
                `;
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (loadingText) loadingText.style.display = 'none';
            }
        }
    });
    
    // Add CSS animation for loading spinner
    if (!document.querySelector('#loading-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            input.error, textarea.error {
                border-color: #e74c3c !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove error class on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const resultDiv = document.getElementById('form-result');
            if (resultDiv) {
                resultDiv.style.display = 'none';
                resultDiv.innerHTML = '';
            }
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