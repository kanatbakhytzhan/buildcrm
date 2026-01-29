# 🏗️ BuildCRM - Строительная CRM система

Мобильное приложение для управления строительными заявками.

## 📱 Технологии

- **React Native** + **Expo SDK 54**
- **Expo Router** (File-based navigation)
- **NativeWind** (Tailwind CSS для React Native)
- **TypeScript**
- **Context API** (State Management)

## 🚀 Деплой на Vercel

### 1. Установка зависимостей

```bash
npm install
```

### 2. Локальная разработка (Web)

```bash
npm run web
```

Откройте http://localhost:8081 в браузере.

### 3. Сборка для продакшена

```bash
npm run build
```

Результат будет в папке `dist/`.

### 4. Деплой на Vercel

#### Через GitHub (Рекомендуется):

1. Создайте репозиторий на GitHub
2. Загрузите код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BuildCRM PWA"
   git branch -M main
   git remote add origin https://github.com/ваш-username/buildcrm.git
   git push -u origin main
   ```
3. Зайдите на [vercel.com](https://vercel.com)
4. Нажмите **"New Project"**
5. Импортируйте ваш GitHub репозиторий
6. Vercel автоматически определит настройки из `vercel.json`
7. Нажмите **"Deploy"**

#### Через Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel
```

## 📦 API Backend

Продакшн API: `https://crm-api-5vso.onrender.com`

Изменить URL можно в файле `services/api.ts`:

```typescript
const BASE_URL = "https://crm-api-5vso.onrender.com";
```

## 🔐 Тестовый доступ

- **Email**: `kanat@skai.kz`
- **Пароль**: `Kanaezz15!`

## 📱 Запуск на мобильных устройствах

### iOS (с Expo Go):

```bash
npm start
# Отсканируйте QR-код через приложение Expo Go
```

### Android:

```bash
npm run android
```

## 🛠️ Структура проекта

```
mobile_crm/
├── app/                    # Экраны (Expo Router)
│   ├── (tabs)/            # Табы (Заявки, Профиль)
│   ├── lead/[id].tsx      # Детали заявки
│   ├── tasks.tsx          # Канban задачи
│   └── index.tsx          # Логин
├── context/               # React Context (State)
│   ├── AuthContext.tsx    # Аутентификация
│   └── LeadsContext.tsx   # Управление заявками
├── services/              # API клиент
│   └── api.ts             # Fetch запросы
├── utils/                 # Утилиты
│   └── date.ts            # Форматирование дат
└── vercel.json            # Конфигурация Vercel
```

## 🌐 После деплоя

Vercel выдаст вам URL типа:
```
https://buildcrm-ваш-проект.vercel.app
```

Приложение будет работать как PWA (можно добавить на главный экран телефона).

## 🐛 Troubleshooting

**Проблема**: `Module not found: react-dom`
**Решение**:
```bash
npm install react-dom react-native-web --legacy-peer-deps
```

**Проблема**: Белый экран на Vercel
**Решение**: Проверьте, что `vercel.json` настроен правильно (rewrites на `/index.html`).

## 📄 Лицензия

Private © 2024 BuildCRM
