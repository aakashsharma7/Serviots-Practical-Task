# Pet Adoption Management System

A full-stack MERN application for managing pet adoptions with a premium dark-themed UI.

## Features

- **Visitor**: Browse and filter pets, view individual pet details.
- **User**: Register, login, apply for pet adoptions, track application status.
- **Admin**: Full pet management (create, read, update, delete) including photo uploads. Manage incoming adoption applications (approve/reject). Application approval automatically updates pet statuses and declines competing applications.

## Tech Stack

- **Frontend**: React (Vite), React Router v6, Axios, Tailwind CSS v4.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer (Photo Uploads).

## Prerequisites
- Node.js (v18+)
- Local MongoDB instance running on `mongodb://localhost:27017` or change `MONGO_URI` in `backend/.env` to a cloud DB.

## Getting Started

### 1. Setup Backend

```bash
cd backend
npm install
```

Configure your `.env` based on `.env.example` in `backend/.env`. (Default is already set).

Seed the database with sample pets and users:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
Backend will run on `http://localhost:5000`.

### 2. Setup Frontend

Open a new terminal.

```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`. Proxies API requests automatically to `localhost:5000`.

## Seeded User Accounts
If you ran the seed script, you can log in immediately with:
- **Admin**: `admin@petadopt.com` / `admin123`
- **User**: `user@petadopt.com` / `user1234`
