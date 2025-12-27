import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../../styles/auth.css';

 function SignUp(){
   const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "", // put backend signup URL here
        {
          firstName,
          lastName,
          email,
          password
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const data = response.data;

      // Optionally store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setLoading(false);
      navigate("/signin"); // navigate to signin after signup

    } catch (error) {
      setLoading(false);
      if (error.response) {
        alert(error.response.data.message || "Sign up failed");
      } else {
        alert("Server not responding");
      }
    }
  };

    return(
        
        <div className="card">
            <h1>Create an account</h1>

            <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="field">
                    <label>First Name</label>
                    <input type="text"  
                    placeholder="First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                    />
                </div>
                <div className="field">
                    <label>Last Name</label>

                    <input type="text" 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required />

                </div>
            </div>

            <div className="field">
                <label>Email</label>
                <input type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />

            </div>

            <div className="field">
                <label>Password</label>

                <input type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />

            </div>
            <p id="p1">must contain at least 6 characters</p>

            <p className="terms">
                By signing up you agree with our
                <a href="#">Terms of Service</a> and
                <a href="#">Privacy Policy</a>
            </p>

              <button type="submit" className="btn-btn" disabled={loading}>
                 {loading ? "Signing Up..." : "Sign Up"}
              </button>

            </form>

            <div className="link">
            Already have an account? <Link to="/signin">Sign in</Link>
            </div>
        </div>
);
}

export default SignUp;