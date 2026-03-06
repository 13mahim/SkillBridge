# SkillBridge Backend

Express.js backend API for SkillBridge tutoring platform with MVC architecture.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Database connection
│   │   └── index.ts      # App configuration
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── tutorController.ts
│   │   ├── bookingController.ts
│   │   ├── categoryController.ts
│   │   ├── reviewController.ts
│   │   └── adminController.ts
│   ├── models/           # Database schema
│   │   └── database.ts   # Schema definitions
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── tutorRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── adminRoutes.ts
│   ├── middlewares/      # Custom middlewares
│   │   ├── auth.ts       # Authentication
│   │   └── cors.ts       # CORS handling
│   └── index.ts          # Main server file
├── db/                   # Database files
│   └── skillbridge.db    # SQLite database
├── seed.ts               # Database seeding script
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JWT
- **Password Hashing:** bcrypt.js

## 📦 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `POST /logout` - Logout user

### Tutors (`/api/tutors`)
- `GET /` - Get all tutors (with filters)
- `GET /:id` - Get tutor profile with reviews
- `PUT /profile` - Update tutor profile (auth required)

### Bookings (`/api/bookings`)
- `POST /` - Create new booking (auth required)
- `GET /` - Get user's bookings (auth required)
- `PATCH /:id/status` - Update booking status (auth required)

### Reviews (`/api/reviews`)
- `POST /` - Submit review (auth required)

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `POST /` - Add category (admin only)
- `DELETE /:id` - Delete category (admin only)

### Admin (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `PATCH /users/:id/status` - Update user status (admin only)

## 🔐 Default Credentials

**Admin:**
- Email: admin@skillbridge.com
- Password: admin123

**Sample Tutors (after seeding):**
- All tutors: password is `tutor123`

## 🗄️ Database Schema

- **users** - User accounts (students, tutors, admins)
- **tutor_profiles** - Tutor information and settings
- **bookings** - Session bookings
- **reviews** - Student reviews for tutors
- **categories** - Subject categories

## 🛠️ Scripts

```bash
npm run dev      # Start development server
npm run seed     # Seed database with sample data
npm run build    # Build TypeScript to JavaScript
```

## 🏗️ Architecture

### MVC Pattern
- **Models:** Database schema and data access
- **Views:** JSON responses (REST API)
- **Controllers:** Business logic and request handling

### Middleware Chain
1. CORS handling
2. JSON body parsing
3. Cookie parsing
4. Authentication (where required)
5. Authorization (role-based)

### Security Features
- JWT-based authentication
- HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control
- SQL injection prevention
- CORS protection

## 📝 Development

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Register route in `src/index.ts`

### Adding Middleware

1. Create middleware in `src/middlewares/`
2. Apply in routes or globally in `src/index.ts`

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/health

# Get categories
curl http://localhost:3000/api/categories
```

## 📖 Learn More

- [Main Documentation](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [Setup Guide](../SETUP.md)
