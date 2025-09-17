import React from 'react';

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Todify | Developed by <strong>Naman</strong></p>
        {/* <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div> */}
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .footer {
            background-color: #212529; 
            color: #f8f9fa;
            padding: 20px 0;
            text-align: center;
            font-size: 0.9rem;
          }

          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .footer-links a {
            color: #00adb5;
            margin: 0 10px;
            text-decoration: none;
            transition: color 0.3s ease-in-out, transform 0.2s;
          }

          .footer-links a:hover {
            color: #00fff5;
            transform: scale(1.1);
          }

          @media (max-width: 768px) {
            .footer-content {
              flex-direction: column;
              gap: 5px;
            }

            .footer-links {
              margin-top: 10px;
            }

            .footer-links a {
              display: block;
              margin-bottom: 5px;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default FooterComponent;
