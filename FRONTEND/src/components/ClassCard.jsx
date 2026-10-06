import React from 'react';
import { Calendar, Clock, User, Users, Flame, ChevronRight } from 'lucide-react';
import Button from './Button';

const categoryColors = {
  Yoga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Gym: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Zumba: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Strength: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Pilates: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const defaultImages = {
  Yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
  Gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  Zumba: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  Cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
  Strength: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
};

const ClassCard = ({
  fitnessClass,
  onAction,
  actionLabel = 'Book Class',
  actionVariant = 'primary',
  isLoading = false,
  isBooked = false,
  className = ''
}) => {
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
    availableSlots = capacity - bookedCount,
    imageUrl
  } = fitnessClass;

  const badgeClass = categoryColors[category] || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  const displayImage = imageUrl || defaultImages[category] || defaultImages.Gym;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : 'TBD';

  const bookedPercent = Math.min(100, Math.round((bookedCount / capacity) * 100));

  return (
    <div
      className={`group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col overflow-hidden ${className}`}
    >
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badgeClass}`}>
            {category}
          </span>
        </div>

        {/* Slots Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
              availableSlots === 0
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : availableSlots <= 3
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700'
            }`}
          >
            {availableSlots === 0 ? 'Full' : `${availableSlots} left`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instructor: <strong className="text-slate-200 font-semibold">{instructor}</strong></span>
          </div>

          {description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Schedule Info */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{startTime} - {endTime}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-500" /> Capacity
              </span>
              <span>{bookedCount} / {capacity} booked</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
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

          {/* Action Footer */}
          <div className="pt-2">
            <Button
              variant={isBooked ? 'secondary' : actionVariant}
              size="sm"
              className="w-full justify-center"
              isLoading={isLoading}
              disabled={availableSlots === 0 && !isBooked}
              onClick={() => onAction && onAction(fitnessClass)}
            >
              {isBooked ? 'Booked' : availableSlots === 0 ? 'Class Full' : actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
