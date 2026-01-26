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
              <span className="logo-icon">🏥</span>
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
              <span className="badge-text">✨ AI-Powered Recovery</span>
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
              <div className="card-icon">📊</div>
              <div className="card-title">HRV Analysis</div>
              <div className="card-value">Recovery: 85%</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">⚠️</div>
              <div className="card-title">Med Alert</div>
              <div className="card-value">Warfarin + Spinach</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">💪</div>
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
                <div className="problem-icon">❌</div>
                <h3>60% Re-Injury Rate</h3>
                <p>Post-surgical patients re-injure themselves because fitness apps can't understand medical restrictions.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">📱</div>
                <h3>Generic Programs</h3>
                <p>Apps ask "do you have injuries?" and expect perfect recall. They don't read your actual PT notes.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">💊</div>
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
                  <div className="step-icon">🏥</div>
                  <h3>Medical Intelligence</h3>
                  <p>Upload surgery reports, PT notes, medication lists. Our AI extracts every restriction and timeline.</p>
                  <div className="step-example">"ACL Week 8, no pivoting, warfarin 5mg daily"</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-icon">📊</div>
                  <h3>Biometric Monitoring</h3>
                  <p>Syncs with Apple Health/Google Fit. Tracks HRV, sleep, heart rate to detect overtraining before injury.</p>
                  <div className="step-example">"HRV down 15% → reduce intensity 30%"</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-icon">🤖</div>
                  <h3>Multi-Agent Planning</h3>
                  <p>4 specialized AI agents collaborate to generate medically-safe, recovery-optimized workouts.</p>
                  <div className="step-example">Medical → Biometric → Nutrition → Workout</div>
                </div>
              </div>

              <div className="journey-arrow">→</div>

              <div className="journey-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <div className="step-icon">✅</div>
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
                <div className="feature-icon">🔒</div>
                <h3>Privacy-First</h3>
                <p>Medical data processed on-device. Never leaves your phone. HIPAA-friendly design.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Zero Violations</h3>
                <p>AI validates every exercise against your medical constraints. 100% compliance guaranteed.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💊</div>
                <h3>Med Safety</h3>
                <p>Real-time medication-food interaction alerts. Warfarin, statins, antibiotics covered.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h3>Voice-First</h3>
                <p>Hands-free logging. "I did 3 sets of 10 push-ups" - tracked automatically.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>HRV Adaptation</h3>
                <p>Adjusts intensity based on your physiological recovery state, not just how you "feel".</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
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
              <span className="logo-icon">🏥</span>
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
            <span className="logo-icon">🏥</span>
            <span className="logo-text">HealthFlow AI</span>
          </div>
          <button className="exit-btn" onClick={() => setShowApp(false)}>
            ← Back to Home
          </button>
        </div>
        <h1>Your Recovery Dashboard</h1>
        <p>AI-powered medical recovery intelligence</p>
      </header>

      <nav className="steps">
        <button 
          className={step === 1 ? 'active' : ''} 
          onClick={() => setStep(1)}
        >
          1. HRV Check
        </button>
        <button 
          className={step === 2 ? 'active' : ''} 
          onClick={() => setStep(2)}
        >
          2. Medical Profile
        </button>
        <button 
          className={step === 3 ? 'active' : ''} 
          onClick={() => setStep(3)}
        >
          3. Workout Plan
        </button>
        <button 
          className={step === 4 ? 'active' : ''} 
          onClick={() => setStep(4)}
        >
          4. Nutrition Check
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