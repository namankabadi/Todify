import React from "react";
import "../css/HomeBody.css";
 // Add your image here
 import heroImg from "../assets/taskHero2.jpg";
import featureImg from "../assets/task.jpg"; 
import { isUserLoggedIn } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
const HomeBody = () => {
    const navigator = useNavigate();
    function handleGet(){
        navigator("/register")
    }
  return (
    <div className="home-body">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Stay Organized, Stay Ahead</h1>
          <p>
            Effortlessly manage your tasks, assign work, and track progress — all in one place.
          </p>
          {!isUserLoggedIn &&
          <button className="cta-btn" onClick={handleGet}>Get Started</button>}
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Task Management" />
        </div>
      </section>

      <section className="features-section">
        <div className="feature-text">
          <h2>Powerful Features</h2>
          <ul>
            <li>✅ Create & assign tasks</li>
            <li>📅 Set deadlines and priorities</li>
            <li>🔔 Get notifications</li>
            <li>📈 Track status & progress</li>
          </ul>
        </div>
        <div className="feature-image">
          <img src={featureImg} alt="Organize Tasks" />
        </div>
      </section>
    </div>
  );
};

export default HomeBody;
