import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  User,
  Users,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  CreditCard,
  Building2,
  Award
} from 'lucide-react';

const categoryColors = {
  Yoga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Gym: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Zumba: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Strength: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Pilates: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const defaultImages = {
  Yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
  Gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  Zumba: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  Cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80',
  Strength: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80'
};

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [fitnessClass, setFitnessClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await API.get(`/classes/${id}`);
        const data = response.data?.data || response.data;

        if (!data) {
          setNotFound(true);
        } else {
          setFitnessClass(data);
        }
      } catch (err) {
        console.error('Error fetching class details:', err);
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setError(err.message || 'Failed to load class details from backend');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      // User is logged in, navigate to booking confirmation screen
      navigate(`/booking-confirmation/${id}`, { state: { fitnessClass } });
    }
  };

  const handleRedirectToLogin = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location } });
  };

  if (loading) {
    return <Loading fullScreen text="Loading class details..." />;
  }

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Class Not Found</h2>
          <p className="text-slate-400 text-sm">
            The fitness class you are looking for does not exist or has been removed from the schedule.
          </p>
        </div>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/classes')}>
          Back to All Classes
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 space-y-6">
        <ErrorMessage
          title="Unable to Load Class Details"
          message={error}
          onRetry={() => window.location.reload()}
        />
        <div className="text-center">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/classes')}>
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  if (!fitnessClass) return null;

  const {
    title,
    description,
    instructor,
    category,
    date,
    startTime,
    endTime,
    capacity = 20,
    bookedCount = 0,
    imageUrl,
    createdBy
  } = fitnessClass;

  const availableSlots = Math.max(0, capacity - bookedCount);
  const isFull = availableSlots === 0;
  const bookedPercent = Math.min(100, Math.round((bookedCount / capacity) * 100));

  const displayImage = imageUrl || defaultImages[category] || defaultImages.Gym;
  const badgeClass = categoryColors[category] || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'TBD';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/classes')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Classes
      </button>

      {/* Main Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full bg-slate-950">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badgeClass}`}>
              {category}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                isFull
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : availableSlots <= 3
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isFull ? 'Class Sold Out' : `${availableSlots} Slots Available`}
            </span>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {description || 'No detailed description provided for this session.'}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <User className="w-4 h-4 text-cyan-400" /> Instructor
              </div>
              <div className="text-sm font-bold text-white truncate">{instructor}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Calendar className="w-4 h-4 text-blue-400" /> Session Date
              </div>
              <div className="text-sm font-bold text-white truncate">{formattedDate}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400" /> Time Slot
              </div>
              <div className="text-sm font-bold text-white truncate">
                {startTime} - {endTime}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Users className="w-4 h-4 text-emerald-400" /> Capacity
              </div>
              <div className="text-sm font-bold text-white">
                {bookedCount} / {capacity} booked
              </div>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Live Seat Availability</span>
              <span>{availableSlots} remaining out of {capacity}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  bookedPercent >= 90
                    ? 'bg-rose-500'
                    : bookedPercent >= 70
                    ? 'bg-amber-400'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${bookedPercent}%` }}
              />
            </div>
          </div>

          {/* Hosted Studio Info */}
          {createdBy && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">{createdBy.name || 'Studio Partner'}</div>
                  <div className="text-slate-400">{createdBy.email}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Verified Studio
              </span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Guaranteed Slot Reservation
              </div>
              <p>Cancel up to 2 hours before start time for an instant credit refund.</p>
            </div>

            <Button
              variant={isFull ? 'secondary' : 'primary'}
              size="lg"
              disabled={isFull}
              onClick={handleBookingClick}
              className="w-full sm:w-auto px-10 justify-center"
            >
              {isFull ? 'Class Sold Out' : 'Book Class Slot'}
            </Button>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal for Unauthenticated Users */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Authentication Required"
        primaryAction={handleRedirectToLogin}
        primaryActionLabel="Sign In to Book"
        secondaryActionLabel="Cancel"
      >
        <div className="space-y-4 text-slate-300 text-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white">Sign In to Reserve Your Seat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You must be logged in with a FlexFit member account to book fitness classes and redeem credits.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassDetails;
