import { useState } from "react"

const testimonials = [
  {
    id: 1,
    role: "Government Service Officer",
    location: "Addis Ababa, Ethiopia",
    quote: "Before using this system, our queues were chaotic. Now everything is organized, digital, and transparent",
    author: "Henok T.",
    authorRole: "Revenue Officer",
    avatar: "/images/avatar1.png",
  },
  {
    id: 2,
    role: "Telecom Customer Support Agent",
    location: "Hawassa, Ethiopia",
    quote: "The real-time tracking has significantly reduced customer frustration. They know exactly when their turn is coming.",
    author: "Sara M.",
    authorRole: "Support Lead",
    avatar: "/images/avatar2.png",
  },
  {
    id: 3,
    role: "AAU Student",
    location: "Addis Ababa, Ethiopia",
    quote: "I can join the queue from my dorm and only head to the office when I'm 5 people away. It's a lifesaver!",
    author: "Dawit K.",
    authorRole: "Student",
    avatar: "/images/avatar3.png",
  },
]

export default function Testimonials() {
  const [activeId, setActiveId] = useState(1)
  const activeTestimonial = testimonials.find((t) => t.id === activeId) || testimonials[0]

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Hear From Our Happy Clients</h2>

        <div className="testimonials-content">
          <div className="testimonials-tabs">
            {testimonials.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`testimonial-tab ${activeId === t.id ? 'active' : ''}`}
              >
                <h4>{t.role}</h4>
                <div className="tab-location">{t.location}</div>
              </button>
            ))}
          </div>

          <div className="testimonial-display">
            <div className="testimonial-quote">
              <p className="quote-text">"{activeTestimonial.quote}"</p>
              <div className="quote-author">
                <div className="author-avatar">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.author}
                  />
                </div>
                <div className="author-name">
                  {activeTestimonial.author}, {activeTestimonial.authorRole}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}