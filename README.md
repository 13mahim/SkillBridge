# SkillBridge - Tutoring Platform

A full-stack tutoring platform connecting students with expert tutors.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Install all dependencies
npm run install:all

# Seed database (optional)
npm run seed

# Run backend (Terminal 1)
npm run dev:backend

# Run frontend (Terminal 2)
npm run dev:frontend
```

### Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## 📁 Project Structure

```
SkillBridge/
├── backend/          # Express API (Port 3000)
├── frontend/         # React App (Port 5173)
├── SETUP.md          # Detailed setup guide
└── README.md         # This file
```

## 🔐 Default Login

**Admin:**
- Email: admin@skillbridge.com
- Password: admin123

**Sample Tutors:** (after seeding)
- Password: tutor123 for all

## ✨ Features

- 🔍 Browse & search tutors
- ⭐ Ratings & reviews
- 📅 Session booking
- 👥 User management (Admin)
- 📚 Category management
- 💰 Tutor profiles with rates

## 🛠️ Tech Stack

**Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion
**Backend:** Express.js, SQLite, JWT Auth

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed installation
- [Backend Docs](./backend/README.md)
- [Frontend Docs](./frontend/README.md)

## 🎯 Quick Commands

```bash
npm run install:all      # Install all dependencies
npm run dev:backend      # Start backend server
npm run dev:frontend     # Start frontend app
npm run seed             # Seed sample data
npm run build:frontend   # Build frontend
```

## 📖 Learn More

1. Register as a student or tutor
2. Browse tutors by category
3. Book sessions
4. Leave reviews
5. Admin can manage users & categories

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📄 License

MIT License - feel free to use this project!

---

Built with ❤️ for connecting students with expert tutors.
