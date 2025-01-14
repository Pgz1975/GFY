// Cookie Consent Manager
class CookieConsent {
    constructor() {
        this.consentGiven = this.checkCookie('cookie_consent');
        if (!this.consentGiven) {
            this.createBanner();
        }
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience and analyze site usage. 
                   For GDPR compliance, we need your consent to set cookies.</p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="cookie-btn accept">Accept All</button>
                    <button id="reject-cookies" class="cookie-btn reject">Reject Non-Essential</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('accept-cookies').addEventListener('click', () => {
            console.log('Accept button clicked');
            this.acceptCookies();
        });
        document.getElementById('reject-cookies').addEventListener('click', () => {
            console.log('Reject button clicked');
            this.rejectCookies();
        });
    }

    acceptCookies() {
        console.log('Setting cookie...');
        this.setCookie('cookie_consent', 'accepted', 365);
        
        // Enable Google Analytics
        console.log('Enabling Google Analytics...');
        window['ga-disable-G-60PRKVZEXM'] = false;
        
        // Initialize GA if it wasn't already
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }

        // Hide banner with animation
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            
            setTimeout(() => {
                banner.remove();
                console.log('Banner removed after accept');
            }, 300);
        }
    }

    rejectCookies() {
        console.log('Setting rejected cookie...');
        this.setCookie('cookie_consent', 'rejected', 365);
        
        // Disable Google Analytics
        console.log('Disabling Google Analytics...');
        window['ga-disable-G-60PRKVZEXM'] = true;
        
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }

        // Hide banner with animation
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            
            setTimeout(() => {
                banner.remove();
                console.log('Banner removed after reject');
            }, 300);
        }
    }

    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        const cookie = name + '=' + value + expires + '; path=/; SameSite=Strict';
        console.log('Setting cookie:', cookie);
        document.cookie = cookie;
    }

    checkCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        const result = match ? match[2] : null;
        console.log('Checking cookie:', name, 'Result:', result);
        return result;
    }
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing cookie consent...');
    new CookieConsent();
});
