document.addEventListener('DOMContentLoaded', () => {

    const setupTheme = () => {
        const themeSwitcher = document.getElementById('theme-switcher');
        if (!themeSwitcher) return;

        const moonIcon = themeSwitcher.querySelector('.fa-moon');
        const starIcon = themeSwitcher.querySelector('.fa-star');
        const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let currentTheme = localStorage.getItem('theme') || osTheme;

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
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
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
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
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

    const solutionsData = {
        casino_crypto: { title: "Казино-бот на крипте", description: "Игровой бот с возможностью пополнения и вывода средств через популярные крипто-шлюзы.", features: [ "Интеграция с платежным шлюзом (@CryptoBot, CryptoPay и другие).", "Готовые игровые режимы (кости, слоты, рулетка и т.д.).", "Система балансов пользователей с поддержкой нескольких валют.", "Проработанная админ-панель для управления ботом и пользователями.", "Система промокодов и бонусов для привлечения игроков." ], stack: "Python, Aiogram 3, Aiohttp, SQLite/PostgreSQL, Aiocryptopay." },
        casino_stars: { title: "Казино-бот на Stars", description: "Игровой бот, использующий внутреннюю валюту Telegram (Stars) для проведения платежей.", features: [ "Полная интеграция с Telegram Stars для пополнения счета.", "Разнообразные игровые механики, адаптированные под Stars.", "Автоматический учет балансов и история транзакций.", "Панель администратора для настройки игр и просмотра статистики.", "Система лояльности и ежедневных наград." ], stack: "Python, Aiogram 3, Telegram Bot API." },
        ref_bot: { title: "Реферальный бот", description: "Система для создания многоуровневых программ приглашений с автоматическим начислением бонусов.", features: [ "Поддержка многоуровневой реферальной системы (N уровней).", "Автоматическое начисление бонусов за регистрацию и активность рефералов.", "Подробная статистика для пользователя (количество рефералов, доход).", "Админ-панель для просмотра общей статистики и управления пользователями.", "Гибкая настройка размера вознаграждений." ], stack: "Python, Aiogram 3, SQLAlchemy/PostgreSQL." },
        ds_game_bot: { title: "Игровой бот для Discord", description: "Создание уникального игрового опыта на вашем Discord-сервере с кастомной экономикой.", features: [ "Система кастомной валюты и инвентаря.", "Магазин для покупки/продажи предметов и ролей.", "Система уровней и опыта (XP) за активность в чате и войсе.", "Автоматические ивенты и мини-игры.", "Настраиваемые таблицы лидеров (топ по балансу, уровню и т.д.)." ], stack: "Python, Discord.py/Nextcord, SQLite/PostgreSQL." },
        ds_support_bot: { title: "ИИ-саппорт для Discord", description: "Интеллектуальный ассистент на базе Gemini API для автоматизации поддержки пользователей.", features: [ "Интеграция с Google Gemini API для генерации ответов.", "Способность отвечать на частые вопросы на основе базы знаний.", "Создание тикетов и упоминание модераторов при сложных запросах.", "Обучение на конкретных документах вашего проекта.", "Поддержка нескольких языков." ], stack: "Python, Discord.py/Nextcord, Gemini API." },
        telethon_spammer: { title: "Софт для рассылок (Telethon)", description: "Утилита для автоматической отправки сообщений по списку чатов или пользователей Telegram.", features: [ "Работа с неограниченным количеством аккаунтов.", "Рассылка по ID чатов, юзернеймам или контактам.", "Поддержка форматирования текста, изображений и кнопок.", "Настраиваемые задержки для избежания блокировок.", "Простой интерфейс (GUI или консольный)." ], stack: "Python, Telethon, PySide6/Tkinter (для GUI)." },
        telethon_inviter: { title: "Инвайтер для групп (Telethon)", description: "Автоматическое добавление (инвайтинг) пользователей из одной группы в другую.", features: [ "Парсинг активной аудитории из чата-донора.", "Фильтрация пользователей по дате последней активности.", "Поддержка нескольких аккаунтов для обхода лимитов.", "Ведение логов и статистики по приглашенным пользователям.", "Автоматическое вступление в чат-донор и чат-цель." ], stack: "Python, Telethon." },
        telethon_parser: { title: "Парсер данных (Telethon)", description: "Сбор информации о пользователях, сообщениях или полной истории чатов.", features: [ "Сбор пользователей из открытых и закрытых групп.", "Выгрузка ID, юзернеймов, имен и другой информации.", "Парсинг истории сообщений чата с сохранением в файл (JSON, CSV).", "Фильтрация аудитории по различным критериям.", "Возможность работы в асинхронном режиме для высокой скорости." ], stack: "Python, Telethon, Pandas." },
        telethon_multitool: { title: "GUI Мультитул (Telethon)", description: "Десктопное приложение, объединяющее функции парсера, инвайтера, рассыльщика и другие.", features: [ "Удобный графический интерфейс (GUI).", "Менеджер аккаунтов с проверкой на бан.", "Модульная структура: парсер, инвайтер, спамер в одном окне.", "Сохранение и загрузка настроек для разных задач.", "Подробное логирование всех действий." ], stack: "Python, Telethon, PySide6/PyQt5." },
        landing_page: { title: "Сайт-визитка / Лендинг", description: "Современный и адаптивный одностраничный сайт для презентации вашего проекта, продукта или услуг.", features: [ "Чистый, современный дизайн (код без конструкторов).", "Адаптивность под все устройства (десктоп, планшет, мобильный).", "Плавные анимации при скролле и взаимодействии.", "Форма обратной связи с отправкой на вашу почту или в Telegram.", "Оптимизация для быстрой загрузки." ], stack: "HTML5, CSS3, JavaScript." },
        portfolio_site: { title: "Сайт-портфолио", description: "Стильный персональный сайт для демонстрации ваших работ, навыков и опыта.", features: [ "Динамическая галерея проектов с фильтрацией по категориям.", "Интерактивная временная шкала вашего опыта.", "Раздел с вашими навыками и компетенциями.", "Интеграция с GitHub для отображения ваших репозиториев.", "Темная и светлая темы." ], stack: "HTML5, CSS3, JavaScript." }
    };

    const solutionHeader = document.getElementById('solution-header');
    const solutionMain = document.getElementById('solution-main');
    if (solutionHeader && solutionMain) {
        const urlParams = new URLSearchParams(window.location.search);
        const solutionKey = urlParams.get('solution');
        const data = solutionsData[solutionKey];
        if (data) {
            document.title = `${data.title} | wartov`;
            solutionHeader.innerHTML = `<h1>${data.title}</h1><p>${data.description}</p>`;
            const featuresHtml = data.features.map(feature => `<li>${feature}</li>`).join('');
            solutionMain.innerHTML = `<h3>Ключевые возможности</h3><ul>${featuresHtml}</ul><h3>Основной стек технологий</h3><p class="tech-stack">${data.stack}</p><div class="button-container"><a href="https://t.me/wartov1337" target="_blank" class="cta-button">Связаться и обсудить</a></div>`;
        } else {
            document.title = 'Ошибка | wartov';
            solutionHeader.innerHTML = '<h1>Решение не найдено</h1>';
            solutionMain.innerHTML = '<p>К сожалению, мы не смогли найти информацию по вашему запросу. Пожалуйста, вернитесь в каталог и попробуйте снова.</p>';
        }
    }

    const searchInput = document.getElementById('searchInput');
    const catalogGrid = document.getElementById('catalog-grid');
    if (searchInput && catalogGrid) {
        const solutionCards = catalogGrid.querySelectorAll('.solution-card');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            solutionCards.forEach(card => {
                const tags = card.dataset.tags.toLowerCase();
                if (tags.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});