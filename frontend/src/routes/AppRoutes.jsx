import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Public
import Landing from "../pages/public/Landing";
import About from "../pages/public/About";
import TestAbout from "../pages/public/TestAbout";
import Services from "../pages/public/Services";
import ServiceDetail from "../pages/public/ServiceDetail";

// Auth
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import ForgetPassword from "../pages/auth/ForgotPassword";
import Verify from "../pages/auth/Verify";
import ResetPassword from "../pages/auth/ResetPassword";
import Success from "../pages/auth/Success";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Customer
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import MyTicket from "../pages/customer/MyTicket";

// User (legacy routes - keeping for backward compatibility)
import Status from "../pages/user/Status";
import Notifications from "../pages/user/Notifications";

import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/test" element={<TestAbout />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:type" element={<ServiceDetail />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgetPassword />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/success" element={<Success />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute requiredRole="Customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/my-ticket"
        element={
          <ProtectedRoute requiredRole="Customer">
            <MyTicket />
          </ProtectedRoute>
        }
      />

      {/* Legacy User Routes - keeping for backward compatibility */}
      <Route path="/status" element={<Status />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
