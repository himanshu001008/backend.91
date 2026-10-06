import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  Calendar,
  Clock,
  User,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Ticket
} from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams(); // classId from URL route parameter /booking-confirmation/:id
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, updateUser } = useAuth();

  const [fitnessClass, setFitnessClass] = useState(location.state?.fitnessClass || null);
  const [loadingClass, setLoadingClass] = useState(!location.state?.fitnessClass);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // 2. Fetch Class Details if not passed via location state
  useEffect(() => {
    if (!fitnessClass && id && isAuthenticated) {
      setLoadingClass(true);
      API.get(`/classes/${id}`)
        .then((res) => {
          const data = res.data?.data || res.data;
          setFitnessClass(data);
          setLoadingClass(false);
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load class information');
          setLoadingClass(false);
        });
    }
  }, [id, fitnessClass, isAuthenticated]);

  const handleConfirmBooking = async () => {
    if (!fitnessClass || !id) return;
    setErrorMessage('');
    setSuccessMessage('');
    setBookingLoading(true);

    try {
      const response = await API.post('/bookings', { classId: id });
      const bookingData = response.data?.data;

      // Update user state in AuthContext directly from backend response data (never hardcode)
      if (bookingData && bookingData.user) {
        updateUser(bookingData.user);
      }

      setSuccessMessage('Class booked successfully!');

      // Redirect to My Bookings after 1.5s delay for pleasant UX feedback
      setTimeout(() => {
        navigate('/bookings', { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Booking failed:', err);
      const msg = err.message || 'Failed to process class booking. Please try again.';
      setErrorMessage(msg);
      setBookingLoading(false);
    }
  };

  if (loadingClass) {
    return <Loading fullScreen text="Preparing booking confirmation..." />;
  }

  if (!fitnessClass) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <ErrorMessage
          title="Class Information Unavailable"
          message={errorMessage || 'Could not retrieve class details for booking.'}
        />
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/classes')}>
          Back to Classes
        </Button>
      </div>
    );
  }

  const {
    title,
    instructor,
    category,
    date,
    startTime,
    endTime,
    capacity = 20,
    bookedCount = 0
  } = fitnessClass;

  const availableSlots = Math.max(0, capacity - bookedCount);
  const currentCredits = user?.credits ?? 0;
  const hasEnoughCredits = currentCredits >= 1;
  const isFull = availableSlots === 0;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'TBD';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Back Link */}
      <button
        onClick={() => navigate(`/classes/${id}`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Class Details
      </button>

      {/* Confirmation Header */}
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20 inline-flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5" /> Class Reservation Confirmation
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Confirm Your Booking
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Review session specs and confirm credit redemption.
        </p>
      </div>

      {/* Confirmation Main Card */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <ErrorMessage
            title="Booking Error"
            message={errorMessage}
            onRetry={() => setErrorMessage('')}
          />
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-emerald-200">{successMessage}</div>
              <div className="text-xs text-emerald-400/80">Redirecting to My Bookings...</div>
            </div>
          </div>
        )}

        {/* Class Overview Summary */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Instructor: <strong className="text-white">{instructor}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Available: <strong className="text-white">{availableSlots} slots</strong></span>
            </div>
          </div>
        </div>

        {/* Credits Balance & Ledger Cost Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-sm">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>FlexFit Credits Balance</span>
            </div>
            <span className="text-lg font-extrabold text-amber-400">
              {currentCredits} Credits
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Booking Fee:</span>
            <span className="font-bold text-rose-400">- 1 Credit</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold pt-1 border-t border-slate-800/40">
            <span>Remaining Credits After Booking:</span>
            <span className="text-cyan-400 font-bold">{Math.max(0, currentCredits - 1)} Credits</span>
          </div>

          {!hasEnoughCredits && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Insufficient credits. You need at least 1 credit to book a class.</span>
            </div>
          )}
        </div>

        {/* Policies Note */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Full refund of 1 credit automatically returned if cancelled 2 hours prior to class.</span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center"
          isLoading={bookingLoading}
          disabled={!hasEnoughCredits || isFull || !!successMessage}
          onClick={handleConfirmBooking}
        >
          {successMessage
            ? 'Booking Confirmed!'
            : isFull
            ? 'Class Fully Booked'
            : !hasEnoughCredits
            ? 'Insufficient Credits'
            : 'Confirm & Reserve (1 Credit)'}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
