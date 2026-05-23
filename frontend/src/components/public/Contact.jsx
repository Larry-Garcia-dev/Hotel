import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2>Ready to plan your stay?</h2>
          <p>Call the hotel or book online for availability and room options.</p>
        </div>
        <div className="contact-card">
          <h3>Gateway Hotel</h3>
          <p>2700 New York Avenue NE</p>
          <p>+1 202 832 5800 &middot; 1-800-324-9832</p>
          <a className="gold-button" href="tel:+12028325800">Book Now</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
