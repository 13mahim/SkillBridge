# SkillBridge - Architecture Documentation

## 📐 Project Architecture

### Overall Structure

```
SkillBridge/
├── backend/              # Express.js API (MVC Pattern)
├── frontend/             # React SPA
├── README.md             # Main documentation
├── SETUP.md              # Setup instructions
├── FEATURES.md           # Feature list
└── ARCHITECTURE.md       # This file
```

## 🔧 Backend Architecture (MVC Pattern)

### Directory Structure

```
backend/
├── src/
│   ├── config/           # Configuration
│   │   ├── database.ts   # DB connection
│   │   └── index.ts      # App config
│   │
│   ├── models/           # Data Layer
│   │   └── database.ts   # Schema & initialization
│   │
│   ├── controllers/      # Business Logic
│   │   ├── authController.ts
│   │   ├── tutorController.ts
│   │   ├── bookingController.ts
│   │   ├── categoryController.ts
│   │   ├── reviewController.ts
│   │   └── adminController.ts
│   │
│   ├── routes/           # API Routes
│   │   ├── authRoutes.ts
│   │   ├── tutorRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── adminRoutes.ts
│   │
│   ├── middlewares/      # Custom Middleware
│   │   ├── auth.ts       # Authentication
│   │   └── cors.ts       # CORS handling
│   │
│   └── index.ts          # Server entry point
│
├── db/                   # Database files
│   └── skillbridge.db    # SQLite database
│
├── seed.ts               # Data seeding
└── package.json
```

### Request Flow

```
Client Request
    ↓
CORS Middleware
    ↓
Body Parser
    ↓
Cookie Parser
    ↓
Route Handler
    ↓
Authentication Middleware (if required)
    ↓
Authorization Middleware (if required)
    ↓
Controller
    ↓
Database Model
    ↓
Response
```

### Layer Responsibilities

#### 1. Config Layer
- Database connection setup
- Environment variables
- Application configuration

#### 2. Models Layer
- Database schema definitions
- Database initialization
- Direct database access

#### 3. Controllers Layer
- Request validation
- Business logic
- Response formatting
- Error handling

#### 4. Routes Layer
- URL mapping
- Middleware application
- Controller binding

#### 5. Middlewares Layer
- Authentication
- Authorization
- CORS handling
- Error handling

## 🎨 Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── contexts/         # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── BrowseTutors.tsx
│   │   ├── TutorProfile.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── TutorDashboard.tsx
│   │   └── AdminDashboard.tsx
│   │
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
│
├── index.html
├── vite.config.ts
└── package.json
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
    ├── Navbar
    ├── Routes
    │   ├── Home
    │   ├── BrowseTutors
    │   ├── TutorProfile
    │   ├── Login
    │   ├── Register
    │   ├── StudentDashboard (Protected)
    │   ├── TutorDashboard (Protected)
    │   └── AdminDashboard (Protected)
    └── Footer
```

## 🔐 Authentication Flow

### Registration
```
1. User submits form
2. Frontend sends POST /api/auth/register
3. Backend hashes password
4. Creates user in database
5. Generates JWT token
6. Sets HTTP-only cookie
7. Returns user data
```

### Login
```
1. User submits credentials
2. Frontend sends POST /api/auth/login
3. Backend verifies password
4. Generates JWT token
5. Sets HTTP-only cookie
6. Returns user data
```

### Protected Routes
```
1. Request includes cookie
2. Middleware extracts token
3. Verifies JWT signature
4. Checks user role (if needed)
5. Attaches user to request
6. Proceeds to controller
```

## 📊 Database Schema

### Tables

1. **users**
   - id, name, email, password, role, status, created_at

2. **tutor_profiles**
   - id, user_id, bio, hourly_rate, subjects, rating, review_count, availability

3. **bookings**
   - id, student_id, tutor_id, start_time, end_time, status, created_at

4. **reviews**
   - id, booking_id, student_id, tutor_id, rating, comment, created_at

5. **categories**
   - id, name, slug

### Relationships

```
users (1) ←→ (1) tutor_profiles
users (1) ←→ (N) bookings (as student)
users (1) ←→ (N) bookings (as tutor)
bookings (1) ←→ (1) reviews
users (1) ←→ (N) reviews (as student)
users (1) ←→ (N) reviews (as tutor)
```

## 🔄 Data Flow Examples

### Booking a Session

```
Frontend (Student)
    ↓ POST /api/bookings
Backend Controller
    ↓ Validate user is student
    ↓ Check tutor availability
    ↓ Create booking record
Database
    ↓ Return booking ID
Backend
    ↓ Send success response
Frontend
    ↓ Update UI
    ↓ Redirect to dashboard
```

### Leaving a Review

```
Frontend (Student)
    ↓ POST /api/reviews
Backend Controller
    ↓ Validate booking exists
    ↓ Check booking is completed
    ↓ Create review record
    ↓ Calculate new tutor rating
    ↓ Update tutor profile
Database
    ↓ Commit transaction
Backend
    ↓ Send success response
Frontend
    ↓ Update UI
```

## 🛡️ Security Measures

### Backend
- JWT authentication
- HTTP-only cookies
- Password hashing (bcrypt)
- Role-based access control
- SQL injection prevention
- CORS protection

### Frontend
- Protected routes
- Auth context
- Secure cookie handling
- Input validation
- XSS prevention

## 🚀 Deployment Considerations

### Backend
- Environment variables
- Database backups
- Error logging
- Rate limiting (future)
- API versioning (future)

### Frontend
- Build optimization
- Code splitting
- Asset optimization
- CDN deployment
- Environment configs

## 📈 Scalability

### Current Architecture
- Monolithic backend
- Single database
- Suitable for small to medium scale

### Future Improvements
- Microservices architecture
- Database replication
- Caching layer (Redis)
- Message queue
- Load balancing

## 🧪 Testing Strategy

### Backend
- Unit tests for controllers
- Integration tests for routes
- Database tests

### Frontend
- Component tests
- Integration tests
- E2E tests

## 📝 Code Standards

### TypeScript
- Strict mode enabled
- Type safety enforced
- Interface definitions

### Naming Conventions
- camelCase for variables/functions
- PascalCase for components/classes
- UPPER_CASE for constants

### File Organization
- One component per file
- Grouped by feature
- Clear separation of concerns
