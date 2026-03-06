# SkillBridge Frontend

React frontend application for SkillBridge tutoring platform.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- React Router DOM
- Vite
- Lucide React (icons)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Footer.tsx
│   └── Navbar.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── BrowseTutors.tsx
│   ├── TutorProfile.tsx
│   ├── StudentDashboard.tsx
│   ├── TutorDashboard.tsx
│   └── AdminDashboard.tsx
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Features

### Student Features
- Browse and search tutors
- View tutor profiles
- Book sessions
- Manage bookings
- Leave reviews

### Tutor Features
- Manage profile
- View bookings
- Complete sessions
- Track reviews

### Admin Features
- Manage users
- Manage categories
- View all bookings
- Platform statistics

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Type check with TypeScript

## Design System

- Primary Color: Emerald (#10B981)
- Border Radius: 2xl, 3xl
- Font: System fonts
- Animations: Framer Motion

## Pages

- `/` - Home page
- `/tutors` - Browse tutors
- `/tutors/:id` - Tutor profile
- `/login` - Login
- `/register` - Register
- `/dashboard` - Student dashboard
- `/tutor` - Tutor dashboard
- `/admin` - Admin dashboard
