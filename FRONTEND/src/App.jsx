import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Classes from './pages/Classes';
import ClassDetails from './pages/ClassDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Authenticated Pages
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Credits from './pages/Credits';
import Profile from './pages/Profile';

// Role Dashboards
import MemberDashboard from './pages/MemberDashboard';
import StudioDashboard from './pages/StudioDashboard';
import CreateClass from './pages/CreateClass';
import EditClass from './pages/EditClass';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 1. PUBLIC ROUTES */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetails />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* 2. GENERAL AUTHENTICATED ROUTES (Member & Studio) */}
            <Route element={<ProtectedRoute />}>
              {/* Profile */}
              <Route path="profile" element={<Profile />} />

              {/* Credits */}
              <Route path="credits" element={<Credits />} />

              {/* Booking Confirmation (Supports /booking-confirmation and /booking-confirmation/:id) */}
              <Route path="booking-confirmation" element={<Navigate to="/classes" replace />} />
              <Route path="booking-confirmation/:id" element={<BookingConfirmation />} />
            </Route>

            {/* 3. MEMBER-ONLY PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['member']} />}>
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="member-dashboard" element={<MemberDashboard />} />
              <Route path="dashboard" element={<MemberDashboard />} />
            </Route>

            {/* 4. STUDIO-ONLY PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['studio']} />}>
              <Route path="studio-dashboard" element={<StudioDashboard />} />
              <Route path="studio/dashboard" element={<StudioDashboard />} />
              <Route path="create-class" element={<CreateClass />} />
              <Route path="studio/create-class" element={<CreateClass />} />
              <Route path="edit-class/:id" element={<EditClass />} />
              <Route path="studio/edit-class/:id" element={<EditClass />} />
            </Route>

            {/* 5. CATCH-ALL & 404 ROUTES */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
