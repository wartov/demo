document.addEventListener('DOMContentLoaded', () => {

    const setupTheme = () => {
        const themeSwitcher = document.getElementById('theme-switcher');
        const moonIcon = themeSwitcher.querySelector('.fa-moon');
        const starIcon = themeSwitcher.querySelector('.fa-star');
        let currentTheme = localStorage.getItem('theme') || 'dark';

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'light') {
                moonIcon.style.display = 'none';
                starIcon.style.display = 'inline-block';
            } else {
                moonIcon.style.display = 'inline-block';
                starIcon.style.display = 'none';
            }
        };

        applyTheme(currentTheme);

        themeSwitcher.addEventListener('click', () => {
            currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    };
    setupTheme();

    const light = document.querySelector('.cursor-light');
    if (light) {
        document.addEventListener('mousemove', e => {
            light.style.left = `${e.clientX}px`;
            light.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mousedown', () => light.classList.add('clicked'));
        document.addEventListener('mouseup', () => light.classList.remove('clicked'));
    }

    const sections = document.querySelectorAll('.content-section');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ["Боты", "Сайты", "Python & JS"];
        let wordIndex = 0; let letterIndex = 0; let currentWord = ''; let isDeleting = false;
        function type() {
            const speed = isDeleting ? 75 : 150; currentWord = words[wordIndex];
            if (isDeleting) { typingElement.textContent = currentWord.substring(0, letterIndex--);
            } else { typingElement.textContent = currentWord.substring(0, letterIndex++); }
            if (!isDeleting && letterIndex === currentWord.length) { setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && letterIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
            setTimeout(type, speed);
        }
        type();
    }

    const priceElements = document.querySelectorAll('.price[data-price-usd]');
    if (priceElements.length > 0) {
        const USD_TO_RUB_RATE = 92;
        priceElements.forEach(el => {
            const priceUSD = parseFloat(el.getAttribute('data-price-usd'));
            if (!isNaN(priceUSD)) {
                const priceRUB = Math.floor((priceUSD * USD_TO_RUB_RATE) / 10) * 10;
                const rubElement = el.querySelector('.price-rub');
                if (rubElement) { rubElement.textContent = `~ ${priceRUB} ₽`; }
            }
            if (el.dataset.oldPrice && !el.querySelector('.old-price-display')) {
                const oldPriceSpan = document.createElement('span');
                oldPriceSpan.className = 'old-price-display';
                oldPriceSpan.textContent = el.dataset.oldPrice;
                el.prepend(oldPriceSpan);
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0) {
        scrollers.forEach((scroller) => {
            const scrollerInner = scroller.querySelector(".scroller-inner");
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }
});
