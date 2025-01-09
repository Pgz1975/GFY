document.addEventListener('DOMContentLoaded', function() {
    // Add menu toggle button to nav with animation states
    const nav = document.querySelector('.main-nav');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-toggle');
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    menuButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
             style="transition: transform 0.3s ease">
            <line x1="3" y1="12" x2="21" y2="12" style="transform-origin: center"></line>
            <line x1="3" y1="6" x2="21" y2="6" style="transform-origin: center"></line>
            <line x1="3" y1="18" x2="21" y2="18" style="transform-origin: center"></line>
        </svg>
    `;
    nav.appendChild(menuButton);

    // Mobile menu functionality with improved animations
    const navLinks = document.querySelector('.nav-links');
    const navItems = navLinks.querySelectorAll('li');
    let isMenuOpen = false;

    // Add index to nav items for staggered animation
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index + 1);
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuButton.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const lines = menuButton.querySelectorAll('line');
        if (isMenuOpen) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle keyboard navigation
    nav.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // Smooth scrolling for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (isMenuOpen) {
                    toggleMenu();
                }
            }
        });
    });

    // Enhanced form handling with validation and animations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        const button = form.querySelector('button');
        let isSubmitting = false;

        // Add floating label effect
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.classList.remove('focused');
                }
            });

            // Maintain focused class if input has value
            if (input.value) {
                input.classList.add('focused');
            }
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (isSubmitting) return;

            // Validate form
            let isValid = true;
            let firstInvalid = null;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    if (!firstInvalid) firstInvalid = input;

                    // Show error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    input.parentNode.appendChild(errorMsg);

                    // Remove error on input
                    input.addEventListener('input', function() {
                        this.classList.remove('error');
                        const errorMsg = this.parentNode.querySelector('.error-message');
                        if (errorMsg) errorMsg.remove();
                    }, { once: true });
                }

                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                        if (!firstInvalid) firstInvalid = input;

                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Please enter a valid email address';
                        input.parentNode.appendChild(errorMsg);
                    }
                }
            });

            if (!isValid) {
                firstInvalid.focus();
                return;
            }

            // Show loading state
            isSubmitting = true;
            button.classList.add('submitting');
            const originalText = button.textContent;
            button.innerHTML = `
                <span class="loading-text">Sending...</span>
                <span class="success-text">Success!</span>
            `;

            try {
                // Simulate form submission (replace with actual form handling)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success state
                button.classList.add('success');
                form.reset();

                // Reset button state after delay
                setTimeout(() => {
                    button.classList.remove('submitting', 'success');
                    button.textContent = originalText;
                    isSubmitting = false;
                }, 2000);

                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = form.classList.contains('newsletter-form') ? 
                    'Thank you for subscribing!' : 'Message sent successfully!';
                form.appendChild(successMsg);

                setTimeout(() => {
                    successMsg.remove();
                }, 3000);

            } catch (error) {
                // Handle error
                button.classList.remove('submitting');
                button.textContent = originalText;
                isSubmitting = false;

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'An error occurred. Please try again.';
                form.appendChild(errorMsg);

                setTimeout(() => {
                    errorMsg.remove();
                }, 3000);
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on element index
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate numbers in stats
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Observe stats for animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target;
                const endValue = parseFloat(statValue.textContent);
                animateValue(statValue, 0, endValue, 2000);
                statsObserver.unobserve(statValue);
            }
        });
    }, { threshold: 0.5 });

    // Observe all sections, features, and stats
    document.querySelectorAll('section, .feature, .service').forEach(
        (element, index) => {
            element.style.opacity = '0';
            observer.observe(element);
        }
    );

    document.querySelectorAll('.stat h3').forEach(stat => {
        stat.dataset.value = stat.textContent;
        statsObserver.observe(stat);
    });

    // Smooth parallax effect for sections
    const parallaxSections = document.querySelectorAll('.sustainability, .ai-education');
    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            if (section.getBoundingClientRect().top < window.innerHeight && 
                section.getBoundingClientRect().bottom > 0) {
                section.style.backgroundPosition = `center ${rate}px`;
            }
        });
    }, { passive: true });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.backgroundPositionY = `${rate}px`;
        }, { passive: true });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        // Prevent animation during resize
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
});
