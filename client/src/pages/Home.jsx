import { Link } from 'react-router-dom'
import { GiCoffeeBeans } from 'react-icons/gi'
import { MdOutlineDeliveryDining } from 'react-icons/md'
import { FaLeaf, FaStar } from 'react-icons/fa'
import { BsPersonWorkspace } from 'react-icons/bs'
import './Home.css'

function Home() {
  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        {/* Floating particles */}
        <div className="home-particles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="home-particle" />
          ))}
        </div>

        <div className="hero-content">
          <p className="hero-tagline">☕ Welcome to Brew &amp; Co</p>
          <h1>The Perfect Coffee<br />For Every Mood</h1>
          <p className="hero-desc">
            Handcrafted beverages made with the finest
            beans, served with warmth and passion.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn-primary">View Menu</Link>
            <Link to="/signup" className="btn-secondary">Join Us</Link>
          </div>
        </div>

      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="feature-card">
          <GiCoffeeBeans size={44} color="#c19a6b" />
          <h3>Fresh Beans</h3>
          <p>Sourced from the finest farms around the world</p>
        </div>
        <div className="feature-card">
          <BsPersonWorkspace size={44} color="#c19a6b" />
          <h3>Expert Baristas</h3>
          <p>Crafted by passionate coffee professionals</p>
        </div>
        <div className="feature-card">
          <MdOutlineDeliveryDining size={44} color="#c19a6b" />
          <h3>Fast Service</h3>
          <p>Your order ready in minutes, every time</p>
        </div>
        <div className="feature-card">
          <FaLeaf size={44} color="#c19a6b" />
          <h3>Organic</h3>
          <p>100% organic ingredients, naturally sourced</p>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="why-us">
        <p className="why-tagline">Our Promise</p>
        <h2>Why Choose Us?</h2>
        <div className="why-grid">
          {[
            'Premium Quality Beans',
            'Cozy Atmosphere',
            'Free WiFi',
            'Fresh Bakery Daily',
            'Loyalty Rewards',
            'Online Ordering',
          ].map((item) => (
            <div className="why-item" key={item}>
              <FaStar color="#c19a6b" size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="cta-block">
          <p>Ready to experience the difference?</p>
          <Link to="/reservations" className="btn-primary">Book a Table</Link>
        </div>
      </section>

    </div>
  )
}

export default Home