import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or the link you followed might be broken.
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
            Go to Homepage
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Search}
            onClick={() => navigate('/classes')}
            className="w-full sm:w-auto"
          >
            Find Classes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
