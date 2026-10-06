import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Ticket,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const categoryColors = {
  Yoga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Gym: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Zumba: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Strength: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Pilates: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const statusStyles = {
  confirmed: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    label: 'Confirmed'
  },
  cancelled: {
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
    icon: XCircle,
    label: 'Cancelled'
  },
  waitlisted: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: Clock3,
    label: 'Waitlisted'
  }
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'cancelled'

  // Cancellation Modal state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  /**
   * Fetch authenticated user's bookings strictly using user._id from AuthContext
   */
  const fetchUserBookings = useCallback(async () => {
    if (authLoading) return;
    const userId = user?._id || user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.get(`/bookings/user/${userId}`);
      let data = response.data;

      if (data && Array.isArray(data.data)) {
        data = data.data;
      } else if (Array.isArray(data)) {
        data = data;
      } else {
        data = [];
      }

      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to retrieve your reservations from backend');
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  /**
   * Handle Booking Cancellation via DELETE /api/bookings/:id
   */
  const handleCancelBookingSubmit = async () => {
    if (!selectedBookingForCancel) return;
    setCancelError('');
    setCancelLoading(true);

    try {
      const response = await API.delete(`/bookings/${selectedBookingForCancel._id}`);
      const updatedBooking = response.data?.data;

      // Update AuthContext user credits (+1 refund from backend response)
      if (updatedBooking && updatedBooking.user && typeof updatedBooking.user.credits === 'number') {
        updateUser({ credits: updatedBooking.user.credits });
      } else if (user) {
        updateUser({ credits: (user.credits || 0) + 1 });
      }

      setToastMessage('Booking cancelled successfully. 1 credit has been refunded!');
      setSelectedBookingForCancel(null);

      // Refresh bookings list from backend
      await fetchUserBookings();

      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Ticket className="w-3.5 h-3.5" /> Member Reservations
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            My Bookings
          </h1>
          <p className="text-slate-400 text-sm">
            View and manage your upcoming boutique fitness class reservations.
          </p>
        </div>

        {/* User Credits Balance Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Available Credits</div>
            <div className="text-lg font-extrabold text-amber-400">{user?.credits ?? 0} Credits</div>
          </div>
        </div>
      </div>

      {/* Toast Alert Message */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'confirmed'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Active ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cancelled'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate('/classes')} className="self-start sm:self-auto shrink-0">
          Explore More Classes
        </Button>
      </div>

      {/* Main Content States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Loading type="cardSkeleton" />
          <Loading type="cardSkeleton" />
        </div>
      ) : error ? (
        <ErrorMessage
          title="Could Not Load Bookings"
          message={error}
          onRetry={fetchUserBookings}
        />
      ) : filteredBookings.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Reservations Found</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {activeTab === 'all'
              ? 'You haven\'t booked any fitness classes yet. Browse our schedule to reserve your first session.'
              : `You have no ${activeTab} reservations.`}
          </p>
          <Button variant="primary" size="md" icon={ArrowRight} onClick={() => navigate('/classes')}>
            Browse Schedule & Book
          </Button>
        </div>
      ) : (
        /* Bookings List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((item) => {
            const classInfo = item.class || {};
            const statusConfig = statusStyles[item.status] || statusStyles.confirmed;
            const StatusIcon = statusConfig.icon;

            const categoryBadge = categoryColors[classInfo.category] || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

            const formattedDate = classInfo.date
              ? new Date(classInfo.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'TBD';

            return (
              <div
                key={item._id}
                className={`p-6 rounded-3xl border bg-slate-900/60 shadow-xl flex flex-col justify-between space-y-5 transition-all ${
                  item.status === 'cancelled' ? 'border-slate-800/60 opacity-75' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryBadge}`}>
                      {classInfo.category || 'Fitness'}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusConfig.badge}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white line-clamp-1">
                    {classInfo.title || 'Fitness Session'}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Instructor: <strong className="text-white">{classInfo.instructor || 'Staff'}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Time: <strong className="text-white">{classInfo.startTime || 'TBD'} - {classInfo.endTime || 'TBD'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Booked on {new Date(item.createdAt || item.bookingDate || Date.now()).toLocaleDateString()}
                  </div>

                  {item.status === 'confirmed' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => setSelectedBookingForCancel(item)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingForCancel && (
        <Modal
          isOpen={!!selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
          title="Cancel Reservation?"
          primaryAction={handleCancelBookingSubmit}
          primaryActionLabel="Confirm Cancellation"
          secondaryActionLabel="Keep Booking"
          isLoading={cancelLoading}
        >
          <div className="space-y-4 text-slate-300 text-sm">
            {cancelError && (
              <ErrorMessage title="Cancellation Error" message={cancelError} />
            )}

            <p className="leading-relaxed">
              Are you sure you want to cancel your reservation for{' '}
              <strong className="text-white">
                {selectedBookingForCancel.class?.title || 'this session'}
              </strong>
              ?
            </p>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>1 FlexFit Credit</strong> will be instantly refunded back to your balance upon confirmation.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBookings;
