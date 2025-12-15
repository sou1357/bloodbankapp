# LifeFlow - Blood Bank Management System

A comprehensive blood bank management system with role-based access control.

## Features

- **JWT Authentication** with role-based access control
- **Three User Types:**
  - Hospitals (manage blood requests)
  - Blood Banks (manage inventory)
  - Donors (track donations)
- **SQLite Database** with Prisma ORM
- **Beautiful UI** with Tailwind CSS and Lucide Icons

## Project Structure

```
lifeflow/
├── client/          # React frontend (Vite + JSX)
├── server/          # Express backend (Node.js)
│   ├── prisma/      # Database schema and migrations
│   ├── routes/      # API routes
│   └── server.js    # Express server
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. The database is already set up with SQLite

### Running the Application

You need to run both the server and client:

**Terminal 1 - Start the server:**
```bash
npm run dev:server
```
Server runs on http://localhost:3001

**Terminal 2 - Start the client:**
```bash
npm run dev
```
Client runs on http://localhost:5173

### Building for Production

```bash
npm run build
```

## User Roles

### Blood Banks
- Manage blood inventory by type
- View stock levels and alerts
- Track donors

### Hospitals
- Request blood from blood banks
- Manage patient requirements
- Track active requests

### Donors
- View donation history
- Check eligibility
- Find nearby blood drives

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express
- **Database:** SQLite with Prisma
- **Auth:** JWT tokens

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## Database Schema

- **User** - Core user data with role
- **OrganizationProfile** - Hospital/Blood Bank details
- **DonorProfile** - Donor-specific information
