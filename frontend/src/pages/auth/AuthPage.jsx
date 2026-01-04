import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import "../../styles/auth.css";

const AuthPage = ({ initialMode = "signup" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(
    initialMode === "signin" ? "signin" : "signup"
  );
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMode(initialMode === "signin" ? "signin" : "signup");
  }, [initialMode]);

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "signup") {
        // Validate password confirmation
        if (formValues.password !== formValues.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        
        // Register new user
        const response = await authService.register({
          email: formValues.email,
          password: formValues.password,
          username: formValues.fullName,
          phone_number: formValues.phoneNumber
        });
        
        if (response.data) {
          alert("Registration successful! Please sign in.");
          navigate("/signin");
        }
      } else {
        // Login
        const response = await authService.login({
          email: formValues.email,
          password: formValues.password
        });

        if (response.data.token && response.data.user) {
          const userData = {
            user_id: response.data.user.user_id,
            role: response.data.user.role,
            email: formValues.email
          };
          
          login(userData, response.data.token);
          
          // Redirect based on role
          if (response.data.user.role === "Admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/customer/dashboard");
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    navigate(nextMode === "signup" ? "/signup" : "/signin");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>{mode === "signup" ? "Create an account" : "Sign in"}</h1>

          <div className="divider">Welcome</div>

        {error && (
          <div className="auth-error" style={{ 
            padding: "0.75rem", 
            marginBottom: "1rem", 
            background: "#fee", 
            color: "#c33", 
            borderRadius: "4px",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formValues.fullName}
                onChange={handleChange("fullName")}
                required
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="field">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formValues.phoneNumber}
                onChange={handleChange("phoneNumber")}
                required
              />
            </div>
          )}

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleChange("password")}
              required
              minLength={mode === "signup" ? 8 : undefined}
            />
            {mode === "signup" && (
              <small>Must contain at least 8 characters</small>
            )}
            {mode === "signin" && (
              <p className="forgot-password-link">
                <span onClick={() => navigate("/forgotpassword")}>
                  Forgot Password?
                </span>
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formValues.confirmPassword}
                onChange={handleChange("confirmPassword")}
                required
                minLength={8}
              />
            </div>
          )}

          {mode === "signup" && (
            <p className="terms">
              By signing up you agree with our{" "}
              <span role="button" tabIndex={0}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span role="button" tabIndex={0}>
                Privacy Policy
              </span>
            </p>
          )}

          <button className="submit-btn" type="submit" disabled={submitting}>
            {submitting
              ? mode === "signup"
                ? "Signing Up..."
                : "Signing In..."
              : mode === "signup"
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <p className="switch">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => switchMode("signin")}>Sign In</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => switchMode("signup")}>Sign Up</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

