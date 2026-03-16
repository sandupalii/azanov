# Инструкция по интеграции сайта с CRM

## 1. Цель
Нужно подключить формы сайта к CRM так, чтобы:

- каждая отправка формы создавала новую сделку
- контакт искался сначала по телефону, затем по email
- если контакт найден, он обновлялся
- если не найден, создавался новый
- в сделку добавлялись теги по типу формы
- в сделку добавлялась заметка с полными данными заявки

---

## 2. Общая схема работы

1. Пользователь заполняет форму на сайте
2. Сайт отправляет `POST` запрос в PHP endpoint
3. PHP endpoint:
   - валидирует поля
   - проверяет защиту от спама
   - авторизуется в CRM
   - ищет контакт
   - обновляет или создает контакт
   - создает новую сделку
   - добавляет комментарий или заметку
4. Frontend получает JSON-ответ и показывает статус пользователю

---

## 3. Структура файлов

Рекомендуемая структура:

```txt
/api/crm/lead.php
/includes/config.php
/assets/js/crm-form.js
/storage/rate-limit/
/logs/crm.log
```

---

## 4. Endpoint

Метод:

```http
POST /api/crm/lead.php
```

Формат запроса:
- `application/json`
- или `application/x-www-form-urlencoded`

---

## 5. Поля заявки

### Обязательные
- `phone`
- `form_type`
- `page_url`

### Необязательные
- `name`
- `email`
- `message`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Пример JSON:

```json
{
  "name": "Иван Петров",
  "phone": "+79991234567",
  "email": "ivan@test.ru",
  "message": "Нужна настройка CRM",
  "form_type": "audit",
  "page_url": "https://site.ru/services",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "crm_audit",
  "utm_content": "ad1",
  "utm_term": "vnedrenie crm"
}
```

---

## 6. Логика обработки

### 6.1 Валидация
На backend обязательно проверить:

- телефон не пустой
- email валиден, если передан
- `form_type` не пустой
- `page_url` не пустой
- honeypot-поле пустое
- rate limit по IP

### 6.2 Нормализация телефона
Все телефоны приводить к единому формату.

Пример:

- `8 (999) 123-45-67`
- `+7 999 123 45 67`

должны превращаться в:

```txt
+79991234567
```

### 6.3 Поиск контакта
Порядок поиска:

1. по телефону
2. если не найден, по email

### 6.4 Контакт
- если найден, обновить
- если не найден, создать

### 6.5 Сделка
- сделка создается всегда новая
- все сделки идут в одну воронку
- все сделки идут в один этап
- ответственный либо не назначается, либо задается в конфиге

### 6.6 Теги
В сделку добавлять теги:

- `site`
- `leadbooster`
- тег из `form_type`

Примеры `form_type`:
- `hero`
- `audit`
- `contacts`
- `consultation`
- `footer`

### 6.7 Заметка к сделке
В заметке сохранить:

- имя
- телефон
- email
- текст заявки
- тип формы
- URL страницы
- UTM-метки
- IP
- User-Agent
- дата и время

Пример заметки:

```txt
Новая заявка с сайта

Форма: audit
Имя: Иван Петров
Телефон: +79991234567
Email: ivan@test.ru
Сообщение: Нужна настройка CRM

Страница: https://site.ru/services

UTM:
source=google
medium=cpc
campaign=crm_audit
content=ad1
term=vnedrenie crm

IP: 123.123.123.123
User-Agent: Mozilla/5.0
Дата: 2026-03-16 15:30:00
```

---

## 7. Ответ backend

### Успех
```json
{
  "ok": true,
  "lead_id": 123456,
  "contact_id": 654321
}
```

### Ошибка
```json
{
  "ok": false,
  "error": "Phone is required",
  "code": "VALIDATION_ERROR"
}
```

---

## 8. Конфиг

Все чувствительные данные должны храниться отдельно в `config.php`.

Пример:

```php
<?php

return [
    'crm' => [
        'base_domain' => 'https://YOUR_CRM_DOMAIN',
        'long_lived_token' => 'YOUR_LONG_LIVED_TOKEN',

        'client_id' => 'YOUR_CLIENT_ID',
        'client_secret' => 'YOUR_CLIENT_SECRET',
        'redirect_uri' => 'YOUR_REDIRECT_URI',
        'access_token' => 'YOUR_ACCESS_TOKEN',
        'refresh_token' => 'YOUR_REFRESH_TOKEN',
        'expires_at' => 0,

        'pipeline_id' => 123456,
        'status_id' => 123456,
        'responsible_user_id' => null,
    ],

    'security' => [
        'rate_limit_seconds' => 15,
        'rate_limit_dir' => __DIR__ . '/../storage/rate-limit',
        'log_file' => __DIR__ . '/../logs/crm.log',
    ],

    'app' => [
        'default_tags' => ['site', 'leadbooster'],
        'timezone' => 'Europe/Moscow',
    ],
];
```

---

## 9. Что нужно заменить программисту

Программист должен подставить:

- домен CRM
- токен CRM или OAuth-параметры
- `pipeline_id`
- `status_id`
- `responsible_user_id`, если нужен
- ID и названия полей CRM, если конкретная CRM требует свои поля

---

## 10. Защита от спама

Обязательно реализовать:

- honeypot-поле, например `company_website`
- rate limit по IP, например 1 заявка в 15 секунд
- server-side валидацию
- логирование ошибок

---

## 11. Frontend

Все формы сайта должны отправляться через один JS-обработчик.

Логика frontend:

- перехват `submit`
- сбор полей формы
- добавление `form_type`
- добавление `page_url`
- добавление UTM-меток
- отправка в `/api/crm/lead.php`
- отображение состояний:
  - отправка
  - успешно
  - ошибка

Пример формы:

```html
<form data-crm-form="audit">
  <input type="text" name="name" placeholder="Ваше имя">
  <input type="tel" name="phone" placeholder="Телефон" required>
  <input type="email" name="email" placeholder="Email">
  <textarea name="message" placeholder="Опишите задачу"></textarea>

  <input
    type="text"
    name="company_website"
    tabindex="-1"
    autocomplete="off"
    style="position:absolute;left:-9999px;opacity:0;"
  >

  <button type="submit">Отправить</button>
  <div data-form-status></div>
</form>
```

---

## 12. Что должен делать `lead.php`

Файл `/api/crm/lead.php` должен:

1. принять данные формы
2. проверить honeypot
3. проверить rate limit
4. нормализовать телефон
5. провалидировать поля
6. авторизоваться в CRM
7. найти контакт
8. создать или обновить контакт
9. создать сделку
10. добавить заметку
11. вернуть JSON

---

## 13. Логирование

Логировать:

- ошибки валидации
- ошибки CRM API
- ошибки авторизации
- успешное создание сделки

Не логировать в открытом виде:
- client secret
- refresh token
- access token
- long-lived token

---

## 14. Чек-лист приемки

После настройки программист должен проверить:

1. Новая заявка создает контакт и сделку
2. Повторная заявка с тем же телефоном не создает дубль контакта
3. Повторная заявка создает новую сделку
4. В сделке есть теги
5. В сделке есть заметка
6. Пустой телефон возвращает ошибку
7. Honeypot блокирует спам
8. Rate limit работает
9. Ошибки CRM не ломают frontend

---

## 15. Короткая постановка задачи для программиста

```txt
Нужно подключить формы сайта к CRM через PHP endpoint.

Логика:
- сайт отправляет POST на /api/crm/lead.php
- backend ищет контакт по телефону, затем по email
- если контакт найден, обновляет его
- если не найден, создает
- сделка создается всегда новая
- сделка идет в одну воронку и один этап
- в сделку добавляются теги: site, leadbooster, form_type
- в сделку добавляется заметка: имя, телефон, email, сообщение, page_url, utm_*, ip, user-agent, дата

Обязательные поля:
- phone
- form_type
- page_url

Нужна защита:
- honeypot
- rate limit по IP
- server-side валидация

Нужен JSON-ответ:
success -> { ok: true, lead_id, contact_id }
error -> { ok: false, error, code }

Все токены и ключи вынести в config.php.
```
