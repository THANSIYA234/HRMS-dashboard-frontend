# HRMS Dashboard

A Human Resource Management System (HRMS) built with React 19 + Vite + Material UI v7 on the frontend and Express 5 + Mongoose 9 on the backend. Supports admin and employee roles with JWT-based authentication, attendance tracking, leave management, departments, employee CRUD, and an in-app notification feed.

## Live demo

- Frontend: https://hrmsdashboardfrontend.netlify.app
- Backend: https://hrms-dashboard-backend.onrender.com

## Features

- Role-based authentication (admin, employee) with refresh-token rotation
- Employee CRUD with profile image upload
- Department management
- Punch-in / punch-out attendance with daily stats and 30-day trends
- Leave apply / approve / reject workflow with balance tracking
- In-app notification feed
- Material UI dashboard with charts (recharts)

## Tech stack

**Frontend**

- React 19, Vite 7
- Material UI v7, Emotion
- React Router v6, React Query v5
- Axios, dayjs / date-fns, recharts

**Backend** (see `hrms_backend/README.md`)

- Node.js, Express 5, Mongoose 9
- JWT (access + refresh), bcrypt, multer, cookie-parser

## Setup

Prerequisites: Node.js 20+, npm 10+, a running MongoDB instance (local or Atlas).

```bash
# 1. Clone both repos
git clone <frontend-repo> hrms-dashboard
git clone <backend-repo> hrms_backend

# 2. Backend
cd hrms_backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, REFRESH_SECRET
npm install
npm run dev                 # http://localhost:5000

# 3. Frontend (in a new terminal)
cd ../hrms-dashboard
cp .env.example .env        # point VITE_API_BASE at your backend
npm install
npm run dev                 # http://localhost:5173
```

## Environment variables

See `.env.example` for the full list. Each variable is documented inline.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run coverage` | Run Vitest with coverage |

## Project structure

```
src/
├── api/          # axios instance
├── auth/         # login page
├── components/   # shared + role-specific UI
├── contexts/     # React contexts (auth, …)
├── layouts/      # admin / employee shells
├── pages/        # route-level pages
├── queries/      # React Query hooks (per role)
├── services/     # axios calls (per role)
├── test/         # Vitest setup + regression tests
└── utils/        # small helpers
```

## License

ISC — see `LICENSE` if present.

## Author

Thansiya P