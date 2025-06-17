# Accident Risk Predictor 🚗⚠️

Проект для предсказания вероятности ДТП на основе параметров автомобиля, водителя и дорожных условий.

## Архитектура проекта

- 📦 **Backend** (Python + Flask)
  - Модель обучена на исторических данных ДТП (stat.gibdd.ru)
  - REST API: `/api/predict`, `/contract` (допустимые значения)

- 💻 **Frontend** (React + TypeScript)
  - Форма с выпадающими списками и автодополнением
  - Валидация на основе контракта с сервера
  - История запросов, отображение риска в %

## 🚀 Как запустить

### ⚙️ Настройки окружения (.env)
Создать файл `.env` в директории `Frontend-AI/` и добавить:

```bash
VITE_YANDEX_API_KEY="ключ_от_яндекс_карт"
VITE_FLASK_API_URL="http://localhost:8080/api"
```
🔑 Получить API-ключ: https://developer.tech.yandex.ru

### Backend

```bash
cd Backend-AI
.\run.bat
```

### Frontend

```bash
cd Frontend-AI
npm install
npm run dev
```
- Интерфейс доступен на: http://localhost:5173
- Используются Яндекс.Карты для отображения точки на карте

## Демонстрация 


<img src="https://github.com/user-attachments/assets/c08132ac-5b7d-441a-a9df-8e659cac61b9" style="width: 750px;" />

----------------------------------------------------------------

<img src="https://github.com/user-attachments/assets/5c6a6ecc-c72c-45fb-ae24-7fd25490e13a" style="width: 750px;" />



