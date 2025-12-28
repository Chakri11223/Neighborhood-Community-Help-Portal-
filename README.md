# 🌟 Neighbourhood Community Help Portal

An extraordinary, premium full-stack application designed to connect neighbours for local help, requests, and real-time collaboration. Built with a high-end "Portal OS" aesthetic, featuring advanced animations, glassmorphism, and seamless user experiences.

---

## 🚀 Extraordinary Features

-   **Portal OS Aesthetic**: A modern, high-tech UI with animated background blobs, grain overlays, and orchestrated scroll reveal animations.
-   **Dynamic Island & Floating Dock**: Interactive navigation elements inspired by modern mobile OS designs, featuring smooth scaling and ambient glows.
-   **Real-time Chat**: Integrated messaging system with a "Bubble OS" look, allowing Residents and Helpers to coordinate directly.
-   **Biometric-Style Auth**: "Access Terminal" and "Identity Registration" pages with aggressive, high-contrast dark themes.
-   **Role-Based Access**: Specialized interfaces for **Residents** (posting requests) and **Helpers** (browsing/accepting tasks).
-   **Multi-Language HUD**: Real-time localization support for English, Telugu (తెలుగు), and Tamil (தமிழ்).
-   **Smart Tracking**: Request status workflow (Pending → Accepted → In-progress → Completed) enforced with backend validation.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular 18, SCSS (Vanilla), RxJS, ngx-translate |
| **Backend** | Node.js (TypeScript), Express.js |
| **Database** | MySQL 8.0 |
| **Design** | CSS Glassmorphism, IntersectionObserver API, Material Icons |
| **DevOps** | Docker, Docker Compose |

---

## 📦 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request-response logic
│   │   ├── models/        # Database models (MySQL)
│   │   ├── routes/        # API Endpoints
│   │   └── scripts/       # DB migration & seeding
│   └── database/          # SQL Schemas
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # View components (Chat, Home, Profile, etc.)
│   │   │   ├── services/   # API communication
│   │   │   └── guards/     # Role-based route protection
│   └── public/             # Assets & i18n JSONs
└── docker-compose.yml      # Root orchestration
```

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **MySQL**: v8.0 or later (if running locally)
- **Docker**: Optional (for containerised setup)

### 2. Quick Start (Docker)
The easiest way to get the entire stack (DB + Backend + Frontend) running:
```bash
docker compose up --build
```
The app will be available at `http://localhost:4200`.

### 3. Local Setup

#### Backend:
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Configure `.env` (DB_HOST, DB_USER, DB_PASSWORD, etc.).
4. Run migrations: `npx ts-node src/scripts/initDb.ts`.
5. Start dev server: `npm run dev`.

#### Frontend:
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the application: `npm start`.

---

## 🛡️ Default Credentials (Seed Data)

The following users are available after running `seedUsers.ts`:

-   **Admin**: `admin@neighbourhood.com` / `admin123`
-   **Helper**: `helper@neighbourhood.com` / `helper123`
-   **Resident**: `resident@neighbourhood.com` / `resident123`

---

## 📜 Licence
This project is developed for community empowerment and local collaboration.

---
*Created with ❤️ for a better neighbourhood.*