# Вход через Google

Создайте OAuth client типа Web application в Google Cloud → Google Auth Platform → Clients. Настройте Branding и Audience; в режиме Testing добавьте нужные аккаунты как test users.

Для локального запуска зарегистрируйте точный redirect URI `http://localhost:5173/api/auth/google/callback`. Скопируйте `.env.example` в `.env`, внесите Client ID и Client secret и перезапустите сайт. Секрет нельзя помещать в клиентский код, репозиторий или чат.

Для размещённого сайта зарегистрируйте `https://ВАШ-ДОМЕН/api/auth/google/callback` и задайте GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_ORIGIN через настройки окружения Sites. APP_ORIGIN — точный origin без завершающего `/`. Закрытая публикация Sites по-прежнему требует доступ через платформу; отдельный общедоступный сайт потребует изменения доступа владельцем.

При первом входе Google создаётся аккаунт ORBIT. Пользователь идентифицируется стабильным Google sub. Аккаунты Google и ChatGPT не объединяются по email. Результаты старого аккаунта остаются в старом аккаунте. OAuth использует одноразовый state, nonce, проверку подписи ID token, issuer, audience и срока действия. Сессии — случайные HttpOnly cookies, в БД хранится только хеш.

Документация: https://developers.google.com/identity/openid-connect/openid-connect
