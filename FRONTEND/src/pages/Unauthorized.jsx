import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Calendar } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10 animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
            403 Access Denied
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            You do not have permission to access this page. This section requires higher privileges or a different user role ({user ? `Current role: ${user.role}` : 'Not logged in'}).
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Home}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Return Home
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Calendar}
            onClick={() => navigate('/classes')}
            className="w-full sm:w-auto"
          >
            Explore Classes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
