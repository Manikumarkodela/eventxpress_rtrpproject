import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col">
          <Link to="/" className="logo">eventXpress</Link>
          <p>Simplifying the massive chaos of event planning by instantly bridging the gap between top professionals and ready customers.</p>
          <div className="social-links">
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
        
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#vendors">Vendor Marketplace</a></li>
            <li><a href="#blog">Blog & Insights</a></li>
            <li><a href="#events">Popular Events</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety Center</a></li>
            <li><a href="#">Cancellation Policy</a></li>
            <li><Link to="/vendor-dashboard">Vendor Tools</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul>
            <li><a href="mailto:hello@eventxpress.com"><i className="fa-regular fa-envelope"></i> hello@eventxpress.com</a></li>
            <li><a href="#"><i className="fa-solid fa-phone"></i> +91 98765 43210</a></li>
            <li><a href="#"><i className="fa-solid fa-location-dot"></i> Hyderabad, TS</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 eventXpress Technologies. All rights reserved.</p>
        <p>Designed with <i className="fa-solid fa-heart" style={{color: 'var(--primary)'}}></i> for Event Planners</p>
      </div>
    </footer>
  );
};

export default Footer;
