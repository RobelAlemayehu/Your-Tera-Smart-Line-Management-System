import { useParams } from "react-router-dom";
import { Bell } from "lucide-react";
import { Clock } from "lucide-react";
import "../../styles/servicedetail.css";
import Navbar from "@/components/layout/navbar"

const servicesData = {
  kebele: {
    title: "Services at Kebele Administration",
    services: [
      {
        name: "Birth Certificate Issuance",
        desc: "Obtain birth certificate for newborn or adult registration",
      },
      {
        name: "Residence Certificate",
        desc: "Get official residence or domicile certificate",
      },
      {
        name: "Business Permit (Local)",
        desc: "Register small business at kebele level",
      },
    ],
  },

  revenue: {
    title: "Services at Revenue Office",
    services: [
      {
        name: "Business License Registration",
        desc: "Register a new business and obtain operating license",
      },
      {
        name: "Tax Certificate Renewal",
        desc: "Renew your business tax certificate",
      },
      {
        name: "Import/Export Permit",
        desc: "Obtain permit for import/export activities",
      },
    ],
  },

  telecom: {
    title: "Services at Telecom Office",
    services: [
      {
        name: "SIM Card Registration",
        desc: "Register new SIM card for mobile services",
      },
      {
        name: "Telecommunications License",
        desc: "Apply for telecommunications operating license",
      },
      {
        name: "Service Provider Registration",
        desc: "Register as internet or mobile service provider",
      },
    ],
  },
};

const ServiceDetail = () => {
  const { type } = useParams();
  const data = servicesData[type];

  if (!data) return <h2>Service not found</h2>;

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>{data.title}</h1>
        <p>Select a service to view requirements and get your queue ticket.</p>

        <div className="cards">
          {data.services.map((service, index) => (
            <div className="card" key={index}>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <div className="schedule">
              <Clock size={14} />
              <span>Estimated time: 45 min</span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;