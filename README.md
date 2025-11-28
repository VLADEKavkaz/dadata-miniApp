# DaData Mini App

Мини-приложение для поиска и сохранения адресов через API [DaData](https://dadata.ru/), с авторизацией Laravel Breeze + Sanctum и фронтендом на React (Inertia.js).

---

## Функционал

-   Авторизация пользователя через Breeze.
-   Поиск адреса с подсказками DaData.
-   Сохранение выбранного адреса в базе данных, привязанного к текущему пользователю.
-   Отображение ранее сохранённых адресов после обновления страницы.

---

## Структура проекта

### Backend

-   **Модели**

    -   `app/Models/User.php` — стандартная модель пользователя, с добавленной связью:
        ```php
        public function addresses() {
            return $this->hasMany(\App\Models\Address::class);
        }
        ```
    -   `app/Models/Address.php` — модель адреса:
        ```php
        protected $fillable = ['user_id', 'value', 'meta'];
        protected $casts = ['meta' => 'array'];
        public function user() { return $this->belongsTo(\App\Models\User::class); }
        ```

-   **Контроллеры**

    -   `app/Http/Controllers/Api/AddressController.php` — API для работы с адресами:
        -   `search(Request $request)` — поиск подсказок через DaData.
        -   `store(Request $request)` — сохранение выбранного адреса.
        -   `index(Request $request)` — получение всех сохранённых адресов пользователя.

-   **Миграции**

    -   `database/migrations/xxxx_create_addresses_table.php` — таблица `addresses` с полями `id`, `user_id`, `value`, `meta`, `timestamps`.

-   **Сидеры**

    -   `database/seeders/TestUserSeeder.php` — тестовый пользователь:
        ```
        Email: tester@example.com
        Password: password123
        ```

-   **Маршруты**
    -   `routes/api.php` — защищённые маршруты для работы с адресами через Sanctum:
        ```
        GET /api/addresses/search
        GET /api/addresses
        POST /api/addresses
        ```

### Frontend (React / Inertia.js)

-   `resources/js/Pages/Dashboard.jsx` — страница Dashboard с компонентом `<Addresses />`.
-   `resources/js/Components/Addresses.jsx` — компонент поиска и сохранённых адресов:

    -   Поиск адреса с debounce 300ms.
    -   Список подсказок DaData.
    -   Кнопка "Сохранить" рядом с каждым результатом.
    -   Отображение ранее сохранённых адресов.
