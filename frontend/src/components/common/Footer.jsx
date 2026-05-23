import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">GH</div>
          <span>Gateway Hotel</span>
        </div>
        <p className="footer-copy">
          2024 Gateway Hotel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
