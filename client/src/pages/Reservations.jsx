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
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: 2,
        notes: '',
    })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const today = new Date().toISOString().split('T')[0]

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200))
            setStatus('success')
            setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '' })
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
                <section className="res-hero res-hero--slim">
                    <div className="res-hero__bg" />
                    <div className="res-hero__overlay" />
                    <div className="res-hero__copy res-hero__copy--center">
                        <div className="res-hero__badge"><span className="badge-dot" />Reserve Your Spot</div>
                        <h1 className="res-hero__title">Book a <span className="res-hero__title--accent">Table</span></h1>
                        <p className="res-hero__subtitle">Reserve your table and enjoy a perfect coffee experience with your special ones.</p>
                    </div>
                </section>
                <div className="res-success-wrapper">
                    <div className="res-success-screen">
                        <div className="res-success-icon">✅</div>
                        <h2>Reservation Confirmed!</h2>
                        <p>Thank you, <strong>{form.name || 'Guest'}</strong>. We'll see you soon at Brew &amp; Co.!</p>
                        <div className="res-success-details">
                            <span>📅 {form.date}</span>
                            <span>🕐 {form.time}</span>
                            <span>👥 {form.guests} {Number(form.guests) === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                        <button className="res-submit-btn" onClick={() => setStatus(null)}>
                            Book Another Table
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="reservations-page">
            {/* ── Hero with embedded form ── */}
            <section className="res-hero">
                {/* Layered background */}
                <div className="res-hero__bg" />
                <div className="res-hero__overlay" />

                {/* Floating particles */}
                <div className="res-hero__particles">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className={`particle particle--${i + 1}`} />
                    ))}
                </div>

                <div className="res-hero__inner">
                    {/* Left: Headline + info */}
                    <div className="res-hero__copy">
                        <div className="res-hero__badge">
                            <span className="badge-dot" />
                            Reserve Your Spot
                        </div>
                        <h1 className="res-hero__title">
                            Book a<br />
                            <span className="res-hero__title--accent">Table</span>
                        </h1>
                        <p className="res-hero__subtitle">
                            Reserve your table and enjoy a perfect coffee<br />
                            experience with your special ones.
                        </p>

                        <ul className="res-hero__perks">
                            <li>
                                <span className="perk-icon">🕘</span>
                                <div>
                                    <strong>Opening Hours</strong>
                                    <span>Mon–Fri 9 AM–9 PM · Sat–Sun 10 AM–10 PM</span>
                                </div>
                            </li>
                            <li>
                                <span className="perk-icon">📍</span>
                                <div>
                                    <strong>Location</strong>
                                    <span>123 Coffee Lane, Lucknow</span>
                                </div>
                            </li>
                            <li>
                                <span className="perk-icon">📞</span>
                                <div>
                                    <strong>Call Us</strong>
                                    <span>+91 630 723 974 066</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Right: Glassmorphism form card */}
                    <form className="res-form" onSubmit={handleSubmit} noValidate>
                        <div className="res-form__header">
                            <h2>Make a Reservation</h2>
                            <p>Fill in the details below and we'll hold your table</p>
                        </div>

                        {status === 'error' && (
                            <div className="res-alert res-alert--error" role="alert">
                                ⚠️ Something went wrong. Please try again.
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">
                                    <span className="label-icon">👤</span> Full Name
                                </label>
                                <input
                                    id="name" name="name" type="text"
                                    placeholder="Enter your full name"
                                    value={form.name} onChange={handleChange}
                                    required aria-required="true"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">
                                    <span className="label-icon">📞</span> Phone Number
                                </label>
                                <input
                                    id="phone" name="phone" type="tel"
                                    placeholder="Enter your phone number"
                                    value={form.phone} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group form-group--full">
                                <label htmlFor="email">
                                    <span className="label-icon">✉️</span> Email Address
                                </label>
                                <input
                                    id="email" name="email" type="email"
                                    placeholder="Enter your email"
                                    value={form.email} onChange={handleChange}
                                    required aria-required="true"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">
                                    <span className="label-icon">📅</span> Date
                                </label>
                                <input
                                    id="date" name="date" type="date"
                                    min={today}
                                    value={form.date} onChange={handleChange}
                                    required aria-required="true"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">
                                    <span className="label-icon">🕐</span> Time
                                </label>
                                <select
                                    id="time" name="time"
                                    value={form.time} onChange={handleChange}
                                    required aria-required="true"
                                >
                                    <option value="">Select time</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="guests">
                                    <span className="label-icon">👥</span> People
                                </label>
                                <select id="guests" name="guests" value={form.guests} onChange={handleChange}>
                                    {GUESTS_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === 1 ? 'Guest' : 'Guests'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">
                                <span className="label-icon">💬</span> Special Request (Optional)
                            </label>
                            <textarea
                                id="notes" name="notes" rows={3}
                                placeholder="Let us know if it's a special occasion..."
                                value={form.notes} onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="res-submit-btn"
                            disabled={!isFormValid || loading}
                            aria-disabled={!isFormValid || loading}
                        >
                            {loading ? '⏳ Booking...' : 'Reserve Now →'}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default Reservations
