document.addEventListener('DOMContentLoaded', () => {

    const light = document.querySelector('.cursor-light');
    if (light) {
        document.addEventListener('mousemove', e => {
            light.style.left = `${e.clientX}px`;
            light.style.top = `${e.clientY}px`;
        });
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
        const words = ["разработчик ТГ/ДС ботов", "создатель сайтов", "разработчик на Python & JS"];
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
            const oldPriceText = el.getAttribute('data-old-price');
            if (oldPriceText) {
                const oldPriceSpan = document.createElement('span');
                oldPriceSpan.className = 'old-price-display';
                oldPriceSpan.textContent = oldPriceText;
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

    const searchInput = document.getElementById('searchInput');
    const solutionCards = document.querySelectorAll('.solution-card');
    if (searchInput && solutionCards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            solutionCards.forEach(card => {
                const tags = card.dataset.tags.toLowerCase();
                if (tags.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });

        solutionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const solutionId = card.href.split('?solution=')[1];
                localStorage.setItem('currentSolutionId', solutionId);
                window.location.href = 'template.html';
            });
        });
    }

    const solutionHeader = document.getElementById('solution-header');
    const solutionMain = document.getElementById('solution-main');
    if (solutionHeader && solutionMain) {
        const solutionsDB = {
            casino_crypto: { title: "Казино-бот на крипте", description: "Игровой бот с возможностью пополнения и вывода средств через популярные крипто-шлюзы.", features: ["Интеграция с платежным шлюзом (@CryptoBot, CryptoPay и другие).", "Игровые режимы (кости, слоты, рулетка и т.д.).", "Система балансов пользователей.", "Админ-панель для управления ботом и пользователями.", "Промокоды и бонусы."], stack: "Python, Aiogram 3, Aiohttp, SQLite/PostgreSQL, Aiocryptopay." },
            casino_stars: { title: "Казино-бот на Telegram Stars", description: "Современный игровой бот, использующий внутреннюю валюту Telegram (Stars) для монетизации.", features: ["Прием платежей через Telegram Stars.", "Различные игровые механики.", "Ведение балансов в звездах.", "Полное соответствие правилам платформы Telegram.", "Реферальная система на Stars."], stack: "Python, Aiogram 3, PostgreSQL." },
            ref_bot: { title: "Реферальный бот", description: "Система для отслеживания приглашенных пользователей и автоматического начисления бонусов.", features: ["Генерация уникальных реферальных ссылок.", "Отслеживание регистраций по ссылкам.", "Многоуровневая система (бонусы за друзей друзей).", "Начисление бонусов (деньги, подписка, скидки).", "Статистика для пользователей и администратора."], stack: "Python, Aiogram 3, SQLite/PostgreSQL." },
            ds_game_bot: { title: "Игровой бот для Discord", description: "Создание уникальной экономической и ролевой системы на вашем Discord-сервере.", features: ["Кастомная игровая валюта.", "Магазин ролей и предметов.", "Система опыта и уровней.", "Автоматические ивенты и мини-игры.", "Гибкая настройка команд и прав доступа."], stack: "Python, Discord.py/Disnake, SQLite." },
            ds_support_bot: { title: "ИИ-саппорт для Discord", description: "Автоматизация поддержки на сервере с помощью языковой модели Google Gemini.", features: ["Ответы на часто задаваемые вопросы.", "Анализ сообщений пользователей для определения темы вопроса.", "Возможность 'дообучения' на вашей базе знаний.", "Перенаправление сложных вопросов на живого модератора.", "Снижение нагрузки на команду поддержки."], stack: "Python, Discord.py, Google Gemini API." },
            telethon_spammer: { title: "Софт для рассылок (Telethon)", description: "Программа для автоматизации массовой отправки сообщений в Telegram.", features: ["Рассылка по списку пользователей или чатов.", "Поддержка текста, фото, видео и других файлов.", "Настройка задержек между сообщениями для избежания бана.", "Работа с несколькими аккаунтами.", "Простой текстовый или GUI интерфейс."], stack: "Python, Telethon, PyQt/Tkinter (для GUI)." },
            telethon_inviter: { title: "Инвайтер для групп", description: "Программа для автоматического добавления пользователей из одной группы в другую.", features: ["Сбор активной аудитории из чатов-доноров.", "Поддержка нескольких аккаунтов для обхода лимитов.", "Настраиваемые задержки и параметры.", "Ведение логов и отчетов о работе."], stack: "Python, Telethon." },
            telethon_parser: { title: "Парсер данных", description: "Сбор публичной информации о пользователях, сообщениях или участниках чатов.", features: ["Сбор юзернеймов, имен, ID пользователей.", "Выгрузка истории сообщений из чатов.", "Фильтрация по различным критериям (активность, наличие аватара).", "Экспорт данных в удобные форматы (CSV, TXT, JSON)."], stack: "Python, Telethon, Pandas." },
            telethon_multitool: { title: "GUI Мультитул", description: "Десктопная программа с графическим интерфейсом, объединяющая несколько функций для работы с Telegram.", features: ["Комбайн, включающий в себя: рассылку, инвайтер, парсер.", "Удобный графический интерфейс (GUI) для легкой настройки.", "Сохранение и загрузка профилей настроек.", "Подробное логирование всех действий."], stack: "Python, Telethon, PyQt5/PySide6." },
            landing_page: { title: "Сайт-визитка / Лендинг", description: "Простой, но стильный одностраничный сайт для быстрой презентации проекта, продукта или услуги.", features: ["Адаптивный дизайн для телефонов и компьютеров.", "Современный минималистичный внешний вид.", "Форма обратной связи для сбора заявок.", "Плавные анимации и эффекты.", "Быстрая скорость загрузки."], stack: "HTML, CSS, JavaScript." },
            portfolio_site: { title: "Сайт-портфолио", description: "Персональный сайт для демонстрации ваших работ, навыков и услуг. Похож на тот, на котором вы сейчас находитесь.", features: ["Раздел с работами/кейсами.", "Интерактивные элементы и анимации.", "Форма для связи или ссылки на соцсети.", "Легко обновляемая структура.", "Оптимизация для GitHub Pages."], stack: "HTML, CSS, JavaScript." },
            default: { title: "Ошибка загрузки", description: "Не удалось загрузить информацию о решении. Пожалуйста, вернитесь в каталог и попробуйте снова.", features: [], stack: "N/A" }
        };

        const solutionId = localStorage.getItem('currentSolutionId');
        const solutionData = solutionsDB[solutionId] || solutionsDB.default;

        solutionHeader.innerHTML = `<h1>${solutionData.title}</h1><p>${solutionData.description}</p>`;
        
        let featuresHTML = solutionData.features.map(feature => `<li>${feature}</li>`).join('');
        
        solutionMain.innerHTML = `
            <h3>Ключевые возможности</h3>
            <ul>${featuresHTML}</ul>
            <h3>Основной стек технологий</h3>
            <p>${solutionData.stack}</p>
            <div class="button-container">
                <a href="https://t.me/wartov1337" target="_blank" class="cta-button">Связаться и обсудить</a>
            </div>`;
    }

    const showTopOrdersBtn = document.getElementById('show-top-orders');
    const topOrdersContainer = document.getElementById('top-orders-container');

    if (showTopOrdersBtn && topOrdersContainer) {
        showTopOrdersBtn.addEventListener('click', () => {
            const isHidden = topOrdersContainer.style.display === 'none';
            if (isHidden) {
                topOrdersContainer.style.display = 'block';
                setTimeout(() => {
                    topOrdersContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
            } else {
                topOrdersContainer.style.display = 'none';
            }
        });
    }
});
