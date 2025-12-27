import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Rectangle34 from '../../assets/images/Rectangle34.png';
import '../../styles/auth.css';

function ResetPassword(){

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // get email from Verify page

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
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
        navigate("/success"); // navigate to Success page
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


    return(
            <div className="card-1">
        <img src={Rectangle34} />
    
        <div className="card-2">
            <h1>Forgot Password</h1>
            <p>Please enter your Email or Phone Number to receive confirmation code</p>

         <form  className="form-1" onSubmit={handleSubmit}>
              <div className="field-1">
                <label>New Password</label>
                <input type="password" 
                placeholder=" Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required />
            </div>
            <p id="p3">must contain at least 6 characters</p>

            <div className="field-1">
                <label>Confirm Password</label>
                <input type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required />
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