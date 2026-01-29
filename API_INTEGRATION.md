# API Integration Guide

## Настройка

### 1. Установка зависимостей

```bash
npm install
```

Это установит `expo-secure-store` для безопасного хранения токенов.

### 2. Настройка Backend

- **Base URL**: `http://192.168.0.10:8000`
- Убедитесь, что телефон и компьютер в одной Wi-Fi сети
- Backend должен быть запущен и доступен по этому адресу

### 3. API Endpoints

Приложение ожидает следующие эндпоинты:

#### Аутентификация

**POST** `/api/auth/login`
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

#### Заявки

**GET** `/api/leads`
```json
Headers:
{
  "Authorization": "Bearer <token>"
}

Response:
{
  "leads": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "city": "string",
      "request": "string",
      "date": "string",
      "createdAt": "ISO date string",
      "status": "new" | "success" | "failed"
    }
  ]
}
```

**GET** `/api/leads/:id`
```json
Headers:
{
  "Authorization": "Bearer <token>"
}

Response:
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "city": "string",
  "request": "string",
  "date": "string",
  "createdAt": "ISO date string",
  "status": "new" | "success" | "failed"
}
```

**PATCH** `/api/leads/:id`
```json
Headers:
{
  "Authorization": "Bearer <token>"
}

Request:
{
  "status": "new" | "success" | "failed"
}

Response:
{
  "id": "string",
  "status": "new" | "success" | "failed"
}
```

## Структура проекта

### services/api.ts
- API клиент с fetch
- Автоматическое добавление токена в заголовки
- Методы для всех операций (login, getLeads, updateLeadStatus)
- Хранение токена через expo-secure-store

### context/AuthContext.tsx
- Управление состоянием аутентификации
- Функции login/logout
- Проверка авторизации при запуске

### context/LeadsContext.tsx
- Управление списком заявок
- Автоматическая загрузка при авторизации
- Обновление статуса с синхронизацией на сервер

## Обработка ошибок

Все API вызовы обернуты в try/catch:
- Ошибки сети показывают Alert с сообщением
- Токен автоматически добавляется ко всем запросам
- При ошибке 401 (Unauthorized) пользователь должен войти заново

## Тестирование

1. Запустите backend на `http://192.168.0.10:8000`
2. Убедитесь, что телефон и компьютер в одной сети
3. Запустите приложение: `npm start`
4. Войдите с реальными учетными данными
5. Заявки загрузятся автоматически

## Переключение между Mock и API

Если нужно вернуться к mock данным:
1. В `context/LeadsContext.tsx` раскомментируйте массив `initialLeads`
2. Измените `useState<Lead[]>([])` на `useState<Lead[]>(initialLeads)`
3. Закомментируйте `useEffect` с `loadLeads()`
