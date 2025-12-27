import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Rectangle34 from '../../assets/images/Rectangle34.png';
import '../../styles/auth.css';

function Verify(){  
    const location = useLocation();
    const email = location.state?.email; //get email from navigation state

      const [code, setCode] = useState(["", "", "", ""]);
      const [loading, setLoading] = useState(false);

     const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d?$/.test(value)) {  // only allow 0-9 or empty inputs
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput.focus();
        }
        }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otp = code.join(""); // combine 4 digits

        if (otp.length < 4) {
        alert("Please enter the 4-digit code");
        return;
        }

        setLoading(true);

        try {
        const response = await axios.post(
            "", // backend verify OTP endpoint
            { email, code: otp },
            { headers: { "Content-Type": "application/json" } }
        );

        const data = response.data;

        setLoading(false);

        if (data.success) {
            navigate("/reset-password", { state: { email: email } });  // go to reset password page and transfer email
        } else {
            alert(data.message || "Invalid code");
        }

        } catch (error) {
        setLoading(false);
        if (error.response) {
            alert(error.response.data.message || "Failed to verify code");
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
            <p>Reset code sent. Check your email or SMS</p>

          <form className="form-1"   onSubmit={handleSubmit}>
             <div className="code-inputs">
              {code.map((c, i) => (
             <input
                key={i}
                id={`code-${i}`}
                className="code-input"   // match your CSS
                type="text"
                maxLength="1"
                value={c}
                onChange={(e) => handleChange(e, i)}
                required
                />
            ))}
             </div>
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Confirm Code"}
          </button>
         </form>

        </div>
    </div>
    );
}

export default Verify;