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
    const animateValue = (element, start, end, duration, suffix) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            
            // Format the number based on suffix
            let formattedValue;
            if (suffix === 'M') {
                formattedValue = currentValue.toFixed(1) + suffix;
            } else if (suffix === '%') {
                formattedValue = Math.round(currentValue) + suffix;
            } else {
                formattedValue = Math.round(currentValue);
            }
            
            element.textContent = formattedValue;
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
                const text = statValue.textContent;
                const suffix = text.match(/[M%]/)?.[0] || '';
                const numValue = parseFloat(text.replace(/[M%]/g, ''));
                
                // Store original text for reference
                statValue.dataset.originalText = text;
                
                // Animate from 0 to the target value
                animateValue(statValue, 0, numValue, 2000, suffix);
                statsObserver.unobserve(statValue);
            }
        });
    }, { threshold: 0.5 });

    // Observe all sections, features, stats, and parallax dividers
    document.querySelectorAll('section, .feature, .service, .parallax-divider').forEach(
        (element, index) => {
            element.style.opacity = '0';
            observer.observe(element);
            
            // Add staggered animation delay for parallax content
            if (element.classList.contains('parallax-divider')) {
                const content = element.querySelector('.parallax-content');
                if (content) {
                    content.style.transitionDelay = '0.3s';
                }
            }
        }
    );

    document.querySelectorAll('.stat h3').forEach(stat => {
        stat.dataset.value = stat.textContent;
        statsObserver.observe(stat);
    });

    // Parallax effect for hero and divider sections
    const parallaxElements = document.querySelectorAll('.hero, .parallax-divider');
    
    const applyParallax = () => {
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = element.classList.contains('hero') ? 0.5 : 0.3;
                const yPos = Math.round((rect.top * speed));
                element.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
                
                // Add animation class when element comes into view
                if (!element.classList.contains('animate-in')) {
                    element.classList.add('animate-in');
                }
            }
        });
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(applyParallax);
    }, { passive: true });

    // Initial parallax application
    applyParallax();

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

    // Three.js setup
    let scene, camera, renderer, logo;
    let targetRotation = 0;

    function initThreeJS() {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Add renderer to DOM
        const container = document.getElementById('logo3d-container');
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load logo texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('images/logo_black.png', (texture) => {
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });

            // Create plane geometry for the logo
            const aspect = texture.image.width / texture.image.height;
            const geometry = new THREE.PlaneGeometry(4 * aspect, 4);
            
            // Create mesh
            logo = new THREE.Mesh(geometry, material);
            scene.add(logo);

            // Initial rotation to match BG.png
            logo.rotation.y = Math.PI * 0.15;
        });

        // Handle window resize for 3D scene
        window.addEventListener('resize', onThreeJSResize, false);

        // Add scroll listener for rotation
        window.addEventListener('scroll', onThreeJSScroll, false);

        // Start animation loop
        animate();
    }

    function onThreeJSResize() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function onThreeJSScroll() {
        if (!logo) return;
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Rotation amount: Math.PI * 2 = one full rotation
        // Increase the multiplier for more rotations
        // Use negative value to reverse direction
        targetRotation = Math.PI * 4 * scrollPercent;

        // You can also combine multiple axis rotations
        // targetRotationX = Math.PI * scrollPercent; // Half rotation on X axis
        // targetRotationZ = Math.PI * 0.5 * scrollPercent; // Quarter rotation on Z axis
    }

    function animate() {
        requestAnimationFrame(animate);
        
        if (logo) {
            // Rotation axis: .x, .y, or .z
            // Lerp factor: 0.05 - adjust for different speeds
            // - Higher values (e.g., 0.1) = faster but less smooth
            // - Lower values (e.g., 0.01) = slower but smoother
            logo.rotation.z += (targetRotation - logo.rotation.y) * 0.9;
            
            // Example of multi-axis rotation:
            // logo.rotation.x += (targetRotationX - logo.rotation.x) * 0.05;
            // logo.rotation.z += (targetRotationZ - logo.rotation.z) * 0.05;
        }
        
        renderer.render(scene, camera);
    }

    // Initialize Three.js
    initThreeJS();
});
