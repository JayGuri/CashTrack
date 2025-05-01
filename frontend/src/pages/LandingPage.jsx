import { Link } from "react-router-dom"
import { FaChartLine, FaCalendarAlt, FaTags, FaMobileAlt, FaRupeeSign } from "react-icons/fa"
import StarBorder from "../components/StarBorder"
import "./LandingPage.css"

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="landing-logo">
              Cash<span className="logo-accent">Track</span> <FaRupeeSign className="rupee-logo" />
            </div>
            <div className="landing-nav-buttons">
              <Link to="/login">
                <StarBorder as="span" className="btn btn-secondary" color="#00897b" speed="5s">
                  Login
                </StarBorder>
              </Link>
              <Link to="/signup">
                <StarBorder as="span" className="btn btn-primary" color="#1e88e5" speed="5s">
                  Sign Up
                </StarBorder>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="text-accent">Track Your Money </span>
            </h1>
            <h1>
              <span className="text-accent">Like a Boss</span>
            </h1>
            <p>The expense tracker that speaks your language. No more boring spreadsheets!</p>
            <div className="hero-buttons">
              <Link to="/signup">
                <StarBorder as="span" className="btn btn-primary btn-lg" color="#1e88e5" speed="5s">
                  Get Started Free
                </StarBorder>
              </Link>
              <a href="#features">
                <StarBorder as="span" className="btn btn-outline btn-lg" color="#4caf50" speed="5s">
                  See Features
                </StarBorder>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <FaRupeeSign className="hero-rupee" />
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">
            Why Choose CashTrack? <FaRupeeSign />
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Visual Analytics</h3>
              <p>See where your money goes with colorful charts and graphs that actually make sense.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaCalendarAlt />
              </div>
              <h3>Calendar View</h3>
              <p>Track daily expenses with an intuitive calendar interface. No day goes unnoticed!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTags />
              </div>
              <h3>Custom Categories</h3>
              <p>Create your own expense categories that match your unique spending habits.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaMobileAlt />
              </div>
              <h3>Mobile Friendly</h3>
              <p>Track expenses on the go - works perfectly on your phone, tablet, or computer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>
              Ready to take control of your finances? <FaRupeeSign />
            </h2>
            <p>Join thousands of users who've already leveled up their money management game.</p>
            <Link to="/signup">
              <StarBorder as="span" className="btn btn-primary btn-lg" color="#1e88e5" speed="5s">
                Start Tracking Now
              </StarBorder>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              Cash<span className="logo-accent">Track</span> <FaRupeeSign />
            </div>
            <p>© 2025 CashTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
