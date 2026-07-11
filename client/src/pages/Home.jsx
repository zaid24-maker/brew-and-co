import { Link } from 'react-router-dom'
import { GiCoffeeCup, GiCoffeeBeans } from 'react-icons/gi'
import { MdOutlineDeliveryDining } from 'react-icons/md'
import { FaLeaf, FaStar } from 'react-icons/fa'
import { BsPersonWorkspace } from 'react-icons/bs'
import './Home.css'

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">☕ Welcome to Brew & Co</p>
          <h1>The Perfect Coffee<br />For Every Mood</h1>
          <p className="hero-desc">Handcrafted beverages made with the finest
            beans, served with warmth and passion.</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn-primary">View Menu</Link>
            <Link to="/signup" className="btn-secondary">Join Us</Link>
          </div>
        </div>
        <div className="hero-image">
          <GiCoffeeCup size={280} color="#d4a96a" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <GiCoffeeBeans size={40} color="#d4a96a" />
          <h3>Fresh Beans</h3>
          <p>Sourced from the finest farms around the world</p>
        </div>
        <div className="feature-card">
          <BsPersonWorkspace size={40} color="#d4a96a" />
          <h3>Expert Baristas</h3>
          <p>Crafted by passionate coffee professionals</p>
        </div>
        <div className="feature-card">
          <MdOutlineDeliveryDining size={40} color="#d4a96a" />
          <h3>Fast Service</h3>
          <p>Your order ready in minutes, every time</p>
        </div>
        <div className="feature-card">
          <FaLeaf size={40} color="#d4a96a" />
          <h3>Organic</h3>
          <p>100% organic ingredients, naturally sourced</p>
        </div>
      </section>

      <section className="why-us">
        <h2>Why Choose Us?</h2>
        <div className="why-grid">
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Premium Quality Beans</span>
          </div>
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Cozy Atmosphere</span>
          </div>
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Free WiFi</span>
          </div>
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Fresh Bakery Daily</span>
          </div>
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Loyalty Rewards</span>
          </div>
          <div className="why-item">
            <FaStar color="#d4a96a" size={20} />
            <span>Online Ordering</span>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home