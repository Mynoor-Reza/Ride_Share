# Ride-Share Platform

On-demand ride-hailing system with whole-car or per-seat booking. Backend + Admin Dashboard.

## Structure

```
Ride_share/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/       # env, prisma, redis, logger, socket, firebase
│   │   ├── middleware/   # auth, errorHandler, rateLimiter, validate
│   │   ├── routes/       # auth, vehicles, rides, payments, sos, ratings, admin, safety, notifications
│   │   ├── controllers/  # thin request handlers
│   │   ├── services/     # business logic
│   │   ├── validators/   # Zod schemas
│   │   └── utils/        # AppError, apiResponse, jwt
│   ├── prisma/           # schema + migrations
│   ├── tests/            # Jest + Supertest
│   ├── Dockerfile
│   └── docker-compose.yml
├── admin/            # Next.js admin dashboard
│   └── src/
│       ├── app/          # pages (login, dashboard, users, rides, sos, reports)
│       ├── components/   # Sidebar, StatsCard, DataTable, StatusBadge, Modal
│       ├── context/      # AuthContext
│       └── lib/          # API client
├── Progress.md
├── implementation-plan.md
└── README.md
```

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env    # edit as needed
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev             # http://localhost:3000

# Admin Dashboard
cd admin
npm install
npm run dev             # http://localhost:3001
```

## API Endpoints (39 total)

| Group | Routes |
|---|---|
| Auth | send-otp, verify-otp, register, login, refresh, admin/approve-nid |
| Vehicles | POST /, GET /, GET /:id, PUT /:id, DELETE /:id |
| Rides | request, my, available, :id/accept, :id/start, :id/complete |
| Payments | initiate, booking/:bookingId |
| SOS | trigger, :id/cancel, my, all |
| Ratings | POST /, user/:userId, report |
| Admin | dashboard, users, users/:id, users/role, rides, reports |
| Safety | share-ride, auto-sos/:rideId, emergency-contacts |
| Notifications | register, unregister, GET /, :id/read, read-all |

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma (PostgreSQL), Redis, Socket.io, Firebase
- **Admin:** Next.js 15, Tailwind CSS 4, Lucide icons
- **Deployment:** Docker, GitHub Actions CI
