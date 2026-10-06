import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Button from '../components/Button';
import ClassCard from '../components/ClassCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CreditCard,
  Award,
  Zap,
  ShieldCheck,
  Search,
  Check,
  Flame,
  Activity,
  HeartPulse,
  Clock,
  ChevronRight
} from 'lucide-react';

// Categories dataset with descriptions, icons, and badge colors
const categories = [
  {
    name: 'Yoga',
    icon: Activity,
    description: 'Enhance flexibility, core strength, and mental mindfulness through guided posture flows.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    count: '12+ Classes'
  },
  {
    name: 'Strength',
    icon: Dumbbell,
    description: 'Build lean muscle mass, power, and metabolic resilience with progressive resistance training.',
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    count: '18+ Classes'
  },
  {
    name: 'Cardio',
    icon: HeartPulse,
    description: 'High-intensity cardiovascular drills engineered to maximize calorie burn and stamina.',
    color: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
    count: '15+ Classes'
  },
  {
    name: 'Zumba',
    icon: Flame,
    description: 'High-energy rhythmic dance workout blending Latin music beats with full-body exercise.',
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
    count: '10+ Classes'
  },
  {
    name: 'Pilates',
    icon: Sparkles,
    description: 'Low-impact core conditioning focusing on alignment, spinal stability, and muscular control.',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    count: '8+ Classes'
  }
];

// Fallback featured classes matching backend Class schema exactly
const fallbackClasses = [
  {
    _id: 'sample-1',
    title: 'Sunrise Power Vinyasa Yoga',
    description: 'Dynamic flow synchronizing movement with breath. Perfect for building mobility and mental focus.',
    instructor: 'Elena Rostova',
    category: 'Yoga',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    capacity: 20,
    bookedCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'sample-2',
    title: 'Full-Body HIIT & Hypertrophy',
    description: 'High-intensity functional strength training targeting major muscle groups with resistance weights.',
    instructor: 'Marcus Vance',
    category: 'Strength',
    date: new Date(Date.now() + 172800000).toISOString(),
    startTime: '05:30 PM',
    endTime: '06:30 PM',
    capacity: 15,
    bookedCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'sample-3',
    title: 'Pulse Zumba Dance Cardio',
    description: 'Exhilarating aerobic dance workout featuring upbeat music tracks and calorie-shredding routines.',
    instructor: 'Sophia Martinez',
    category: 'Zumba',
    date: new Date(Date.now() + 259200000).toISOString(),
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    capacity: 25,
    bookedCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Attempt fetching real classes from API backend
    API.get('/classes')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (data.length > 0) {
          setFeaturedClasses(data.slice(0, 3));
        } else {
          setFeaturedClasses(fallbackClasses);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback gracefully to curated sample classes if backend is unseeded or offline
        setFeaturedClasses(fallbackClasses);
        setLoading(false);
      });
  }, []);

  const handleBookClass = (fitnessClass) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/classes');
    }
  };

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-wider uppercase shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>FlexFit Boutique Fitness Booking</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Train. Book.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Transform.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover boutique fitness classes, reserve your spot instantly with pre-paid credits, and elevate your health journey with FlexFit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={Search}
              onClick={() => navigate('/classes')}
              className="w-full sm:w-auto px-8"
            >
              Explore Classes
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8"
            >
              Get Started
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">50+</div>
              <div className="text-xs text-slate-400 font-medium">Daily Studio Sessions</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Guaranteed Slots</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">1-Click</div>
              <div className="text-xs text-slate-400 font-medium">Credit Reservations</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4.9★</div>
              <div className="text-xs text-slate-400 font-medium">Member Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITNESS CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore Fitness Categories
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Find the workout style that matches your goals and energy level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/classes?category=${cat.name}`)}
                className={`group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center border`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>{cat.count}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW FLEXFIT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How FlexFit Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Booking your next fitness workout has never been smoother.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Discover a Class</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Filter by fitness category, preferred date, time slot, and instructor to find the session that fits your schedule.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Book Your Slot</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Confirm your seat instantly using pre-paid FlexFit credits with real-time slot availability verification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-extrabold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Attend & Train</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Arrive at the studio, present your booking confirmation, and crush your workout session hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose FlexFit?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Designed to deliver a seamless fitness booking experience for members and studios alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Easy Booking</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              1-tap class reservations with instant confirmation and automated calendar updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Availability</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Live capacity tracking prevents overbooking and ensures your slot is always guaranteed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Membership Credits</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Flexible credit system allows you to pay per class with seamless instant refunds on cancellation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Professional Trainers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Access certified top-tier fitness instructors across Yoga, HIIT, Zumba, and Pilates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED CLASSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Upcoming Sessions
            </div>
            <h2 className="text-3xl font-extrabold text-white">Featured Classes</h2>
          </div>
          <Link
            to="/classes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Classes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Loading type="cardSkeleton" />
            <Loading type="cardSkeleton" />
            <Loading type="cardSkeleton" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredClasses.map((item) => (
              <ClassCard
                key={item._id || item.id}
                fitnessClass={item}
                onAction={handleBookClass}
                actionLabel="Book Slot"
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. CALL-TO-ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-indigo-900/40 border border-cyan-500/20 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join FlexFit today and claim your introductory credits to start booking boutique fitness classes immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8"
              >
                Register Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/classes')}
                className="w-full sm:w-auto px-8"
              >
                Browse All Classes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
