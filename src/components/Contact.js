import { useState } from 'react';
import DatePicker from './DatePicker';

export default function Contact() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const handleDateChange = (ci, co) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <p className="section-label">Get in Touch</p>
            <h2 className="section-title">Begin Your <em>Journey</em></h2>
            <p className="contact-text">
              Have questions about the studio, the area, or available dates?
              We'd love to hear from you. Our team responds within 24 hours.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Coral Bay Road, Studio 7<br />Tropical Coast, TC 90210</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>hello@coralbaystudios.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 234-5678</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="John Smith" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="john@example.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Dates</label>
                  <DatePicker onDateChange={handleDateChange} />
                  {(checkIn || checkOut) && (
                    <input type="hidden" name="checkin" value={checkIn?.toISOString().slice(0, 10) || ''} />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select id="guests">
                    <option value="" disabled>Select guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="4" placeholder="Tell us about your dream vacation..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
