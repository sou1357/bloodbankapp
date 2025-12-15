# Quick Start Guide

## Running LifeFlow Locally

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
npm run dev:server
```

The server will start on **http://localhost:3001**

You should see:
```
🩸 LifeFlow server running on port 3001
```

### Step 2: Start the Frontend (in a new terminal)

Open a **new terminal** and run:

```bash
npm run dev
```

The client will start on **http://localhost:5173**

### Step 3: Register a New User

1. Open http://localhost:5173 in your browser
2. Click the "Register" tab
3. Choose user type:
   - **Donor**: Register as a blood donor
   - **Organization**: Register as a Hospital or Blood Bank

#### For Donor Registration:
- Fill in name, email, password
- Select blood group
- Click "Create Account"

#### For Organization Registration:
- Fill in name, email, password
- Select organization type (Hospital or Blood Bank)
- Enter license number
- Click "Create Account"

### Step 4: Access Your Dashboard

After registration, you'll be automatically logged in and redirected to your role-specific dashboard:

- **Donors** → Donor Dashboard (track donations, view blood drives)
- **Hospitals** → Hospital Dashboard (manage blood requests)
- **Blood Banks** → Blood Bank Dashboard (manage inventory)

### Testing the App

**Test Account 1 (Donor):**
- Register a new donor account with any email
- Select blood group (e.g., A+)
- View the donor dashboard

**Test Account 2 (Hospital):**
- Register a new organization account
- Select "Hospital" as organization type
- Enter license number (e.g., HOSP-12345)
- View the hospital dashboard

**Test Account 3 (Blood Bank):**
- Register another organization account
- Select "Blood Bank" as organization type
- Enter license number (e.g., BB-67890)
- View the blood bank dashboard with inventory

## Project Structure

```
lifeflow/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
│
├── server/              # Backend (Express)
│   ├── prisma/          # Database schema
│   │   ├── schema.prisma
│   │   └── dev.db       # SQLite database
│   ├── routes/          # API routes
│   │   └── auth.js      # Auth endpoints
│   ├── server.js        # Express server
│   └── package.json
│
└── package.json         # Root package.json
```

## Features Implemented in Phase 1

✅ User authentication (login/register)
✅ JWT-based authorization
✅ Role-based access control (RBAC)
✅ Three user types: Donor, Hospital, Blood Bank
✅ Dynamic dashboard routing based on role
✅ Organization profile for hospitals/blood banks
✅ Donor profile with blood group
✅ Beautiful, responsive UI
✅ SQLite database with Prisma ORM

## Next Steps (Future Phases)

- Blood request management
- Inventory tracking
- Donor appointment scheduling
- Real-time notifications
- Search and filtering
- Reports and analytics
