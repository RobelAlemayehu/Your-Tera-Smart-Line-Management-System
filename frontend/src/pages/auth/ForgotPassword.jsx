import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rectangle34 from '../../assets/images/Rectangle34.png';
import '../../styles/auth.css';

function ForgetPassword(){

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrPhone) {
      alert("Please enter your email or phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "", // backend endpoint for forgot password
        { contact: emailOrPhone },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      // Optionally store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setLoading(false);

      // Navigate to verification page after sending code
      navigate("/verify", { state: { email: emailOrPhone } }); // pass emailOrPhone to Verify page
      
    } catch (error) {
      setLoading(false);
      if (error.response) {
        alert(error.response.data.message || "Failed to send code");
      } else {
        alert("Server not responding");
      }
    }
  };


    return (
    <div className="card-1">
        <img src={Rectangle34} />

        <div className="card-2">
            <h1>Forgot Password</h1>
            <p>Please enter your Email or Phone Number to receive confirmation code</p>

            <form className="form-1"   onSubmit={handleSubmit}>
                <input type="text"  
                placeholder="Email or Phone Number"  
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                   <br />
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                 </button>
            </form>

        </div>
    </div>
    );
}

export default ForgetPassword;