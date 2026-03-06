# SkillBridge - Setup Guide

Complete setup guide for running SkillBridge locally.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillBridge
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run seed    # Optional: Add sample tutors
npm run dev
```

✅ Backend will run on: **http://localhost:3000**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend will run on: **http://localhost:5173**

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@skillbridge.com
- **Password:** admin123

### Sample Tutor Accounts (after seeding)
All tutors use password: `tutor123`

- sarah.ahmed@example.com (Mathematics)
- karim.rahman@example.com (Computer Science)
- fatima.khan@example.com (Science)
- rahim.hossain@example.com (Languages)
- nadia.islam@example.com (Business)
- tanvir.ahmed@example.com (Arts & Humanities)

## 📁 Project Structure

```
SkillBridge/
├── backend/                 # Express API Server
│   ├── db/
│   │   └── schema.ts       # Database schema
│   ├── server.ts           # Main server file
│   ├── seed.ts             # Database seeding
│   ├── .env                # Environment variables
│   ├── package.json
│   └── skillbridge.db      # SQLite database
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:3000
```

## 📊 Database

The SQLite database is automatically created when you run the backend server.

### Seeding Sample Data

```bash
cd backend
npm run seed
```

This will add:
- 6 sample tutors
- Default categories
- Admin account (if not exists)

## 🌐 Accessing the Application

1. **Frontend:** http://localhost:5173
2. **Backend API:** http://localhost:3000/api

## 🧪 Testing the Setup

### Test Backend
```bash
curl http://localhost:3000/api/categories
```

### Test Frontend
Open browser and navigate to: http://localhost:5173

## 📝 Available Scripts

### Backend
```bash
npm run dev      # Start development server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Database Locked Error

Stop the backend server and restart:
```bash
# Stop: Ctrl+C
npm run dev
```

### CORS Issues

Make sure backend is running on port 3000 and frontend on port 5173.

### Module Not Found

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. **Register as a Student**
   - Go to http://localhost:5173/register
   - Select "Student" role
   - Browse tutors and book sessions

2. **Login as Tutor**
   - Use one of the seeded tutor accounts
   - Update your profile
   - Manage bookings

3. **Access Admin Panel**
   - Login with admin credentials
   - Manage users and categories
   - View platform statistics

## 📚 Additional Resources

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Feature List](./FEATURES.md)
- [Main README](./README.md)

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check browser console for errors

## 🎉 Success!

If you see:
- ✅ Backend: "🚀 Backend server running on http://localhost:3000"
- ✅ Frontend: "VITE ready in XXX ms"

You're all set! Open http://localhost:5173 and start exploring SkillBridge!
