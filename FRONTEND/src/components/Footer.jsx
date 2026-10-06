import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Heart, Globe, Code2 } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span>Flex<span className="text-cyan-400">Fit</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-featured fitness booking platform empowering users to book boutique classes seamlessly with pre-paid credits.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-cyan-400 transition-colors">Explore Classes</Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-cyan-400 transition-colors">Credits Ledger</Link>
              </li>
            </ul>
          </div>

          {/* User Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Account & Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition-colors">Member Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-400 transition-colors">Create Account</Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-cyan-400 transition-colors">My Reservations</Link>
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">B.Tech Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built using Node.js, Express.js, MongoDB, JWT, Firebase Storage, and React + Vite.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Production Ready
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} FlexFit Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for B.Tech Viva Presentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
