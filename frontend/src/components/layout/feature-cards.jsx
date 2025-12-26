const ServiceCard = ({ title, description, tags, image, reverse = false }) => (
  <div className={`service-card ${reverse ? 'reverse' : ''}`}>
    <div className="service-content">
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      <div className="service-tags">
        {tags.map((tag) => (
          <span key={tag} className="service-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="service-image">
      <img src={image || "/placeholder.svg"} alt={title} />
    </div>
  </div>
);

const FeatureCards = () => {
  return (
    <section className="feature-cards">
      <ServiceCard
        title="Revenue Office Queue & Service Management"
        description="Automate ticketing, organize customer flow, and reduce crowding with a smart queue system built for revenue offices. Improve efficiency and serve citizens faster."
        tags={["Fast Processing", "Queue Automation", "Real-time Monitoring"]}
        image="/images/revenue-office.png"
      />
      <ServiceCard
        title="Ethio Telecom Customer Service Queue"
        description="Deliver faster customer support with smart queue updates and real-time service notifications."
        tags={["Customer Flow", "Smart Tickets", "Service Display"]}
        image="/images/ethio-telecom.png"
        reverse
      />
      <ServiceCard
        title="Kebele Office"
        description="Handle IDs, certificates, and public services effortlessly with an organized digital queueing system."
        tags={["Citizen Services", "Organized Workflow", "Quick Processing"]}
        image="/images/kebele.png"
      />
    </section>
  );
};

export default FeatureCards;