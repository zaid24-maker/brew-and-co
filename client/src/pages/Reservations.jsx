import { useState } from 'react'
import './Reservations.css'

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM',
]

const GUESTS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

function Reservations() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        date: '',
        time: '',
        guests: 2,
        notes: '',
    })
    const [status, setStatus] = useState(null) // 'success' | 'error' | null
    const [loading, setLoading] = useState(false)

    // Get today's date in YYYY-MM-DD format for min date on input
    const today = new Date().toISOString().split('T')[0]

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        // Simulate a reservation submission (backend endpoint not yet built)
        // When you build the backend route, replace this with a real fetch call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200)) // mock delay
            setStatus('success')
            setForm({ name: '', email: '', date: '', time: '', guests: 2, notes: '' })
        } catch {
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = form.name && form.email && form.date && form.time

    // ── Success Screen ──────────────────────────────────
    if (status === 'success') {
        return (
            <main className="reservations-page">
                <section className="res-header">
                    <p className="res-tagline">📅 Reserve Your Spot</p>
                    <h1>Book a Table</h1>
                    <p className="res-subtitle">Join us for a perfect coffee experience</p>
                </section>
                <div className="res-success-screen">
                    <div className="res-success-icon">✅</div>
                    <h2>Reservation Confirmed!</h2>
                    <p>Thank you, <strong>{form.name || 'Guest'}</strong>. We'll see you soon at Brew &amp; Co.!</p>
                    <div className="res-success-details">
                        <span>📅 {form.date}</span>
                        <span>🕐 {form.time}</span>
                        <span>👥 {form.guests} {Number(form.guests) === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <button
                        className="res-submit-btn res-book-again-btn"
                        onClick={() => setStatus(null)}
                    >
                        Book Another Table
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="reservations-page">
            {/* Header */}
            <section className="res-header">
                <p className="res-tagline">📅 Reserve Your Spot</p>
                <h1>Book a Table</h1>
                <p className="res-subtitle">Join us for a perfect coffee experience</p>
            </section>

            <section className="res-body">
                {/* Info Cards */}
                <div className="res-info">
                    <div className="info-card">
                        <span className="info-icon">🕘</span>
                        <h3>Opening Hours</h3>
                        <p>Mon – Fri: 9 AM – 9 PM</p>
                        <p>Sat – Sun: 10 AM – 10 PM</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">📍</span>
                        <h3>Location</h3>
                        <p>Brew & Co. Café</p>
                        <p>Your City, India</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">📞</span>
                        <h3>Call Us</h3>
                        <p>+91 98765 43210</p>
                        <p>We're happy to help</p>
                    </div>
                </div>

                {/* Form */}
                <form className="res-form" onSubmit={handleSubmit} noValidate>
                    <h2>Make a Reservation</h2>

                    {status === 'error' && (
                        <div className="res-alert res-alert--error" role="alert">
                            ⚠️ Something went wrong. Please try again.
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">Date *</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                min={today}
                                value={form.date}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">Time *</label>
                            <select
                                id="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            >
                                <option value="">Select a time</option>
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="guests">Number of Guests</label>
                        <select
                            id="guests"
                            name="guests"
                            value={form.guests}
                            onChange={handleChange}
                        >
                            {GUESTS_OPTIONS.map((n) => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Special Requests (optional)</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            placeholder="Allergies, celebrations, accessibility needs..."
                            value={form.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="res-submit-btn"
                        disabled={!isFormValid || loading}
                        aria-disabled={!isFormValid || loading}
                    >
                        {loading ? 'Booking...' : 'Confirm Reservation'}
                    </button>
                </form>
            </section>
        </main>
    )
}

export default Reservations
