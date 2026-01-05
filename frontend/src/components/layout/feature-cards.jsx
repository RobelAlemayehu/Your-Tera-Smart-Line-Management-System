import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ title, description, image }) => {
  const navigate = useNavigate();
  
  return (
    <div className="service-card">
      <div className="service-image">
        <img src={image || "/placeholder.svg"} alt={title} />
      </div>
      <div className="service-content">
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
        <div 
          className="learn-more-link" 
          onClick={() => navigate('/about')}
        >
          Learn More >>
        </div>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  return (
    <section className="feature-cards">
      <ServiceCard
        title="Revenue Office Queue & Service Management"
        description="Automate ticketing, organize customer flow, and reduce crowding with a smart queue system built for revenue offices. Improve efficiency and serve citizens faster."
        image="/images/revenue-office.png"
      />
      <ServiceCard
        title="Ethio Telecom Customer Service Queue"
        description="Deliver faster customer support with smart queue updates and real-time service notifications."
        image="/images/ethio-telecom.png"
      />
      <ServiceCard
        title="Kebele Office"
        description="Handle IDs, certificates, and public services effortlessly with an organized digital queueing system."
        image="/images/kebele.png"
      />
    </section>
  );
};

export default FeatureCards;