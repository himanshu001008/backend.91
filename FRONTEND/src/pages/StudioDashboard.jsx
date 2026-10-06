import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  Building2,
  PlusCircle,
  Calendar,
  Clock,
  User,
  Users,
  Edit,
  Eye,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const categoryColors = {
  Yoga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Gym: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Zumba: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Strength: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Pilates: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const StudioDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [studioClasses, setStudioClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?._id || user?.id;

  const fetchStudioClasses = useCallback(async () => {
    if (authLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all classes and filter those created by this studio user
      const response = await API.get('/classes');
      const data = response.data?.data || response.data || [];

      if (Array.isArray(data)) {
        const myClasses = data.filter((item) => {
          const creatorId = item.createdBy?._id || item.createdBy;
          return creatorId === userId;
        });
        setStudioClasses(myClasses);
      } else {
        setStudioClasses([]);
      }
    } catch (err) {
      console.error('Error fetching studio classes:', err);
      setError(err.message || 'Failed to load studio management data');
    } finally {
      setLoading(false);
    }
  }, [userId, authLoading]);

  useEffect(() => {
    fetchStudioClasses();
  }, [fetchStudioClasses]);

  // Aggregate stats
  const totalCapacity = studioClasses.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalBooked = studioClasses.reduce((acc, curr) => acc + (curr.bookedCount || 0), 0);

  if (loading) {
    return <Loading fullScreen text="Loading Studio Management Portal..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 space-y-6">
        <ErrorMessage
          title="Studio Dashboard Error"
          message={error}
          onRetry={fetchStudioClasses}
        />
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/classes')}>
            Browse Schedule
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. STUDIO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <Building2 className="w-3.5 h-3.5" /> Studio Management Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Welcome, {user?.name || 'Studio Partner'}! 🏋️‍♂️
          </h1>
          <p className="text-slate-400 text-sm">
            Host new fitness sessions, manage class schedules, and track capacity utilization.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={PlusCircle}
          onClick={() => navigate('/studio/create-class')}
          className="shrink-0"
        >
          Create New Class
        </Button>
      </div>

      {/* 2. OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Created Classes */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hosted Sessions</div>
            <div className="text-4xl font-extrabold text-white">{studioClasses.length} <span className="text-base font-bold text-slate-400">Classes</span></div>
          </div>
          <p className="text-xs text-slate-400">Fitness sessions created and published by your studio.</p>
        </div>

        {/* Total Booked Participants */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Member Reservations</div>
            <div className="text-4xl font-extrabold text-emerald-400">{totalBooked} <span className="text-base font-bold text-slate-400">Members</span></div>
          </div>
          <p className="text-xs text-slate-400">Total member seats currently reserved across all sessions.</p>
        </div>

        {/* Total Capacity Hosted */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Hosted Capacity</div>
            <div className="text-4xl font-extrabold text-indigo-400">{totalCapacity} <span className="text-base font-bold text-slate-400">Slots</span></div>
          </div>
          <p className="text-xs text-slate-400">Cumulative maximum participant capacity across classes.</p>
        </div>
      </div>

      {/* 3. MANAGED CLASSES LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> Managed Fitness Classes ({studioClasses.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/studio/create-class')}
          >
            Add New Class
          </Button>
        </div>

        {studioClasses.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">No Classes Created Yet</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Start hosting boutique fitness sessions by creating your first class schedule.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={() => navigate('/studio/create-class')}
            >
              Create Your First Class
            </Button>
          </div>
        ) : (
          /* Classes List Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studioClasses.map((item) => {
              const categoryBadge = categoryColors[item.category] || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
              const availableSlots = Math.max(0, (item.capacity || 0) - (item.bookedCount || 0));

              const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'TBD';

              return (
                <div
                  key={item._id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 shadow-xl space-y-5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryBadge}`}>
                        {item.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                        {availableSlots} slots left
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Instructor: <strong className="text-white">{item.instructor}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Booked: <strong className="text-white">{item.bookedCount || 0} / {item.capacity}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(`/classes/${item._id}`)}
                    >
                      View Specs
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit}
                      onClick={() => navigate(`/studio/edit-class/${item._id}`)}
                    >
                      Edit Class
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioDashboard;
