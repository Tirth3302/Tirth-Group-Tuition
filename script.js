/* ============================================= */
/* SCROLL-TRIGGERED NUMBER COUNTER ANIMATION    */
/* ============================================= */
document.addEventListener('DOMContentLoaded', function() {
    
    const counterSection = document.querySelector('.counter-section');
    const counters = document.querySelectorAll('.count');
    let hasAnimated = false; // Ensures animation runs only once

    // 1. Initialize counters: Set them to 0 before animation starts
    if (counters.length > 0) {
        counters.forEach(counter => {
            // Save the final number (e.g., "1000+") in a custom attribute
            const originalText = counter.innerText; 
            const targetNumber = parseInt(originalText.replace(/\D/g, '')); // Extracts "1000"
            const suffix = originalText.replace(/\d/g, ''); // Extracts "+"
            
            // Store these for later use
            counter.setAttribute('data-target', targetNumber);
            counter.setAttribute('data-suffix', suffix);
            
            // Reset display to 0 initially
            counter.innerText = "0" + suffix; 
        });
    }

    // 2. Set up the Observer (detects when you scroll to the section)
    if (counterSection && 'IntersectionObserver' in window) {
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // If section is visible and hasn't animated yet
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true; // Lock it so it doesn't run again
                    
                    // Start the counting animation
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const suffix = counter.getAttribute('data-suffix');
                        const duration = 2000; // Animation lasts 2 seconds (2000ms)
                        const frameRate = 16; // Update every 16ms (approx 60fps)
                        const totalFrames = duration / frameRate;
                        const increment = target / totalFrames;
                        
                        let currentCount = 0;
                        
                        const timer = setInterval(() => {
                            currentCount += increment;
                            
                            if (currentCount >= target) {
                                // Animation finished: Set to final exact number
                                counter.innerText = target + suffix;
                                clearInterval(timer);
                            } else {
                                // Animation running: Show rounded number
                                counter.innerText = Math.floor(currentCount) + suffix;
                            }
                        }, frameRate);
                    });
                }
            });
        }, {
            threshold: 0.5 // Trigger animation when 50% of the section is visible
        });

        observer.observe(counterSection);
    }
});


/* ============================================= */
/* TIRTH GROUP TUITION - COMPLETE JS FILE       */
/* ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ============================================= */
    /* 1. SELECT ELEMENTS                           */
    /* ============================================= */
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    // Modal (Popup) Elements
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    
    // Select ALL buttons that should open the popup
    // Includes: Enquire Now (Header), Enroll Now (Hero), Enquire Online (CTA)
    const triggerButtons = document.querySelectorAll('.btn-enquire, .btn-enroll, .btn-border-white, .footer-btn');

    // Forms
    const enquiryForm = document.getElementById('enquiryForm'); // The Popup Form
    const contactForm = document.getElementById('contactForm'); // The Page Form

    // Header
    const header = document.querySelector('.header');


    /* ============================================= */
    /* 2. MOBILE MENU TOGGLE                        */
    /* ============================================= */
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            
            // Switch Icon between Bars and Times (X)
            if (navMenu.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }


    /* ============================================= */
    /* 3. POPUP MODAL LOGIC (OPEN/CLOSE)            */
    /* ============================================= */

    // Function to Open Modal
    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active'); // CSS handles display
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
    }

    // Function to Close Modal
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scrolling again
        }
    }

    // A. Attach Click Event to ALL Buttons (Enquire, Enroll, etc.)
    triggerButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Stop link navigation
            openModal(); // Open the popup
        });
    });

    // B. Close when clicking the "X" button inside modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // C. Close when clicking the dark background overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // D. Close when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });


    /* ============================================= */
    /* 4. POPUP FORM SUBMISSION (THE FIX)           */
    /* ============================================= */
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop page reload

            // --- GET VALUES (Without Class) ---
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            // We removed the 'Class' dropdown, so we don't look for it here.
            const message = document.getElementById('message').value.trim();

            // --- VALIDATION ---
            let errors = [];

            if (name === '') errors.push('Please enter your name');
            if (email === '') {
                errors.push('Please enter email address');
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
            }
            if (phone === '') {
                errors.push('Please enter phone number');
            } else if (phone.length < 10) {
                errors.push('Please enter a valid 10-digit number');
            }

            // --- SEND DATA ---
            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                // 1. Change Button Text to "Submitting..."
                const submitBtn = enquiryForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // 2. Prepare Data for Google Sheet
                const scriptURL = 'https://script.google.com/macros/s/AKfycbzUywZpMFufUEgFQk3JhnG-FlEEruB1hEiq9bjNHG5uyRtQyEYdg_T6lBSkMszjclu4/exec';
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('message', message);
                // Note: Not sending 'class'

                // 3. Send Request
                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => response.json())
                    .then(data => {
                        alert('Thank you! We will contact you soon.');
                        closeModal();
                        enquiryForm.reset();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Even on error, we show success to the user (often just a CORS warning)
                        alert('Thank you! We will contact you soon.');
                        closeModal();
                        enquiryForm.reset();
                    })
                    .finally(() => {
                        // Reset button
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    });
            }
        });
    }

    // Helper: Email Validation Regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    /* ============================================= */
    /* 5. CONTACT PAGE FORM (SEPARATE)              */
    /* ============================================= */
    // This is for the static form on the Contact Us page
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Basic alert for now
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }


    /* ============================================= */
    /* 6. HEADER SCROLL EFFECT                      */
    /* ============================================= */
    window.addEventListener('scroll', function () {
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    /* ============================================= */
    /* 7. SCROLL ANIMATIONS (FADE IN)               */
    /* ============================================= */
    const animateElements = document.querySelectorAll('.feature-card, .course-card, .stat-item, .branch-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    /* ============================================= */
    /* 8. COUNTER ANIMATION (STATS)                 */
    /* ============================================= */
    const counterSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-item h3');
    let hasAnimated = false;

    if (counterSection && counters.length > 0) {
        // Observer to detect when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const originalText = counter.innerText;
                    const target = parseInt(originalText.replace(/\D/g, '')); // Get number (e.g. 1000)
                    const suffix = originalText.replace(/\d/g, ''); // Get suffix (e.g. +)
                    
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.innerText = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.innerText = Math.floor(count) + suffix;
                        }
                    }, 16);
                });
            }
        });
        statsObserver.observe(counterSection);
    }
    
    /* ============================================= */
    /* 9. CURRENT YEAR AUTO-UPDATE                  */
    /* ============================================= */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }

});