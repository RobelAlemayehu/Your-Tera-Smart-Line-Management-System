import { Link } from 'react-router-dom';
import Vector from '../../assets/images/Vector.png';
import '../../styles/auth.css';

function Success(){
    return(
         <div className="card-2">
            <img src={Vector} /> 
            <h1>Password Changed Successfully</h1>
            <p>Reset code sent. Check your email or SMS</p>

           <Link to ="/signin"><button>Go To Sign in </button> </Link>

        </div>
    );
}

export default Success;