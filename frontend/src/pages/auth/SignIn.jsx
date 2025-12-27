import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

 function SignIn(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  //dont reload the page when submitting the form let react handle everything

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(
        "",   //here the url of the backend api to handle sign in will goes
        {
            email: email,
            password: password,
        },
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );

        // axios automatically converts response to JSON
        const data = response.data;
        if (data.token) {
           localStorage.setItem("token", data.token);
           navigate("/services");  //navigate to services page after successful login
           }
           else{
              alert(data.message || "Login failed");
           }
        
        // SUCCESS
        setLoading(false);
        
    

    } catch (error) {
        setLoading(false);

        // axios error handling
        if (error.response) {
        alert(error.response.data.message || "Login failed");
        } else {
        alert("Server not responding");
        }
    }
    };



    return(
        <div className="card">
            <h1>Welcome Back</h1>

         <form onSubmit = {handleSubmit}>
            <div className="field">
                <label>Email</label>

                <input type="email" placeholder="Email" required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  
                  />   

            </div>

            <div className="field">
                <label>Password</label>

                <input type="password" placeholder="Password" required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

            </div>
           <p id="p2"><Link to="/forgotpassword">Forgot Password?</Link></p>

            <button type="submit" className="btn-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}   
            </button>

            </form>

            <div className="link">
             Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default SignIn;