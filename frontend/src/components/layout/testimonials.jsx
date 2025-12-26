import { useState } from "react";

const clients = [
  {
    id: "gov",
    title: "Government Service Officer",
    location: "Addis Ababa, Ethiopia",
    quote: "Before using this system, our queues were chaotic. Now everything is organized, digital, and transparent",
    author: "Henok T., Revenue Officer",
    avatar: "/images/testimonal1.png",
  },
  {
    id: "telecom",
    title: "Telecom Customer Support Agent",
    location: "Hawassa, Ethiopia",
    quote: "The real-time notifications have transformed how we handle peak hours. Our customers are much happier now.",
    author: "Sara M., Support Agent",
    avatar: "/images/testimonal2.png",
  },
  {
    id: "student",
    title: "AAU Student",
    location: "Addis Ababa, Ethiopia",
    quote: "I can now check my position in the queue from my phone. No more wasting hours standing in line.",
    author: "Abebe K., Student",
    avatar: "/images/testimonal2.png",
  },
];

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState("gov");
  const activeClient = clients.find((c) => c.id === activeTab);

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Hear From Our Happy Clients</h2>

        <div className="testimonials-content">
          <div className="testimonials-tabs">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setActiveTab(client.id)}
                className={`testimonial-tab ${activeTab === client.id ? 'active' : ''}`}
              >
                <h4>{client.title}</h4>
                <p className="tab-location">{client.location}</p>
              </button>
            ))}
          </div>

          <div className="testimonial-display">
            <div className="testimonial-quote">
              <p className="quote-text">"{activeClient.quote}"</p>
              <div className="quote-author">
                <div className="author-avatar">
                  <img
                    src={activeClient.avatar || "/placeholder.svg"}
                    alt={activeClient.author}
                  />
                </div>
                <p className="author-name">{activeClient.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
