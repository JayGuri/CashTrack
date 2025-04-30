import { Link } from "react-router-dom"
import { FaChartLine, FaCalendarAlt, FaTags, FaMobileAlt } from "react-icons/fa"
import "./LandingPage.css"

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="landing-logo">
              Cash<span className="logo-accent">Track</span>
            </div>
            <div className="landing-nav-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              Track Your Money <span className="text-accent">Like a Boss</span> 💸
            </h1>
            <p>The expense tracker that speaks your language. No more boring spreadsheets!</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <a href="#features" className="btn btn-outline btn-lg">
                See Features
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/expense-tracker-dashboard.png" alt="CashTrack App Dashboard" />
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose CashTrack? ✨</h2>
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
            <h2>Ready to take control of your finances?</h2>
            <p>Join thousands of users who've already leveled up their money management game.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Tracking Now
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              Cash<span className="logo-accent">Track</span>
            </div>
            <p>© 2023 CashTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
