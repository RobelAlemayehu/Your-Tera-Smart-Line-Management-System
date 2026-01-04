import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rectangle34 from '../../assets/images/Rectangle34.png';
import '../../styles/auth.css';

function ForgetPassword(){
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            alert("Please enter your phone number");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/forgot-password",
                { phone_number: phoneNumber },
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            setLoading(false);
            navigate("/verify", { state: { phone_number: phoneNumber } });
            
        } catch (error) {
            setLoading(false);
            if (error.response) {
                alert(error.response.data.error || "Failed to send code");
            } else {
                alert("Server not responding");
            }
        }
    };

    return (
        <div className="card-1">
            <img src={Rectangle34} alt="Forgot Password" />

            <div className="card-2">
                <h1>Forgot Password</h1>
                <p>Enter your phone number and we'll send you a confirmation code to reset your password.</p>

                <form className="form-1" onSubmit={handleSubmit}>
                    <input 
                        type="tel"  
                        placeholder="Phone Number"  
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;