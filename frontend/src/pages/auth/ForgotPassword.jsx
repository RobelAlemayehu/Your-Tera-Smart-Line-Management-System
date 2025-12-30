import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Rectangle34 from '../../assets/images/Rectangle34.png';
import '../../styles/auth.css';

function ForgetPassword(){
    const [emailOrPhone, setEmailOrPhone] = useState("");
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
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setLoading(false);
            navigate("/verify", { state: { email: emailOrPhone } });
            
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
            <img src={Rectangle34} alt="Forgot Password" />

            <div className="card-2">
                <h1>Forgot Password</h1>
                <p>Enter your email or phone number and we'll send you a confirmation code to reset your password.</p>

                <form className="form-1" onSubmit={handleSubmit}>
                    <input 
                        type="text"  
                        placeholder="Email or Phone Number"  
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
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