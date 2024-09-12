import React from 'react';
import './PrivacyScreen.css'; // Create a CSS file for the styles

const PrivacyScreen = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p>Last updated: September 09, 2024</p>

        <section className="privacy-section">
          <h2>1. Privacy Commitment</h2>
          <p>This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>Words with capitalized letters have meanings defined below, regardless of singular or plural forms.</p>
          <h3>Definitions</h3>
          <p>
            <strong>Account:</strong> A unique account created for You to access our Service.<br/>
            <strong>Affiliate:</strong> An entity under common control with the Company.<br/>
            <strong>Application:</strong> PureCare, the software program by the Company.<br/>
            <strong>Company:</strong> PureCare Tech, 7-316 STRADBROOK AVE.<br/>
            <strong>Country:</strong> Manitoba, Canada.<br/>
            <strong>Device:</strong> Any device that can access the Service.<br/>
            <strong>Personal Data:</strong> Information that identifies an individual.<br/>
            <strong>Service:</strong> Refers to the Application.<br/>
            <strong>Service Provider:</strong> Third parties who assist with providing the Service.<br/>
            <strong>Usage Data:</strong> Data collected automatically during use of the Service.<br/>
            <strong>You:</strong> The individual using the Service, or the company or entity on behalf of which the individual uses the Service.
          </p>
        </section>

        <section className="privacy-section">
          <h2>3. Collecting and Using Your Personal Data</h2>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>We may ask You for personally identifiable information, including:</p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, ZIP/Postal code, City</li>
          </ul>
          <h4>Usage Data</h4>
          <p>Usage Data is collected automatically when using the Service, including IP address, browser type, and other diagnostics.</p>
        </section>

        <section className="privacy-section">
          <h2>4. Use of Your Personal Data</h2>
          <p>The Company uses Your Personal Data to:</p>
          <ul>
            <li>Provide and maintain the Service</li>
            <li>Manage Your Account</li>
            <li>Process contracts and services</li>
            <li>Contact You with service-related communications</li>
            <li>Provide updates and offers</li>
            <li>Analyze usage trends and improve services</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>5. Third-Party Service Providers</h2>
          <p>We use third-party services to assist in providing our Service:</p>
          <ul>
            <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase</a>: For data collection and storage.</li>
            <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe</a>: For payment processing.</li>
            <li><a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer">Twilio</a>: For SMS and messaging.</li>
            <li><a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer">Mapbox</a>: For location and mapping services.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Retention of Your Personal Data</h2>
          <p>We will retain Your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy or to comply with legal obligations.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Security of Your Personal Data</h2>
          <p>We use commercially acceptable methods to protect Your Personal Data, but cannot guarantee absolute security over the internet.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Children's Privacy</h2>
          <p>Our Service does not address anyone under 13 years of age, and we do not knowingly collect personally identifiable information from them.</p>
        </section>

        <section className="privacy-section">
          <h2>9. Delete Your Personal Data</h2>
          <p>You can request to delete your Personal Data by deleting your account and contacting us at <a href="mailto:admin@purecaretech.com">admin@purecaretech.com</a></p>
        </section>

        <section className="privacy-section">
          <h2>10. Legal Compliance and Data Protection</h2>
          <p>Although we are not subject to GDPR or CCPA, we adhere to similar standards of data protection. The app is only available in Canada.</p>
        </section>

        <section className="privacy-section">
          <h2>11. Changes to this Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page and are effective when posted.</p>
        </section>

        <section className="privacy-section">
          <h2>12. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us:</p>
          <ul>
            <li>By email: <a href="mailto:admin@purecaretech.com">admin@purecaretech.com</a></li>
            <li>By phone: +1 (204) 803-6949</li>
          </ul>
        </section>
      </div>
    </div>
  );


};

export default PrivacyScreen;
