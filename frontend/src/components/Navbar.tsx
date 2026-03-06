import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Browse Tutors', path: '/tutors' },
    ...(user ? [
      { 
        name: 'Dashboard', 
        path: user.role === 'admin' ? '/admin' : user.role === 'tutor' ? '/tutor' : '/dashboard' 
      }
    ] : [])
  ];

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <GraduationCap className="w-8 h-8" />
            <span>SkillBridge</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-neutral-600 hover:text-emerald-600 transition-colors font-medium">
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
                <span className="text-sm text-neutral-500">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-neutral-600 hover:text-emerald-600 font-medium">Login</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-600 font-medium py-2"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="bg-emerald-600 text-white font-medium py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-neutral-600 font-medium py-2">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium text-center">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
