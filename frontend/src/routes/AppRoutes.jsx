import { Routes, Route, Navigate } from "react-router-dom";

// Public
import Landing from "../pages/public/Landing";
import Services from "../pages/public/Services";
import ServiceDetail from "../pages/public/ServiceDetail";

// Auth
import  SignUp  from '../pages/auth/SignUp';
import  SignIn  from '../pages/auth/SignIn';
import ForgetPassword from '../pages/auth/ForgotPassword';
import Verify from "../pages/auth/Verify";
import ResetPassword from "../pages/auth/ResetPassword";
import Success from "../pages/auth/Success";

// User
import Status from "../pages/user/Status";
import Notifications from "../pages/user/Notifications";

import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetail />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgetPassword />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/success" element={<Success />} />

      <Route path="/status" element={<Status />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
