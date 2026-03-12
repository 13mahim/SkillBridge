import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseTutors from './pages/BrowseTutors';
import TutorProfile from './pages/TutorProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditProfile from './pages/EditProfile';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<BrowseTutors />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Profile Route - Available for all logged in users */}
          <Route path="/profile" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/dashboard/*" element={
            <PrivateRoute roles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          {/* Tutor Routes */}
          <Route path="/tutor/*" element={
            <PrivateRoute roles={['tutor']}>
              <TutorDashboard />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
