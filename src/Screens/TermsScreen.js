import React from 'react';
import './TermsScreen.css'; // Create a CSS file for the styles

const TermsScreen = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms of Service</h1>
        <p>Last updated: September 11, 2024</p>

        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>Welcome to PureCare Tech Cleaning Services. By booking our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>
        </section>

        <section className="terms-section">
          <h2>2. Services Provided</h2>
          <p>PureCare Tech offers professional cleaning services exclusively in Winnipeg, Manitoba. Our services include residential cleaning, commercial cleaning, car wash services, and specialized cleaning services. The scope of services, frequency, and specific requirements will be agreed upon between PureCare Tech and the client before the commencement of any work.</p>
        </section>

        <section className="terms-section">
          <h2>3. Booking and Payment</h2>
          <h3>Booking:</h3>
          <p>Clients can book services via our website, phone, or app. Bookings are subject to availability and confirmation.</p>
          <h3>Payment:</h3>
          <p>Payment is required at the time of booking and is only accepted via credit or debit card. Full payment is processed before the service is performed. No services will be provided until payment has been successfully processed.</p>
          <h3>Pricing:</h3>
          <p>Service rates vary based on the type and scope of the service. For residential cleaning, pricing depends on the number of hours required. For car wash services, pricing is based on factors such as car body style and interior or exterior cleaning requirements. Clients will be provided with a detailed quote before booking.</p>
        </section>

        <section className="terms-section">
          <h2>4. Cancellation and Refunds</h2>
          <h3>Cancellation:</h3>
          <p>Clients may cancel their booking at any time before our agent arrives at the premises or vehicle. Cancellations made after the agent has arrived will not be eligible for a refund.</p>
          <h3>Refund Policy:</h3>
          <p>If the service is not completed or not performed to the client's satisfaction, PureCare Tech will issue a full refund of the payment made. Refund requests must be made within 24 hours of the scheduled service time. Refunds will be processed back to the original payment method within 5-7 business days.</p>
        </section>

        <section className="terms-section">
          <h2>5. Client Responsibilities</h2>
          <h3>Access:</h3>
          <p>Clients must ensure that our cleaning team has access to the premises or vehicle at the agreed time. Failure to provide access may result in service not being performed.</p>
          <h3>Environment:</h3>
          <p>Clients are responsible for ensuring that the environment is safe for our cleaning team to work in. This includes removing any hazardous materials or ensuring pets are secured.</p>
        </section>

        <section className="terms-section">
          <h2>6. Liability</h2>
          <h3>Damage:</h3>
          <p>PureCare Tech will take reasonable care while providing services. However, we are not liable for any damage to property or vehicles unless it is proven to be caused by the gross negligence or willful misconduct of our staff.</p>
          <h3>Insurance:</h3>
          <p>We are fully insured. In the event of any accidental damage, clients must report it within 24 hours of service completion for us to consider a claim.</p>
        </section>

        <section className="terms-section">
          <h2>7. Satisfaction Guarantee</h2>
          <p>We strive for 100% client satisfaction. If you are not satisfied with our service, please contact us within 24 hours of the service. We will investigate and, if necessary, re-clean the affected areas at no additional cost.</p>
        </section>

        <section className="terms-section">
          <h2>8. Privacy and Confidentiality</h2>
          <h3>Privacy:</h3>
          <p>We respect your privacy. Any personal information collected will be used solely for providing services and will not be shared with third parties without your consent.</p>
          <h3>Confidentiality:</h3>
          <p>Our staff is trained to maintain the confidentiality of your personal and property information.</p>
        </section>

        <section className="terms-section">
          <h2>9. Termination</h2>
          <p>PureCare Tech reserves the right to terminate services at any time with immediate effect if a client breaches these terms, behaves inappropriately towards staff, or if circumstances arise that make it unsafe or impractical to continue providing services.</p>
        </section>

        <section className="terms-section">
          <h2>10. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the Province of Manitoba. Any disputes will be subject to the exclusive jurisdiction of the courts in Winnipeg, Manitoba.</p>
        </section>

        <section className="terms-section">
          <h2>11. Amendments</h2>
          <p>PureCare Tech reserves the right to update or amend these terms and conditions at any time. Clients will be notified of any changes, and continued use of our services will constitute acceptance of the updated terms.</p>
        </section>

        <section className="terms-section">
          <h2>12. Independent Contractors</h2>
          <p>We work with independent third-party contractors to provide cleaning services. While we strive to partner with reputable and professional contractors, PureCare Tech does not assume responsibility for the actions, conduct, or performance of these independent contractors. This includes, but is not limited to, any damage, theft, or loss that may occur during the provision of services. We encourage clients to take appropriate precautions and communicate any specific concerns directly with the contractor at the time of service.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsScreen;
