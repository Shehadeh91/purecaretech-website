import React from 'react';
import './CareerScreen.css'; // Ensure the CSS file is created for styling

const CareerScreen = () => {
  return (
    <div className="career-container">
      <h1>Join the PureCare Team</h1>

      <section className="job-summary">
        <h2>Job Summary</h2>
        <p>
          As an independent contractor with PureCare Tech, you'll enjoy the flexibility of setting your own schedule while earning competitive pay. We offer $20 per hour. This role is perfect for individuals who value autonomy and want to be part of a growing local business.
        </p>
        <p>We are currently looking for home cleaners and mobile car cleaners to join our team.</p>
      </section>

      <section className="job-duties">
        <h2>Duties</h2>
        <ul>
          <li>Perform cleaning tasks to ensure homes and cars are clean.</li>
          <li>Dusting, sweeping, mopping, vacuuming floors, and washing cars.</li>
          <li>Follow specific client instructions for both home and car cleaning.</li>
        </ul>
      </section>

      <section className="job-requirements">
        <h2>Requirements</h2>
        <ul>
          <li>Ability to maintain a high level of cleanliness and attention to detail.</li>
          <li>Knowledge of cleaning chemicals, supplies, and tools for both homes and cars.</li>
          <li>Physical stamina to stand, bend, and lift throughout the shift.</li>
          <li>Excellent time management skills to complete tasks efficiently.</li>
          <li>Must have a vehicle for your own transportation to job sites.</li>
        </ul>
      </section>

      <section className="job-offer">
        <h2>What We Offer</h2>
        <ul>
          <li><strong>Flexible Scheduling:</strong> Work when it suits you by setting your own hours.</li>
          <li><strong>Independence:</strong> Operate as an independent contractor with the freedom to manage your own work.</li>
          <li><strong>Local Focus:</strong> Be part of a startup that’s rooted in Winnipeg and dedicated to serving the local community.</li>
        </ul>
      </section>

      <section className="job-details">
        <h2>Job Details</h2>
        <p><strong>Job Type:</strong> Casual</p>
        <p><strong>Pay:</strong> $20.00 per hour</p>
        <p><strong>Expected Hours:</strong> 10 – 40 per week</p>

        <h3>Additional Pay:</h3>
        <ul>
          <li>Tips</li>
        </ul>

        <h3>Benefits:</h3>
        <ul>
          <li>Flexible schedule</li>

        </ul>

        <h3>Schedule:</h3>
        <ul>
          <li>Monday to Friday</li>
          <li>On call</li>
          <li>Weekends as needed</li>
        </ul>
      </section>

      <section className="apply-section">
        <h2>How to Apply</h2>
        <p>
          To apply, please send your resume to <a href="mailto:admin@purecaretech.com">admin@purecaretech.com</a>.
        </p>
      </section>
    </div>
  );
};

export default CareerScreen;
