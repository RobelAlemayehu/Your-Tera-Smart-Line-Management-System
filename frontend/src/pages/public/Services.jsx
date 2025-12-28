import { useNavigate } from "react-router-dom";
import "../../styles/service.css";
import { Bell } from "lucide-react";
import Navbar from "@/components/layout/navbar"
const Services = () => {
  const navigate = useNavigate();

  return (
    <>
     <Navbar />
      <div className="container">
        <h1>Government Services</h1>
        <p>Select a government office to view the available services.</p>

        <div className="cards">
          <div className="card" onClick={() => navigate("/services/revenue")}>
            <h3>Revenue licence</h3>
            <p>Tax, licences to sell and permits</p>
          </div>

          <div className="card" onClick={() => navigate("/services/telecom")}>
            <h3>Ethio Telecom</h3>
            <p>Communications and Licence</p>
          </div>

          <div className="card" onClick={() => navigate("/services/kebele")}>
            <h3>Kebele Administration</h3>
            <p>Local administration and community services</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;