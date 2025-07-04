document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    // =======================
    // Mobile menu toggle
    // =======================
    menuToggle.addEventListener('click', function () {
        header.classList.toggle('menu-open');
        if (header.classList.contains('menu-open')) {
            menuToggle.innerHTML = '&times;';
        } else {
            menuToggle.innerHTML = '&#9776;';
        }
    });

    // Close mobile menu when link clicked
    document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            header.classList.remove('menu-open');
            menuToggle.innerHTML = '&#9776;';
        });
    });

    // Sticky header background on scroll
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =======================
    // Portfolio filters
    // =======================
    const filterButtons = document.querySelectorAll('.filters button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // =======================
    // Instagram feed (optional example)
    // =======================
    const instagramToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE';
    if (instagramToken && instagramToken !== 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE') {
        fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${instagramToken}&limit=6`)
            .then(response => response.json())
            .then(data => {
                const feedContainer = document.getElementById('instagram-feed');
                if (data.data) {
                    data.data.forEach(media => {
                        let imgUrl = media.media_url;
                        if (media.media_type !== 'IMAGE') {
                            imgUrl = media.thumbnail_url;
                        }
                        const link = document.createElement('a');
                        link.href = media.permalink;
                        link.target = '_blank';
                        link.rel = 'noopener';
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = 'Instagram post';
                        link.appendChild(img);
                        feedContainer.appendChild(link);
                    });
                }
            })
            .catch(err => {
                console.error('Instagram API error:', err);
            });
    }

    // =======================
    // Contact form with EmailJS
    // =======================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            emailjs.sendForm(
                'service_jwln1xk',   // Заміни на твій Service ID
                'template_l4dqdrq',  // Твій Template ID
                this
            ).then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Дякуємо! Ваше повідомлення надіслано.');
                contactForm.reset();
            }, function (error) {
                console.log('FAILED...', error);
                alert('Виникла помилка відправки. Спробуйте ще раз.');
            });
        });
    }

    // =======================
    // Light/Dark Mode Toggle
    // =======================
// Відновити стан з localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.checked = true;
} else {
  document.documentElement.removeAttribute('data-theme');
  themeToggle.checked = false;
}

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
});
});
