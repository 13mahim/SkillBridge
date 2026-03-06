import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 pt-16 pb-8 text-neutral-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-emerald-500 font-bold text-2xl">
              <GraduationCap className="w-10 h-10" />
              <span>SkillBridge</span>
            </Link>
            <p className="leading-relaxed">
              Empowering learners by connecting them with world-class tutors. Personalized education for everyone, everywhere.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/tutors" className="hover:text-emerald-500 transition-colors">Find a Tutor</Link></li>
              <li><Link to="/register" className="hover:text-emerald-500 transition-colors">Become a Tutor</Link></li>
              <li><Link to="/login" className="hover:text-emerald-500 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-500 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Popular Subjects</h4>
            <ul className="space-y-4">
              <li><Link to="/tutors?category=Mathematics" className="hover:text-emerald-500 transition-colors">Mathematics</Link></li>
              <li><Link to="/tutors?category=Science" className="hover:text-emerald-500 transition-colors">Science</Link></li>
              <li><Link to="/tutors?category=Languages" className="hover:text-emerald-500 transition-colors">Languages</Link></li>
              <li><Link to="/tutors?category=Computer Science" className="hover:text-emerald-500 transition-colors">Computer Science</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>123 Education Way, Learning Plaza, CA 94103</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>support@skillbridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
