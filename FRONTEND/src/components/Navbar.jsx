import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Dumbbell,
  Sparkles,
  Calendar,
  CreditCard,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <nav className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Flex<span className="text-cyan-400">Fit</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkStyle}>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Home
          </NavLink>

          <NavLink to="/classes" className={navLinkStyle}>
            <Calendar className="w-4 h-4 text-blue-400" />
            Classes
          </NavLink>

          {user && user.role === 'member' && (
            <NavLink to="/bookings" className={navLinkStyle}>
              <Calendar className="w-4 h-4 text-emerald-400" />
              My Bookings
            </NavLink>
          )}

          <NavLink to="/credits" className={navLinkStyle}>
            <CreditCard className="w-4 h-4 text-amber-400" />
            Credits
          </NavLink>
        </div>

        {/* Right Section: Auth Actions / Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'studio' && (
                <Link
                  to="/studio/dashboard"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  Studio Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Home
          </NavLink>

          <NavLink to="/classes" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
            <Calendar className="w-4 h-4 text-blue-400" />
            Classes
          </NavLink>

          {user && user.role === 'member' && (
            <NavLink to="/bookings" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
              <Calendar className="w-4 h-4 text-emerald-400" />
              My Bookings
            </NavLink>
          )}

          <NavLink to="/credits" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
            <CreditCard className="w-4 h-4 text-amber-400" />
            Credits
          </NavLink>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Signed in as <strong className="text-white">{user.name}</strong></span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {user.role}
                  </span>
                </div>

                {user.role === 'studio' && (
                  <NavLink to="/studio/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    Studio Dashboard
                  </NavLink>
                )}

                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkStyle}>
                  <User className="w-4 h-4 text-blue-400" />
                  My Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
