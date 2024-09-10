import React from 'react';
import './AboutScrreen.css'; // Make sure to create a CSS file for the styling

const AboutScreen = () => {
  return (
    <div className="about-container">
      <h1>About PureCare Tech</h1>

      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          Hey! We’re two Winnipeggers on a mission to transform how our city handles cleaning.
          In today’s fast-paced world, where time is precious, we believe technology can simplify
          your to-do list and bring ease to your daily routine.
        </p>
        <p>
          At PureCare Tech, we understand the importance of convenience and reliability. That’s
          why we created <span className="highlight-purple">PureCare</span>, an all-in-one app designed to streamline your
          cleaning needs. From mobile car washes to home cleaning and dry cleaning, all your cleaning
          services are available in one place.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our goal is simple: to provide a <span className="highlight-purple">seamless cleaning experience</span> that lets you focus
          on what truly matters. You can schedule services quickly, without the hassle of quotes or
          endless searches. With just a few taps, you can book and track all your cleaning needs from
          a single app.
        </p>
      </section>

      <section className="about-section">
        <h2>What Makes Us Different?</h2>
        <p>
          <span className="highlight-purple">Price Transparency</span> is at the heart of what we do. With PureCare, there are no surprises.
          We proudly display all prices upfront, ensuring you always know what to expect. You can
          easily monitor your spending, making budgeting for cleaning services straightforward and
          hassle-free.
        </p>
      </section>

      <section className="about-section">
        <h2>Using Technology for Simplicity</h2>
        <p>
          We leverage the latest technology to make the process of booking and managing cleaning
          services easy and efficient. Whether it's comparing prices or tracking service providers
          in real time, our app eliminates the confusion and stress often associated with cleaning
          services. Say goodbye to hectic price negotiations—<span className="highlight-purple">PureCare</span> simplifies everything,
          making cleaning more accessible, affordable, and transparent.
        </p>
      </section>

      <section className="about-section">
        <h2>Join Us</h2>
        <p>
          Join us in our mission to <span className="highlight-purple">clean smarter and live better</span>. Experience the future of
          cleaning with PureCare—Winnipeg’s solution to effortless, tech-powered cleaning services.
        </p>
      </section>
    </div>
  );

};

export default AboutScreen;
