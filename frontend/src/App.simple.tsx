import { useState } from 'react'
import './App.css'

function App() {
  const [showApp, setShowApp] = useState(false)

  if (!showApp) {
    return (
      <div className="landing">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="13" y="4" width="6" height="24" rx="3" fill="#62d5d0"/>
                <rect x="4" y="13" width="24" height="6" rx="3" fill="#62d5d0"/>
              </svg>
              <span className="logo-text">HealthFlow AI</span>
            </div>
            <button className="nav-cta" onClick={() => setShowApp(true)}>
              Get Started
            </button>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">⚕️</span>
              <span className="badge-text">AI-Powered Medical Recovery</span>
            </div>
            <h1 className="hero-title">
              Your Medical Recovery
              <br />
              <span className="gradient-text">Intelligence System</span>
            </h1>
            <p className="hero-description">
              The first fitness app that reads your medical records, monitors your recovery biomarkers,
              and prevents medication-food interactions. Stay safe. Recover faster.
            </p>
            <div className="hero-cta">
              <button className="btn-primary-medicus" onClick={() => setShowApp(true)}>
                Start Your Recovery Journey →
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <p className="footer-disclaimer">
              Not medical advice. Always consult your physician before starting any exercise program.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Welcome to HealthFlow AI</h1>
        <p>The app is working! You clicked the button.</p>
        <button onClick={() => setShowApp(false)} className="btn-primary-medicus">
          Back to Landing
        </button>
      </div>
    </div>
  )
}

export default App
