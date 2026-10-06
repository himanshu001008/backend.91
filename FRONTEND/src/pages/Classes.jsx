import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import useDebounce from '../hooks/useDebounce';
import ClassCard from '../components/ClassCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import {
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  User,
  Clock,
  Users,
  X,
  Loader2
} from 'lucide-react';

const categories = ['All', 'Yoga', 'Gym', 'Zumba', 'Cardio', 'Strength', 'Pilates'];

const Classes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');
  const [sortOrder, setSortOrder] = useState('asc');

  // Debounce search input keyword (350ms delay to reduce unnecessary API hits)
  const debouncedKeyword = useDebounce(searchKeyword, 350);

  // API states
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Selected class for Details Modal
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Fetch fitness classes from Express backend API
   */
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (debouncedKeyword.trim()) {
      setIsSearching(true);
    }

    try {
      let endpoint = '/classes';
      const params = {};

      if (sortOrder) params.sort = sortOrder;

      // If user typed a search keyword or selected a specific date, query /api/classes/search
      if (debouncedKeyword.trim() || selectedDate) {
        endpoint = '/classes/search';
        if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();
        if (selectedDate) params.date = selectedDate;
      } else if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await API.get(endpoint, { params });
      let data = response.data;

      // Extract array payload
      if (data && Array.isArray(data.data)) {
        data = data.data;
      } else if (Array.isArray(data)) {
        data = data;
      } else {
        data = [];
      }

      // If category filter is active along with keyword search, filter results by category
      if (selectedCategory !== 'All' && (debouncedKeyword.trim() || selectedDate)) {
        data = data.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
      }

      setClasses(data);
    } catch (err) {
      console.error('Error searching classes:', err);
      // Handle search-specific 400 validation error (e.g. empty keyword error)
      if (err.status === 400) {
        setClasses([]);
      } else {
        setError(err.message || 'Failed to search fitness classes from server');
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [selectedCategory, debouncedKeyword, selectedDate, sortOrder]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Sync category filter changes with URL
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('All');
    setSearchKeyword('');
    setSelectedDate('');
    setSortOrder('asc');
    setSearchParams({});
  };

  const handleOpenDetails = (fitnessClass) => {
    const classId = fitnessClass._id || fitnessClass.id;
    if (classId) {
      navigate(`/classes/${classId}`);
    }
  };

  const handleBookFromModal = () => {
    setIsModalOpen(false);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/bookings');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Boutique Fitness Schedule
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Browse Fitness Classes
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Search classes by title, category, instructor name or date to find your next workout.
        </p>
      </div>

      {/* Search & Filter Bar Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search Input with Debounce & Clear Action */}
          <div className="md:col-span-5">
            <Input
              placeholder="Search (e.g. Yoga, Gym, Zumba, Cardio, Instructor)..."
              icon={Search}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              rightElement={
                isSearching ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : searchKeyword ? (
                  <button
                    onClick={handleClearSearch}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null
              }
            />
          </div>

          {/* Date Picker Input */}
          <div className="md:col-span-4">
            <Input
              type="date"
              icon={Calendar}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              rightElement={
                selectedDate ? (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Clear date"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null
              }
            />
          </div>

          {/* Sort Order Selector & Reset Filters Button */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="asc">Date: Soonest First</option>
              <option value="desc">Date: Latest First</option>
            </select>

            {(selectedCategory !== 'All' || searchKeyword || selectedDate) && (
              <button
                onClick={handleClearAllFilters}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                title="Reset All Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Loading type="cardSkeleton" />
          <Loading type="cardSkeleton" />
          <Loading type="cardSkeleton" />
        </div>
      ) : error ? (
        <ErrorMessage
          title="Could Not Load Fitness Classes"
          message={error}
          onRetry={fetchClasses}
        />
      ) : classes.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Classes Found</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {debouncedKeyword ? (
              <>
                No matching sessions found for <strong className="text-white">"{debouncedKeyword}"</strong>.
              </>
            ) : (
              'We couldn\'t find any fitness classes matching your selected filters.'
            )}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {searchKeyword && (
              <Button variant="secondary" size="sm" onClick={handleClearSearch} icon={X}>
                Clear Search
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleClearAllFilters} icon={RefreshCw}>
              Reset All Filters
            </Button>
          </div>
        </div>
      ) : (
        /* Classes Results Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <ClassCard
              key={item._id || item.id}
              fitnessClass={item}
              actionLabel="View Details"
              onAction={handleOpenDetails}
            />
          ))}
        </div>
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedClass.title}
          size="lg"
          primaryAction={handleBookFromModal}
          primaryActionLabel="Book Class Slot"
          secondaryActionLabel="Close"
        >
          <div className="space-y-5 text-slate-300">
            {selectedClass.imageUrl && (
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedClass.imageUrl}
                  alt={selectedClass.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Instructor: <strong className="text-white">{selectedClass.instructor}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>
                  Date:{' '}
                  <strong className="text-white">
                    {new Date(selectedClass.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Time: <strong className="text-white">{selectedClass.startTime} - {selectedClass.endTime}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>
                  Availability:{' '}
                  <strong className="text-white">
                    {selectedClass.capacity - (selectedClass.bookedCount || 0)} / {selectedClass.capacity} slots left
                  </strong>
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedClass.description || 'No detailed description provided for this session.'}
              </p>
            </div>

            {selectedClass.createdBy && (
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                <span>Hosted by <strong className="text-cyan-400">{selectedClass.createdBy.name || 'Partner Studio'}</strong></span>
                <span className="text-slate-400">{selectedClass.createdBy.email}</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Classes;
