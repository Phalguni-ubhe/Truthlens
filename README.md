# 🔍 TruthLens

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Auth%20%26%20Database-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

**TruthLens** is an intelligent full-stack media and claim verification platform designed to evaluate authenticity, flag manipulated content, and safeguard users against digital misinformation and synthetic media.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
- [Running the Application](#-running-the-application)
- [API Overview](#-api-overview)
- [Security & Firebase Setup](#-security--firebase-setup)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Misinformation, deceptive narratives, and synthetic content proliferate rapidly across the web. **TruthLens** addresses this challenge with a modern, responsive web application offering:
- **Interactive Verification Dashboard:** Submit textual claims, URLs, or media artifacts for real-time risk assessment.
- **Secure Authentication:** Integrated token-based authentication via Firebase and custom Express authorization middleware.
- **Explainable Insights:** Structured breakdowns and indicators highlighting why specific content was flagged.

---

## ✨ Key Features

- **Intuitive Dashboard:** Clean UI built with React, Vite, and TypeScript featuring dedicated navigation sidebars and analytical cards.
- **Secure Authentication & Session Management:** Integrated with Firebase Auth to manage sign-ups, logins, and protected routes.
- **Custom Auth Middleware:** Express backend ensures API endpoints are securely guarded against unauthenticated requests.
- **Fast, Modular Architecture:** Clean separation of concerns between client-side visualization (`truthLens-frontend`) and server-side verification pipelines (`truthlens-backend`).

---

## 🛠 Architecture & Tech Stack

### Frontend
- **Framework:** [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Modular CSS / Modern Tailwind CSS
- **Authentication Client:** Firebase Client SDK

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Authentication & Validation:** Firebase Admin SDK & custom Express authorization middleware (`authMiddleware.js`)
- **API Testing:** Integrated endpoint tests and mock environments

---

## 📂 Project Structure

```plaintext
Truthlens-main/
│
├── truthlens-backend/              # Express API Server
│   ├── authorization/
│   │   └── middleware/
│   │       └── authMiddleware.js   # JWT / Firebase session verifier
│   ├── firebase/
│   │   └── firebaseConfig.js       # Firebase Admin initialization
│   ├── server.js                   # Main server entry point
│   ├── test.html                   # Quick API testing client
│   └── package.json
│
├── truthLens-frontend/             # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard/
│   │   │       ├── DashboardNavbar.tsx
│   │   │       └── DashboardSidebar.tsx
│   │   ├── firebase/
│   │   │   └── firebaseConfig.ts   # Firebase client SDK setup
│   │   ├── guidelines/
│   │   │   └── Guidelines.md       # Contribution & UI guidelines
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (`v18.x` or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase Project](https://console.firebase.google.com/) for authentication and config keys

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Phalguni-ubhe/Truthlens.git
   cd Truthlens
   ```

2. **Set up the Backend:**
   ```bash
   cd truthlens-backend
   npm install
   ```

3. **Set up the Frontend:**
   ```bash
   cd ../truthLens-frontend
   npm install
   ```

---

### 🔑 Environment Variables

#### Backend (`truthlens-backend/.env`)
Create a `.env` file in the `truthlens-backend` directory:
```env
PORT=5000
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

#### Frontend (`truthLens-frontend/.env`)
Create a `.env` file in the `truthLens-frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Running the Application

### 1. Start the Backend Server
```bash
cd truthlens-backend
npm run dev   # or: node server.js
```
The server will start listening at `http://localhost:5000`.

### 2. Start the Frontend Dev Server
In a separate terminal window:
```bash
cd truthLens-frontend
npm run dev
```
Open your browser and navigate to the local Vite URL (typically `http://localhost:5173`).

---

## 🔒 Security & Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password, Google OAuth, etc.).
3. Generate a service account private key under **Project Settings > Service Accounts** and integrate it with `truthlens-backend/firebase/firebaseConfig.js`.
4. Copy the web configuration object into `truthLens-frontend/src/firebase/firebaseConfig.ts`.

> ⚠️ **Important:** Never commit sensitive service account `.json` files or `.env` files containing private credentials to Git.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m "feat: Add AmazingFeature"`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request.

---
