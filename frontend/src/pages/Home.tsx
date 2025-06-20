import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Professional Photo Shoot Bookings</h2>
        <p>
          Book your perfect photo session with our professional photographers. 
          From portraits to events, we capture your special moments beautifully.
        </p>
        {user ? (
          <Link to="/bookings" className="cta-button">
            Book Your Session
          </Link>
        ) : (
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        )}
      </div>

      <div className="features-section">
        <h3>Our Services</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Portrait Photography</h4>
            <p>
              Professional headshots, family portraits, and personal branding photos 
              that capture your best self.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Wedding Photography</h4>
            <p>
              Beautiful wedding photography to capture your special day with 
              artistic and candid moments.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Event Photography</h4>
            <p>
              Corporate events, parties, and special occasions documented 
              with professional quality and style.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Commercial Photography</h4>
            <p>
              Product photography, real estate, and business marketing 
              images that showcase your brand professionally.
            </p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h3>Why Choose Us?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Easy Booking</h4>
            <p>
              Simple online booking system with instant confirmation 
              and flexible scheduling options.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Professional Quality</h4>
            <p>
              Experienced photographers with top-quality equipment 
              ensuring stunning results every time.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Flexible Locations</h4>
            <p>
              Studio sessions or on-location photography to suit 
              your preferences and needs.
            </p>
          </div>
          
          <div className="feature-card">
            <h4>Quick Delivery</h4>
            <p>
              Fast turnaround times with high-resolution digital 
              files and optional prints available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 