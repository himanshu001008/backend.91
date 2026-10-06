import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Zap,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';

const Credits = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();

  const [creditBalance, setCreditBalance] = useState(user?.credits ?? null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?._id || user?.id;

  /**
   * Fetch live credit balance from backend API (GET /api/credits/user/:id)
   */
  const fetchCreditsAndBookings = useCallback(async () => {
    if (authLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch live credit balance from database endpoint
      const creditRes = await API.get(`/credits/user/${userId}`);
      const fetchedCredits = creditRes.data?.credits ?? 0;

      setCreditBalance(fetchedCredits);
      // Sync AuthContext user state directly from backend response
      updateUser({ credits: fetchedCredits });

      // 2. Fetch user bookings to display credits activity summary
      try {
        const bookingsRes = await API.get(`/bookings/user/${userId}`);
        const bookingsData = bookingsRes.data?.data || bookingsRes.data || [];
        setUserBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (bErr) {
        // Non-blocking if bookings fetch fails
        setUserBookings([]);
      }

    } catch (err) {
      console.error('Error fetching credits:', err);
      setError(err.message || 'Failed to retrieve user credit balance from server');
    } finally {
      setLoading(false);
    }
  }, [userId, authLoading, updateUser]);

  useEffect(() => {
    fetchCreditsAndBookings();
  }, [fetchCreditsAndBookings]);

  // Derive confirmed vs cancelled booking metrics directly from backend booking records
  const confirmedBookingsCount = userBookings.filter((b) => b.status === 'confirmed').length;
  const cancelledBookingsCount = userBookings.filter((b) => b.status === 'cancelled').length;

  if (loading) {
    return <Loading fullScreen text="Fetching live credit balance..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 space-y-6">
        <ErrorMessage
          title="Could Not Load Credits"
          message={error}
          onRetry={fetchCreditsAndBookings}
        />
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" /> FlexFit Wallet & Credits Ledger
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Credits Balance
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage your boutique fitness credits and view class redemption history.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={fetchCreditsAndBookings}
        >
          Refresh Balance
        </Button>
      </div>

      {/* Main Balance Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current Credits */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Live Balance
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Available Credits</div>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
              {creditBalance ?? 0} <span className="text-lg font-bold text-slate-300">Credits</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Ready to redeem for any boutique Yoga, Strength, Cardio, Zumba or Pilates class.
          </p>
        </div>

        {/* Card 2: Active Class Reservations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Redeemed
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Bookings</div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {confirmedBookingsCount} <span className="text-lg font-bold text-slate-400">Classes</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Currently reserved sessions consuming 1 credit each.
          </p>
        </div>

        {/* Card 3: Refunded Credits */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Refunded
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cancelled Refunds</div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
              {cancelledBookingsCount} <span className="text-lg font-bold text-slate-400">Credits</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Credits returned back to your balance upon cancellation.
          </p>
        </div>
      </div>

      {/* Credit System Explanation Section */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">How the FlexFit Credit System Works</h3>
            <p className="text-xs text-slate-400">Transparent 1-click class reservations and instant refunds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Zap className="w-4 h-4 text-cyan-400" /> 1 Credit = 1 Class
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every boutique session across Yoga, Gym, Zumba, Cardio, and Pilates costs exactly 1 FlexFit credit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Refund Policy
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plans change? Cancel your booking at least 2 hours before start time and 1 credit is automatically refunded.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Award className="w-4 h-4 text-amber-400" /> 10 Welcome Credits
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              New accounts automatically receive 10 complimentary credits upon registration to get started immediately.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400">
            Want to book your next workout session? Browse our upcoming schedule.
          </div>
          <Button variant="primary" size="md" icon={ArrowRight} onClick={() => navigate('/classes')}>
            Browse Schedule & Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Credits;
