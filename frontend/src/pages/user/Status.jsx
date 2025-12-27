import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Status.css";

function Status() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("waiting");
  const [queueData, setQueueData] = useState({
    number: "A12",
    totalInQueue: 27,
    joinedAt: "10:42 AM",
    progress: 0, // start at 0 and simulate progress
    service: "Passport Renewal",
    completedDate: "19 December 2025",
  });

  // Functions
  const handleLeaveQueue = () => setStatus("canceled");
  /*
  
    BACKEND-READY LEAVE QUEUE 
 
    const handleLeaveQueue = async () => {
      try {
        const res = await fetch("/api/queue/cancel", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to cancel queue");
        setStatus("canceled");
      } catch (err) {
        console.error(err);
        alert("Could not leave queue. Please try again.");
      }
    };
  */

  const handleReturnHome = () => navigate("/"); // go to landing page
  const handleBookAnother = () => navigate("/service"); // go to service page

  //  Simulate queue progress
  useEffect(() => {
    if (status === "waiting") {
      const interval = setInterval(() => {
        setQueueData((prev) => {
          const newProgress = prev.progress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setStatus("completed"); // auto complete when progress reaches 100%
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: newProgress };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  /*
    
    BACKEND-READY PROGRESS FETCH 
    useEffect(() => {
      const fetchQueueStatus = async () => {
        try {
          const res = await fetch("/api/queue/status", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) throw new Error("Failed to fetch queue status");
          const data = await res.json();

          setQueueData({
            number: data.queueNumber,
            totalInQueue: data.totalInQueue,
            joinedAt: new Date(data.joinedAt).toLocaleTimeString(),
            service: data.service.name,
            completedDate: data.completedAt
              ? new Date(data.completedAt).toDateString()
              : null,
            progress:
              data.totalInQueue && data.position
                ? ((data.totalInQueue - data.position) / data.totalInQueue) * 100
                : 0,
          });

          setStatus(data.status.toLowerCase());
        } catch (err) {
          console.error(err);
        }
      };

      fetchQueueStatus();
      const interval = setInterval(fetchQueueStatus, 5000);
      return () => clearInterval(interval);
    }, []);
  */

  return (
    <div className={`status-page ${status}`}>
      {/*  WAITING PAGE  */}
      {status === "waiting" && (
        <div className="page-wrapper waiting">
          <main className="top-section">
            <section className="queue-card">
              <p className="label">Your Number</p>
              <p className="value">{queueData.number}</p>

              <p className="label">Total in Queue</p>
              <p className="value">{queueData.totalInQueue}</p>

              <p className="label">Joined At</p>
              <p className="value">{queueData.joinedAt}</p>
            </section>

            <section className="queue-status">
              <div className="icon">⏳</div>
              <h2>Number of people ahead</h2>
              <p className="subtext">Estimated waiting time</p>

              <div className="progress-wrapper">
                <span className="progress-label">progress</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${queueData.progress}%` }}
                  ></div>
                </div>
                <div className="progress-meta">
                  <span>Joined</span>
                  <span>Your Turn</span>
                </div>
              </div>

              <button className="leave-btn" onClick={handleLeaveQueue}>
                Leave Queue
              </button>
            </section>
          </main>

          <section className="tips">
            <h4>💡 Tips while you wait</h4>
            <ul>
              <li>Keep your phone nearby for notification</li>
              <li>You can step away and come back when notified</li>
              <li>You will be notified when you're 5 people away</li>
            </ul>
          </section>
        </div>
      )}

      {/*  COMPLETED PAGE  */}
      {status === "completed" && (
        <main className="completion-page">
          <h1>Service Completed</h1>
          <p className="subtitle">Thank you for using YourTera</p>

          <section className="summary-card">
            <p>
              <span>Service:</span> {queueData.service}
            </p>
            <p>
              <span>Queue Number:</span> {queueData.number}
            </p>
            <p>
              <span>Completed on:</span> {queueData.completedDate}
            </p>
          </section>

          <div className="actions">
            <button className="btn secondary" onClick={handleReturnHome}>
              Return Home
            </button>
            <button className="btn primary" onClick={handleBookAnother}>
              Book Another Service
            </button>
          </div>
        </main>
      )}

      {/*  CANCELED PAGE  */}
      {status === "canceled" && (
        <main className="cancel-page">
          <h1>Queue Canceled</h1>
          <p className="subtitle">You left the queue</p>

          <section className="summary-card">
            <p>
              <span>Service:</span> {queueData.service}
            </p>
            <p>
              <span>Queue Number:</span> {queueData.number}
            </p>
          </section>

          <p className="next-text">What would you like to do next?</p>

          <div className="actions">
            <button className="btn" onClick={handleReturnHome}>
              Return Home
            </button>
            <button className="btn" onClick={handleBookAnother}>
              Book Another Service
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default Status;
