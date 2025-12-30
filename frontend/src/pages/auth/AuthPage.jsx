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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Customer", // "Admin" | "Customer" - matching backend enum
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
        // Register new user
        const username = `${formValues.firstName} ${formValues.lastName}`.trim() || formValues.email;
        const response = await authService.register({
          email: formValues.email,
          password: formValues.password,
          username: username,
          phone_number: null, // Optional field
          role: formValues.role // Already "Admin" or "Customer"
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

        <button className="google-btn" type="button">
          G Sign {mode === "signup" ? "Up" : "In"} with Google
        </button>

          <div className="divider">OR</div>

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
            <>
              <div className="row">
                <div className="field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formValues.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formValues.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Role</label>
                <select
                  value={formValues.role}
                  onChange={handleChange("role")}
                  required
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
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

