// =======================
// Preloader — hide on full page load
// =======================
window.addEventListener('load', function () {
    var preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(function () {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.querySelector('.scroll-progress');

    // =======================
    // Mobile menu toggle
    // =======================
    menuToggle.addEventListener('click', function () {
        const isOpen = header.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label',
            isOpen ? 'Закрити меню навігації' : 'Відкрити меню навігації'
        );
    });

    // Close mobile menu when link clicked
    document.querySelectorAll('#main-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            header.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Відкрити меню навігації');
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('menu-open')) {
            header.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Відкрити меню навігації');
            menuToggle.focus();
        }
    });

    // Close menu on click outside
    document.addEventListener('click', function (e) {
        if (header.classList.contains('menu-open') &&
            !header.contains(e.target)) {
            header.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Відкрити меню навігації');
        }
    });

    // =======================
    // Sticky header + back-to-top visibility
    // =======================
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop;

                // Sticky header styling
                if (scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Back to top button visibility
                if (backToTop) {
                    if (scrollY > 400) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }

                // Scroll progress bar
                if (scrollProgress) {
                    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
                    scrollProgress.style.width = progress + '%';
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Back to top button click
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =======================
    // Active nav link highlighting
    // =======================
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#main-nav a');

    function updateActiveLink() {
        var scrollPos = window.pageYOffset + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'true');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', function () {
        window.requestAnimationFrame(updateActiveLink);
    });

    // =======================
    // Portfolio filters with accessibility
    // =======================
    var filterButtons = document.querySelectorAll('.filters button');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active states & aria-pressed
            filterButtons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            var filter = this.getAttribute('data-filter');
            var visibleCount = 0;

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden');
                    item.removeAttribute('aria-hidden');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                    item.setAttribute('aria-hidden', 'true');
                }
            });
        });

        // Keyboard support for filter buttons
        btn.addEventListener('keydown', function (e) {
            var buttons = Array.from(filterButtons);
            var idx = buttons.indexOf(this);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                var next = buttons[(idx + 1) % buttons.length];
                next.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                var prev = buttons[(idx - 1 + buttons.length) % buttons.length];
                prev.focus();
            }
        });
    });

    // =======================
    // Scroll-based animations (Intersection Observer)
    // =======================
    if ('IntersectionObserver' in window) {
        var animateElements = document.querySelectorAll(
            '.gallery-item, .package, .testimonial-card, .about-photo, .about-text, .stat-item, .faq-item'
        );

        animateElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = '';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // =======================
    // Contact form with validation & EmailJS
    // =======================
    var contactForm = document.querySelector('.contact-form');
    var formStatus = document.querySelector('.form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Client-side validation
            var nameField = document.getElementById('name');
            var emailField = document.getElementById('email');
            var messageField = document.getElementById('message');
            var valid = true;

            // Reset previous error states
            [nameField, emailField, messageField].forEach(function (field) {
                field.style.borderColor = '';
                field.removeAttribute('aria-invalid');
            });

            if (!nameField.value.trim()) {
                nameField.style.borderColor = '#f44336';
                nameField.setAttribute('aria-invalid', 'true');
                valid = false;
            }

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.style.borderColor = '#f44336';
                emailField.setAttribute('aria-invalid', 'true');
                valid = false;
            }

            if (!messageField.value.trim()) {
                messageField.style.borderColor = '#f44336';
                messageField.setAttribute('aria-invalid', 'true');
                valid = false;
            }

            if (!valid) {
                showFormStatus('Будь ласка, заповніть всі поля коректно.', 'error');
                return;
            }

            // Disable button during submission
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Надсилаю…';

            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm(
                    'service_jwln1xk',
                    'template_l4dqdrq',
                    this
                ).then(function () {
                    showFormStatus('Дякуємо! Ваше повідомлення надіслано.', 'success');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Надіслати';
                }, function () {
                    showFormStatus('Виникла помилка відправки. Спробуйте ще раз.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Надіслати';
                });
            } else {
                showFormStatus('Сервіс відправки недоступний. Зв\'яжіться з нами напряму.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Надіслати';
            }
        });

        // Real-time validation on blur
        contactForm.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('blur', function () {
                if (this.required && !this.value.trim()) {
                    this.style.borderColor = '#f44336';
                    this.setAttribute('aria-invalid', 'true');
                } else if (this.type === 'email' && this.value.trim()) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value.trim())) {
                        this.style.borderColor = '#f44336';
                        this.setAttribute('aria-invalid', 'true');
                    } else {
                        this.style.borderColor = '#4caf50';
                        this.removeAttribute('aria-invalid');
                    }
                } else {
                    this.style.borderColor = '#4caf50';
                    this.removeAttribute('aria-invalid');
                }
            });
        });
    }

    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
            setTimeout(function () {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    // =======================
    // Light/Dark Mode Toggle
    // =======================
    var savedTheme = localStorage.getItem('theme');

    // Respect system preference if no saved theme
    if (!savedTheme) {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }
    } else if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.checked = true;
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.checked = false;
            }
        }
    });

    // =======================
    // Lightbox gallery
    // =======================
    (function initLightbox() {
        var lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;

        var lightboxImg = lightbox.querySelector('.lightbox-content img');
        var lightboxCaption = lightbox.querySelector('.lightbox-caption');
        var lightboxCounter = lightbox.querySelector('.lightbox-counter');
        var closeBtn = lightbox.querySelector('.lightbox-close');
        var prevBtn = lightbox.querySelector('.lightbox-prev');
        var nextBtn = lightbox.querySelector('.lightbox-next');
        var currentIndex = 0;
        var visibleItems = [];

        function getVisibleGalleryItems() {
            return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
        }

        function openLightbox(index) {
            visibleItems = getVisibleGalleryItems();
            if (index < 0 || index >= visibleItems.length) return;
            currentIndex = index;

            var item = visibleItems[currentIndex];
            var img = item.querySelector('img');
            var overlay = item.querySelector('.gallery-overlay span');

            // Use largest src available
            var src = img.currentSrc || img.src;
            lightboxImg.src = src;
            lightboxImg.alt = img.alt;

            if (lightboxCaption) {
                lightboxCaption.textContent = overlay ? overlay.textContent : img.alt;
            }
            if (lightboxCounter) {
                lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
            }

            lightbox.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.setAttribute('hidden', '');
            document.body.style.overflow = '';
            // Return focus to the gallery item
            if (visibleItems[currentIndex]) {
                visibleItems[currentIndex].focus();
            }
        }

        function navigate(dir) {
            visibleItems = getVisibleGalleryItems();
            currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
            var item = visibleItems[currentIndex];
            var img = item.querySelector('img');
            var overlay = item.querySelector('.gallery-overlay span');

            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) lightboxCaption.textContent = overlay ? overlay.textContent : img.alt;
            if (lightboxCounter) lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
        }

        // Bind gallery item clicks & keyboard
        document.querySelectorAll('.gallery-item').forEach(function (item) {
            function handleOpen() {
                var visible = getVisibleGalleryItems();
                var idx = visible.indexOf(item);
                if (idx !== -1) openLightbox(idx);
            }
            item.addEventListener('click', handleOpen);
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpen();
                }
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', function () { navigate(-1); });
        nextBtn.addEventListener('click', function () { navigate(1); });

        // Keyboard navigation inside lightbox
        lightbox.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') navigate(-1);
            else if (e.key === 'ArrowRight') navigate(1);
        });

        // Close on backdrop click
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    })();

    // =======================
    // Stats counter animation
    // =======================
    if ('IntersectionObserver' in window) {
        var statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length) {
            var statsObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var target = parseInt(el.getAttribute('data-target'), 10);
                        if (isNaN(target)) return;
                        var duration = 2000;
                        var start = 0;
                        var startTime = null;

                        function animate(timestamp) {
                            if (!startTime) startTime = timestamp;
                            var progress = Math.min((timestamp - startTime) / duration, 1);
                            // Ease out cubic
                            var ease = 1 - Math.pow(1 - progress, 3);
                            el.textContent = Math.floor(ease * target);
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                el.textContent = target;
                            }
                        }
                        requestAnimationFrame(animate);
                        statsObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            statNumbers.forEach(function (el) {
                el.textContent = '0';
                statsObserver.observe(el);
            });
        }
    }

    // =======================
    // Instagram carousel arrows
    // =======================
    (function initCarousel() {
        var carousel = document.querySelector('.instagram-carousel');
        if (!carousel) return;

        var grid = carousel.querySelector('.instagram-grid');
        var prevBtn = carousel.querySelector('.carousel-prev');
        var nextBtn = carousel.querySelector('.carousel-next');
        var scrollAmount = 340; // slightly larger than card width + gap

        prevBtn.addEventListener('click', function () {
            grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function () {
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Update button visibility based on scroll position
        function updateButtons() {
            prevBtn.style.opacity = grid.scrollLeft <= 10 ? '0.3' : '1';
            prevBtn.style.pointerEvents = grid.scrollLeft <= 10 ? 'none' : 'auto';
            var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10;
            nextBtn.style.opacity = atEnd ? '0.3' : '1';
            nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        }

        grid.addEventListener('scroll', updateButtons);
        // Initial state after embeds load
        updateButtons();
        window.addEventListener('load', function () {
            setTimeout(updateButtons, 1500);
        });
    })();

    // =======================
    // Instagram feed (optional)
    // =======================
    var instagramToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE';
    if (instagramToken && instagramToken !== 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE') {
        fetch('https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=' + instagramToken + '&limit=6')
            .then(function (response) { return response.json(); })
            .then(function (data) {
                var feedContainer = document.getElementById('instagram-feed');
                if (data.data && feedContainer) {
                    data.data.forEach(function (media) {
                        var imgUrl = media.media_url;
                        if (media.media_type !== 'IMAGE') {
                            imgUrl = media.thumbnail_url;
                        }
                        var link = document.createElement('a');
                        link.href = media.permalink;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.setAttribute('aria-label', 'Переглянути пост в Instagram');
                        var img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = 'Пост в Instagram від Nikol Photography';
                        img.loading = 'lazy';
                        img.decoding = 'async';
                        link.appendChild(img);
                        feedContainer.appendChild(link);
                    });
                }
            })
            .catch(function (err) {
                console.error('Instagram API error:', err);
            });
    }
});
