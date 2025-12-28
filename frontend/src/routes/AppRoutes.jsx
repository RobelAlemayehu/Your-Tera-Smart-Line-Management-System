import { Routes, Route } from "react-router-dom";

// Public
import Landing from "../pages/public/Landing";
import About from "../pages/public/About";
import TestAbout from "../pages/public/TestAbout";
import Services from "../pages/public/Services";
import ServiceDetail from "../pages/public/ServiceDetail";

// Auth
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// User
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/status" element={<Status />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
