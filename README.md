# E-Commerce Website (Next.js + React.js)

A full-stack e-commerce application built with modern web technologies, featuring a React frontend and a Next.js backend API with Prisma ORM.

## Project Structure

```
.
├── frontend/         # React + Vite Client Application
├── backend/          # Next.js Server & API Routes (Prisma)
├── .env.example      # Example environment variables template
├── .gitignore        # Root Git ignore configuration
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn or pnpm
- PostgreSQL database

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npx prisma db push # or npx prisma migrate dev
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` in both `frontend` and `backend` directories and fill in the required values:

- `frontend/.env`: Public client configurations
- `backend/.env`: Server secrets, database URL, JWT keys, Stripe & Cloudinary API credentials
