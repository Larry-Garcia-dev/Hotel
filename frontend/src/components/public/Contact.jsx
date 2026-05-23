import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <p className="eyebrow">Contacto</p>
            <h2>Listo para planear tu estancia?</h2>
            <p>Llama al hotel o reserva en linea para ver disponibilidad y opciones.</p>
          </div>
          
          <div className="contact-card">
            <h3>Gateway Hotel</h3>
            <p>2700 New York Avenue NE<br />Washington, DC 20002</p>
            <p>+1 202-832-5800<br />1-800-324-9832</p>
            <a href="#availability" className="btn btn-gold">Reservar Ahora</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
