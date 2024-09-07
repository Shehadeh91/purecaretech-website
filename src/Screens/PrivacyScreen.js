import React from 'react';
import './PrivacyScreen.css'; // Create a CSS file for the styles

const PrivacyScreen = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Control</h1>

        <section className="privacy-section">
          <h2>1. Privacy Commitment</h2>
          <p>At PureCare Tech, we prioritize your privacy and are committed to protecting your personal information. This Privacy Control section outlines how we collect, use, and safeguard your data.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Information Collection</h2>
          <p>We collect personal information you provide directly, such as your name, contact details, and service preferences when you book our services or interact with our app. We may also collect usage data and device information to improve our services and app performance.</p>
        </section>

        <section className="privacy-section">
          <h2>3. Use of Information</h2>
          <p>Your personal information is used to:</p>
          <ul>
            <li>Provide and manage the services you request.</li>
            <li>Process payments and handle customer support.</li>
            <li>Send notifications and updates related to our services.</li>
            <li>Improve and personalize your experience with our app.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Data Security</h2>
          <p>We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Third-Party Services</h2>
          <p>We use third-party services to facilitate and enhance our app's functionality:</p>
          <ul>
            <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase</a>: We use Firebase for authentication, data storage, and analytics. Firebase's privacy practices can be reviewed at their privacy policy.</li>
            <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe</a>: We use Stripe to process payments. Stripe's privacy practices can be reviewed at their privacy policy.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Data Sharing</h2>
          <p>We do not share your personal information with third parties except:</p>
          <ul>
            <li>With service providers who assist us in operating our app and providing services (e.g., Firebase, Stripe).</li>
            <li>When required by law or to protect our rights and safety.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information.</li>
            <li>Request deletion of your data, subject to applicable legal requirements.</li>
            <li>Opt out of receiving marketing communications.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze app usage, and deliver personalized content. You can manage your cookie preferences through your device settings.</p>
        </section>

        <section className="privacy-section">
          <h2>9. Changes to Privacy Control</h2>
          <p>We may update this Privacy Control section periodically. Any changes will be posted on this page, and continued use of our app constitutes acceptance of the revised terms.</p>
        </section>

        <section className="privacy-section">
          <h2>10. Contact Us</h2>
          <p>For any questions or concerns regarding our Privacy Control practices, please contact us at <a href="mailto:admin@purecaretech.com">admin@purecaretech.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyScreen;
