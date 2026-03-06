# SkillBridge Backend

Express.js backend API for SkillBridge tutoring platform.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT Authentication
- bcrypt.js

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Tutors
- `GET /api/tutors` - Get all tutors (with filters)
- `GET /api/tutors/:id` - Get tutor profile with reviews
- `PUT /api/tutor/profile` - Update tutor profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Submit review

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/admin/categories` - Add category (admin only)
- `DELETE /api/admin/categories/:id` - Delete category (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/status` - Update user status (admin only)

## Default Credentials

**Admin:**
- Email: admin@skillbridge.com
- Password: admin123

**Sample Tutors:**
- Password: tutor123 for all seeded tutors

## Database Schema

- `users` - User accounts
- `tutor_profiles` - Tutor information
- `bookings` - Session bookings
- `reviews` - Student reviews
- `categories` - Subject categories

## Scripts

- `npm run dev` - Start development server
- `npm run seed` - Seed database with sample data
