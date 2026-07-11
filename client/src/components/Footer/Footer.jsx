import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>☕ Brew & Co</h3>
          <p>The perfect coffee for every mood.</p>
        </div>

 <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>        

  <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📍 123 Coffee Lane, Lucknow</p>
          <p>📞 +91 630723974066</p>
          <p>✉️ hello@brewandco.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Brew & Co. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer