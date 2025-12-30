import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Rectangle34 from "../../assets/images/Rectangle34.png";
import "../../styles/auth.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "", // backend reset password endpoint
        { email, password: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      setLoading(false);

      if (data.success) {
        navigate("/success");
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        alert(error.response.data.message || "Server error");
      } else {
        alert("Server not responding");
      }
    }
  };

  return (
    <div className="card-1">
      <img src={Rectangle34} alt="Reset Password" />

      <div className="card-2 reset-card">
        <h1 className="reset-title">Reset Password</h1>
        <p className="reset-subtitle">please create your new password</p>

        <form className="form-1" onSubmit={handleSubmit}>
          <div className="field-1">
            <label>New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowNewPassword((v) => !v)}
              >
                👁
              </button>
            </div>
            <p className="reset-hint">Must contain at least 8 characters</p>
          </div>

          <div className="field-1">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                👁
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Confirming..." : "Confirm Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;