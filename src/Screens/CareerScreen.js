import React, { useState } from 'react';
import './CareerScreen.css'; // Ensure the CSS file is created for styling

const CareerScreen = () => {
  const [activeTab, setActiveTab] = useState('homeCleaner');

  return (
    <div className="career-container">
      <h1>Join the PureCare Team</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === 'homeCleaner' ? 'active-tab' : ''}
          onClick={() => setActiveTab('homeCleaner')}
        >
          Home Cleaner
        </button>
        <button
          className={activeTab === 'mobileCarCleaner' ? 'active-tab' : ''}
          onClick={() => setActiveTab('mobileCarCleaner')}
        >
          Mobile Car Cleaner
        </button>
        {/* Add more buttons here for future job posts */}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'homeCleaner' && (
          <section className="job-posting">
            <h2>Home Cleaner (Independent Contractor)</h2>
            <section className="job-summary">
              <h3>Job Summary</h3>
              <p>
                As an independent contractor with PureCare Tech, you'll enjoy the flexibility of setting your own schedule while earning $20 per hour. This role is perfect for individuals who value autonomy and want to be part of a growing local business.
              </p>
            </section>

            <section className="job-duties">
              <h3>Duties</h3>
              <ul>
                <li>Perform cleaning tasks to ensure the rooms in a home are clean.</li>
                <li>Dusting, sweeping, mopping, and vacuuming floors.</li>
              </ul>
            </section>

            <section className="job-requirements">
              <h3>Requirements</h3>
              <ul>
                <li>Ability to maintain a high level of cleanliness and attention to detail.</li>
                <li>Knowledge of cleaning chemicals and supplies.</li>
                <li>Physical stamina to stand, bend, and lift throughout the shift.</li>
                <li>Excellent time management skills to complete tasks efficiently.</li>
              </ul>
            </section>

            <section className="job-offer">
              <h3>What We Offer</h3>
              <ul>
                <li><strong>Flexible Scheduling:</strong> Work when it suits you by setting your own hours.</li>
                <li><strong>Independence:</strong> Operate as an independent contractor with the freedom to manage your own work.</li>
                <li><strong>Local Focus:</strong> Be part of a startup that’s rooted in Winnipeg and dedicated to serving the local community.</li>
              </ul>
            </section>

            <section className="job-details">
              <h3>Job Details</h3>
              <ul>
              <li><strong>Job Type:</strong> Casual</li>
              <li><strong>Pay:</strong> $20.00 per hour</li>
              <li><strong>Expected Hours:</strong> 10 – 40 per week</li>
</ul>
              <h3>Additional Pay</h3>
              <ul>
                <li>Tips</li>
              </ul>

              <h3>Schedule</h3>
              <ul>
                <li>Monday to Friday</li>
                <li>On call</li>
                <li>Weekends as needed</li>
              </ul>

              <h3>Work Location</h3>
              <ul>
                <li>On the road</li>
              </ul>

              <p><strong>Application Deadline:</strong> 2024-10-08</p>
            </section>
          </section>
        )}

        {activeTab === 'mobileCarCleaner' && (
          <section className="job-posting">
            <h2>Mobile Car Cleaner (Independent Contractor)</h2>
            <section className="job-summary">
              <h3>Job Summary</h3>
              <p>
                Join PureCare Tech as a Mobile Car Cleaner and enjoy the flexibility of setting your own schedule while earning $20 per hour. This role is ideal for individuals who enjoy working independently and have an eye for detail. You’ll perform both basic and premium car cleaning and detailing services. This is a great opportunity to be part of a growing local business in Winnipeg.
              </p>
            </section>

            <section className="job-duties">
              <h3>Duties</h3>
              <ul>
                <li>Perform interior and exterior cleaning of vehicles.</li>
                <li>Conduct basic car cleaning: vacuuming, wiping surfaces, and cleaning windows.</li>
                <li>Provide premium detailing services: waxing, polishing, upholstery cleaning, and tire care.</li>
                <li>Ensure high standards of cleanliness and detail with every service.</li>
              </ul>
            </section>

            <section className="job-requirements">
              <h3>Requirements</h3>
              <ul>
                <li>Ability to maintain a high level of detail for both interior and exterior cleaning.</li>
                <li>Experience with cleaning tools and products, particularly those used for car detailing.</li>
                <li>Physical stamina to stand, bend, and lift for extended periods.</li>
                <li>Must have your own vehicle for transportation.</li>
                <li>Excellent time management to complete tasks within scheduled appointments.</li>
              </ul>
            </section>

            <section className="job-offer">
              <h3>What We Offer</h3>
              <ul>
                <li><strong>Flexible Scheduling:</strong> Work at your convenience by setting your own hours.</li>
                <li><strong>Independence:</strong> Operate as an independent contractor and manage your own schedule.</li>
                <li><strong>Local Focus:</strong> Be part of a local Winnipeg startup dedicated to serving the community.</li>
              </ul>
            </section>

            <section className="job-details">
              <h3>Job Details</h3>
              <ul>
              <li><strong>Job Type:</strong> Casual, Independent Contractor</li>
              <li><strong>Pay:</strong> $20.00 per hour</li>
              <li><strong>Expected Hours:</strong> 10 – 40 per week</li>
</ul>
              <h3>Additional Pay</h3>
              <ul>
                <li>Tips</li>
              </ul>

              <h3>Schedule</h3>
              <ul>
                <li>Monday to Friday</li>
                <li>On call</li>
                <li>Weekends as needed</li>
              </ul>

              <h3>Work Location</h3>
              <li>On the road, providing mobile car cleaning services.</li>

              <p><strong>Application Deadline:</strong> 2024-10-08</p>
            </section>
          </section>
        )}

        {/* Add more job posts as additional tabs in the future */}
      </div>

      {/* How to Apply Section */}
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
