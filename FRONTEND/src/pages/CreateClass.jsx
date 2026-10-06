import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import {
  PlusCircle,
  ArrowLeft,
  Dumbbell,
  Calendar,
  Clock,
  User,
  Users,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const categories = ['Yoga', 'Gym', 'Zumba', 'Cardio', 'Strength', 'Pilates'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

const CreateClass = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'Yoga',
    date: '',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    capacity: 20,
    imageUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  /**
   * Handle File Selection & Client-Side Image Validation
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validate File Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.'
      }));
      return;
    }

    // 2. Validate File Size (5MB Limit)
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: 'File size exceeds maximum limit of 5MB.'
      }));
      return;
    }

    // Clear previous errors & create object URL preview
    setErrors((prev) => ({ ...prev, image: '' }));
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Class title is required';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Class category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Class date is required';
    }

    if (!formData.startTime.trim()) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime.trim()) {
      newErrors.endTime = 'End time is required';
    }

    if (Number(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // If an image file is selected, use multipart/form-data
      if (selectedFile) {
        const bodyFormData = new FormData();
        bodyFormData.append('title', formData.title.trim());
        bodyFormData.append('description', formData.description.trim());
        bodyFormData.append('instructor', formData.instructor.trim());
        bodyFormData.append('category', formData.category);
        bodyFormData.append('date', formData.date);
        bodyFormData.append('startTime', formData.startTime.trim());
        bodyFormData.append('endTime', formData.endTime.trim());
        bodyFormData.append('capacity', Number(formData.capacity));
        bodyFormData.append('image', selectedFile);

        await API.post('/classes', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Standard JSON payload if using text URL or category default
        const payload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          instructor: formData.instructor.trim(),
          category: formData.category,
          date: formData.date,
          startTime: formData.startTime.trim(),
          endTime: formData.endTime.trim(),
          capacity: Number(formData.capacity),
          imageUrl: formData.imageUrl.trim()
        };

        await API.post('/classes', payload);
      }

      // Redirect back to studio dashboard after successful creation
      navigate('/studio/dashboard', { replace: true });
    } catch (err) {
      console.error('Error creating class:', err);
      setServerError(err.message || 'Failed to create class. Please verify inputs.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <button
        onClick={() => navigate('/studio/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Studio Dashboard
      </button>

      {/* Header */}
      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20 inline-flex items-center gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" /> Studio Management
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Create New Fitness Class
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Publish a new boutique session with optional photo upload to the FlexFit schedule.
        </p>
      </div>

      {/* Form Container */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {serverError && (
          <ErrorMessage
            title="Class Creation Failed"
            message={serverError}
            onRetry={() => setServerError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Title */}
          <Input
            label="Class Title"
            name="title"
            placeholder="e.g. Power Vinyasa Yoga & Mindfulness"
            icon={Dumbbell}
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the session goals, intensity level, and equipment needed..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Instructor & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Instructor Name"
              name="instructor"
              placeholder="e.g. Elena Rostova"
              icon={User}
              value={formData.instructor}
              onChange={handleChange}
              error={errors.instructor}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, StartTime, EndTime Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Date"
              name="date"
              type="date"
              icon={Calendar}
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />

            <Input
              label="Start Time"
              name="startTime"
              placeholder="09:00 AM"
              icon={Clock}
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
              required
            />

            <Input
              label="End Time"
              name="endTime"
              placeholder="10:00 AM"
              icon={Clock}
              value={formData.endTime}
              onChange={handleChange}
              error={errors.endTime}
              required
            />
          </div>

          {/* Capacity */}
          <Input
            label="Max Capacity"
            name="capacity"
            type="number"
            min="1"
            icon={Users}
            value={formData.capacity}
            onChange={handleChange}
            error={errors.capacity}
            required
          />

          {/* Image Selection & Preview Component */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Class Cover Image (File Upload or Image URL)
            </label>

            {/* Preview Box */}
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{selectedFile.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Firebase Upload
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors mr-2"
                  title="Remove Image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Upload Drop Area */}
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">Upload Image File</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WEBP, GIF (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Direct Image URL input */}
                <Input
                  label="Or Paste External Image URL"
                  name="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  icon={ImageIcon}
                  value={formData.imageUrl}
                  onChange={handleChange}
                  helperText="Use web photo URL if not uploading a file."
                />
              </div>
            )}

            {errors.image && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.image}
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/studio/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              icon={PlusCircle}
            >
              Publish Class
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
