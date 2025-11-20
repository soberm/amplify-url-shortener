import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="container">
      <div className="content">
        <div className="card landing-hero">
          <h1 className="title title-hero">
            🔗 URL Shortener
          </h1>
          
          <p className="landing-description">
            Transform long, unwieldy URLs into short, shareable links.<br />
            Track your links and share them with confidence.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast</h3>
              <p className="feature-description">
                Instant URL shortening
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure</h3>
              <p className="feature-description">
                Your links, your control
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Track</h3>
              <p className="feature-description">
                Manage all your links
              </p>
            </div>
          </div>

          <button
            onClick={onGetStarted}
            className="btn btn-primary cta-button"
          >
            Get Started
          </button>

          <p className="cta-subtitle">
            Sign up or sign in to start shortening URLs
          </p>
        </div>
      </div>
    </div>
  );
};
