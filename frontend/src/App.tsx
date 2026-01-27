import { useState } from 'react'
import HRVCheck from './components/HRVCheck' 
import MedicalProfile from './components/MedicalProfile'
import WorkoutDisplay from './components/WorkoutDisplay'
import NutritionCheck from './components/NutritionCheck'
import './App.css'

interface HRVAnalysis {
  response: string
  success: boolean
}

interface MedicalConstraints {
  response: string
  success: boolean
}

function App() {
  const [showApp, setShowApp] = useState(false)
  const [step, setStep] = useState(1)
  const [hrvAnalysis, setHrvAnalysis] = useState<HRVAnalysis | null>(null)
  const [medicalConstraints, setMedicalConstraints] = useState<MedicalConstraints | null>(null)

  if (!showApp) {
    return (
      <div className="landing">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="13" y="4" width="6" height="24" rx="3" fill="url(#gradient1)"/>
                <rect x="4" y="13" width="24" height="6" rx="3" fill="url(#gradient1)"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4facfe'}} />
                    <stop offset="100%" style={{stopColor: '#00b8d4'}} />
                  </linearGradient>
                </defs>
              </svg>
              <span className="logo-text">HealthFlow AI</span>
            </div>
            <button className="nav-cta" onClick={() => setShowApp(true)}>
              Start Free Trial
            </button>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="badge-icon">
                <path d="M8 2l1.5 4.5h4.5l-3.5 2.5 1.5 4.5L8 11l-3.5 2.5 1.5-4.5-3.5-2.5h4.5z"/>
              </svg>
              <span className="badge-text">AI-Powered Recovery</span>
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
              <button className="btn-primary" onClick={() => setShowApp(true)}>
                Start Your Recovery Journey →
              </button>
              <button className="btn-secondary">
                Watch Demo (2min)
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">0%</div>
                <div className="stat-label">Re-injury Rate</div>
              </div>
              <div className="stat">
                <div className="stat-number">60M+</div>
                <div className="stat-label">Surgeries/Year</div>
              </div>
              <div className="stat">
                <div className="stat-number">4</div>
                <div className="stat-label">AI Agents</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon-wrapper icon-blue">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 28h24M7 22l5-8 4 4 8-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-title">HRV Analysis</div>
              <div className="card-value">Recovery: 85%</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon-wrapper icon-orange">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 8v8m0 4h.01M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4s12 5.373 12 12z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="card-title">Med Alert</div>
              <div className="card-value">Warfarin + Spinach</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon-wrapper icon-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 20l4 4 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-title">Adaptive Plan</div>
              <div className="card-value">Modified -30%</div>
            </div>
          </div>
        </section>

        <section className="problem">
          <div className="problem-content">
            <h2 className="section-title">The Problem</h2>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon-wrapper icon-red">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3"/>
                    <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>60% Re-Injury Rate</h3>
                <p>Post-surgical patients re-injure themselves because fitness apps can't understand medical restrictions.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon-wrapper icon-gray">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="8" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="3"/>
                    <line x1="14" y1="16" x2="34" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="14" y1="24" x2="34" y2="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="14" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Generic Programs</h3>
                <p>Apps ask "do you have injuries?" and expect perfect recall. They don't read your actual PT notes.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon-wrapper icon-red">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C19 4 14 7 14 12v12l-6 8v6h32v-6l-6-8V12c0-5-5-8-10-8zm-4 36a4 4 0 008 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36 10h6M36 16h4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Dangerous Interactions</h3>
                <p>No app checks if your spinach salad interferes with your blood thinners.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="solution">
          <div className="solution-content">
            <h2 className="section-title">How HealthFlow AI Works</h2>
            <div className="journey">
              <div className="journey-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-icon-wrapper icon-blue">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 5v10m0 10v10M10 20h20M5 20h2m28 0h2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Medical Intelligence</h3>
                  <p>Upload surgery reports, PT notes, medication lists. Our AI extracts every restriction and timeline.</p>
                  <div className="step-example">"ACL Week 8, no pivoting, warfarin 5mg daily"</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-icon-wrapper icon-purple">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M5 30l7-10 6 6 10-15 7 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="35" cy="15" r="3" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3>Biometric Monitoring</h3>
                  <p>Syncs with Apple Health/Google Fit. Tracks HRV, sleep, heart rate to detect overtraining before injury.</p>
                  <div className="step-example">"HRV down 15% → reduce intensity 30%"</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-icon-wrapper icon-blue">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="12" r="7" stroke="currentColor" strokeWidth="2.5"/>
                      <circle cx="12" cy="28" r="5" stroke="currentColor" strokeWidth="2.5"/>
                      <circle cx="28" cy="28" r="5" stroke="currentColor" strokeWidth="2.5"/>
                      <path d="M18 17l-4 7m8-7l4 7" stroke="currentColor" strokeWidth="2.5"/>
                    </svg>
                  </div>
                  <h3>Multi-Agent Planning</h3>
                  <p>4 specialized AI agents collaborate to generate medically-safe, recovery-optimized workouts.</p>
                  <div className="step-example">Medical → Biometric → Nutrition → Workout</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <div className="step-icon-wrapper icon-green">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="3"/>
                      <path d="M12 20l6 6 12-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Safe Recovery</h3>
                  <p>Zero constraint violations. Zero medication interactions. Faster recovery.</p>
                  <div className="step-example">Track, adapt, prevent re-injury</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-content">
            <h2 className="section-title">What Makes Us Different</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-blue">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="10" y="15" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M15 15V10a5 5 0 0110 0v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="20" cy="24" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Privacy-First</h3>
                <p>Medical data processed on-device. Never leaves your phone. HIPAA-friendly design.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-green">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Zero Violations</h3>
                <p>AI validates every exercise against your medical constraints. 100% compliance guaranteed.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-orange">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="12" y="8" width="16" height="24" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                    <line x1="16" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="16" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="20" cy="26" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Med Safety</h3>
                <p>Real-time medication-food interaction alerts. Warfarin, statins, antibiotics covered.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-purple">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M20 14v6l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Voice-First</h3>
                <p>Hands-free logging. "I did 3 sets of 10 push-ups" - tracked automatically.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-blue">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M5 32l5-8 6 4 8-10 10 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M28 12l6 0 0 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>HRV Adaptation</h3>
                <p>Adjusts intensity based on your physiological recovery state, not just how you "feel".</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-green">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 10v20M10 20h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="20" cy="10" r="2" fill="currentColor"/>
                    <circle cx="20" cy="30" r="2" fill="currentColor"/>
                    <circle cx="10" cy="20" r="2" fill="currentColor"/>
                    <circle cx="30" cy="20" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Transparent AI</h3>
                <p>See the reasoning behind every decision. Understand why workouts are modified.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Recover Smarter?</h2>
            <p>Join thousands preventing re-injuries with AI-powered recovery intelligence.</p>
            <button className="btn-primary-large" onClick={() => setShowApp(true)}>
              Start Your Free Trial →
            </button>
            <p className="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="13" y="4" width="6" height="24" rx="3" fill="url(#gradient2)"/>
                <rect x="4" y="13" width="24" height="6" rx="3" fill="url(#gradient2)"/>
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4facfe'}} />
                    <stop offset="100%" style={{stopColor: '#00b8d4'}} />
                  </linearGradient>
                </defs>
              </svg>
              <span className="logo-text">HealthFlow AI</span>
            </div>
            <p className="footer-tagline">Medical Recovery Intelligence System</p>
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
      <header>
        <div className="app-header">
          <div className="logo">
            <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="13" y="4" width="6" height="24" rx="3" fill="currentColor"/>
              <rect x="4" y="13" width="24" height="6" rx="3" fill="currentColor"/>
            </svg>
            <span className="logo-text">HealthFlow AI</span>
          </div>
          <button className="exit-btn" onClick={() => setShowApp(false)}>
            ← Back to Home
          </button>
        </div>
        <h1>Your Recovery Journey</h1>
        <p className="journey-intro">
          {step === 1 && "Let's start by checking your body's recovery readiness today"}
          {step === 2 && "Now, let's understand your medical situation and restrictions"}
          {step === 3 && "Time to create your personalized, safe recovery workout"}
          {step === 4 && "Finally, let's ensure your nutrition supports your recovery"}
        </p>
      </header>

      <nav className="steps">
        <button
          className={step === 1 ? 'active' : step > 1 ? 'completed' : ''}
          onClick={() => setStep(1)}
        >
          <span className="step-icon">📊</span>
          <span className="step-text">Recovery Check</span>
        </button>
        <button
          className={step === 2 ? 'active' : step > 2 ? 'completed' : ''}
          onClick={() => setStep(2)}
        >
          <span className="step-icon">🏥</span>
          <span className="step-text">Medical Profile</span>
        </button>
        <button
          className={step === 3 ? 'active' : step > 3 ? 'completed' : ''}
          onClick={() => setStep(3)}
        >
          <span className="step-icon">💪</span>
          <span className="step-text">Smart Workout</span>
        </button>
        <button
          className={step === 4 ? 'active' : ''}
          onClick={() => setStep(4)}
        >
          <span className="step-icon">🍎</span>
          <span className="step-text">Nutrition Safety</span>
        </button>
      </nav>

      <main>
        {step === 1 && <HRVCheck onAnalysis={setHrvAnalysis} onNext={() => setStep(2)} />}
        {step === 2 && <MedicalProfile onConstraints={setMedicalConstraints} onNext={() => setStep(3)} />}
        {step === 3 && <WorkoutDisplay hrvAnalysis={hrvAnalysis} medicalConstraints={medicalConstraints} />}
        {step === 4 && <NutritionCheck />}
      </main>
    </div>
  )
}

export default App