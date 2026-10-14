# MEDISEVA 360
### "One Platform. Every Hospital. Smarter Healthcare."

A unified healthcare web application for government and private hospital discovery, appointment coordination, and patient service management.

> **⚠️ DEMO MODE** — All hospital listings, patient data, appointments, and transactions are **fictional sample data** for demonstration purposes. Not connected to real hospitals, real payment gateways, or medical systems.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

App runs at: **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|-------------|
| Patient | `patient@demo.mediseva` | `Demo@123` | `/patient/dashboard` |
| Receptionist | `receptionist@demo.mediseva` | `Demo@123` | `/receptionist/dashboard` |
| Admin | `admin@demo.mediseva` | `Demo@123` | `/admin/dashboard` |

---

## 📋 Complete Demo Walkthrough

1. Open **http://localhost:5173** → Landing page
2. Click **"Find a Hospital"** → Hospital directory with filters
3. Open any hospital → **View Details** → tabs for Overview, Services, Reviews, Book Appointment
4. Go to **Login** → use patient credentials → **Patient Dashboard**
5. Book appointment from a hospital's detail page (must be logged in)
6. Log out → Login as **Receptionist** → View pending requests
7. **Accept or Reject** the appointment request
8. Log out → Login as **Patient** → Status updated in dashboard
9. Login as **Admin** → View system overview and reports

---

## 🗂️ Routes

| Path | Description |
|------|-------------|
| `/` | Public landing page |
| `/hospitals` | Hospital search & directory |
| `/hospitals/:id` | Hospital detail with booking |
| `/book-appointment` | Standalone booking page |
| `/login` | Login with demo credentials |
| `/register` | New patient registration |
| `/patient/dashboard` | Patient overview |
| `/patient/appointments` | Appointment history & management |
| `/patient/notifications` | Notifications center |
| `/patient/transactions` | Transaction history & receipts |
| `/patient/profile` | Profile & settings |
| `/receptionist/dashboard` | Receptionist overview |
| `/receptionist/appointments` | Accept/reject requests |
| `/receptionist/queue` | Queue management board |
| `/receptionist/notifications` | Receptionist notifications |
| `/receptionist/hospital` | Hospital profile view |
| `/admin/dashboard` | Admin system overview |
| `/admin/hospitals` | Hospital directory management |
| `/admin/users` | User management |
| `/admin/appointments` | All appointments view |
| `/admin/reports` | Analytics & reports |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| State | Zustand (with localStorage persistence) |
| Icons | Lucide React |
| Dates | date-fns |
| Build | Vite |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── appointments/
│   │   └── AppointmentForm.tsx      # Booking form component
│   ├── auth/
│   │   └── ProtectedRoute.tsx       # Route guard
│   ├── layout/
│   │   ├── DashboardLayout.tsx      # Sidebar layout
│   │   ├── DemoBanner.tsx           # Top demo warning banner
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── PageLayout.tsx           # Public page wrapper
│   └── ui/
│       ├── ConfirmModal.tsx
│       ├── DemoBanner.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── NotificationBell.tsx
│       └── StatusBadge.tsx
├── data/
│   └── demoData.ts                  # All fictional demo data
├── pages/
│   ├── auth/                        # Login, Register
│   ├── patient/                     # Patient dashboard pages
│   ├── receptionist/                # Receptionist portal
│   ├── admin/                       # Admin dashboard
│   ├── HomePage.tsx                 # Landing page
│   ├── HospitalsPage.tsx            # Hospital directory
│   ├── HospitalDetailPage.tsx       # Hospital detail + booking
│   └── AppointmentBookingPage.tsx   # Standalone booking
├── store/
│   └── appStore.ts                  # Zustand global state
├── types/
│   └── index.ts                     # TypeScript types
└── utils/
    └── helpers.ts                   # Utility functions
```

---

## ✅ Implemented Features

| Feature | Status |
|---------|--------|
| Landing page with search | ✅ Complete |
| Hospital discovery + filters | ✅ Complete |
| Hospital detail page | ✅ Complete |
| Patient registration & login | ✅ Complete (demo auth) |
| Appointment booking form | ✅ Complete |
| Appointment status workflow | ✅ Complete |
| Patient dashboard | ✅ Complete |
| Patient appointments history | ✅ Complete |
| Patient notifications | ✅ Complete |
| Patient transactions & receipts | ✅ Complete |
| Receptionist dashboard | ✅ Complete |
| Accept/Reject appointments | ✅ Complete |
| Queue management board | ✅ Complete |
| Admin dashboard | ✅ Complete |
| Hospital directory management | ✅ Complete (demo) |
| User management | ✅ Complete (demo) |
| Reports & analytics | ✅ Complete |
| Status history audit trail | ✅ Complete |
| Notification system | ✅ Complete |
| Role-based route protection | ✅ Complete |
| Responsive mobile layout | ✅ Complete |
| Demo mode disclosure | ✅ Complete throughout |

---

## 🔮 Simulated (Not Real)

- **Authentication**: Demo credentials only, stored in Zustand + localStorage. No real auth server.
- **Hospital data**: Fictional. Phone numbers masked with XXXX. No real hospitals.
- **Appointments**: Not sent to any real hospital. Demo reference numbers only.
- **Payments**: No real payment gateway. Fictional transaction records.
- **Maps**: Directions link to Google Maps using address string. No map embed.
- **Notifications**: In-app only. No email/SMS sent.
- **Database**: Zustand persisted to localStorage. Resets if cleared.

---

## 🔧 To Make Production-Ready

1. **Backend**: Connect Supabase/PostgreSQL with RLS policies
2. **Auth**: Use Supabase Auth or Firebase Auth
3. **Hospitals**: Import real hospital data from authoritative sources
4. **Maps**: Configure Google Maps API key
5. **Payments**: Integrate Razorpay/Stripe with server-side webhook verification
6. **Notifications**: Add Firebase Cloud Messaging or similar
7. **Environment**: Add `.env` file with API keys (never commit secrets)

---

## 🔒 Security Notes

- No real patient data is stored
- No real payment credentials are collected
- All data is demo/fictional
- Passwords are not stored securely (demo only — would use bcrypt + backend in production)
- Row-level security would be enforced via Supabase RLS in production

---

*Built for national-level student hackathon demonstration.*
*MEDISEVA 360 — "One Platform. Every Hospital. Smarter Healthcare."*
