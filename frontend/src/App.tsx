import { useState, useEffect } from 'react'
import { isNewUser } from './utils/storage'
import { Onboarding } from './screens/Onboarding'
import { DailyHome } from './screens/DailyHome'
import { Progress } from './screens/Progress'
import { Settings } from './screens/Settings'
import { TabNavigation } from './components/ui/TabNavigation'
import type { TabType } from './components/ui/TabNavigation'
import NutritionCheck from './components/NutritionCheck'
import './App.css'

type AppState = 'landing' | 'onboarding' | 'app'

function App() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Always show landing page first
    setAppState('landing')
    setIsLoading(false)
  }, [])

  const handleRegisterClick = () => {
    // New user registration - go to onboarding
    setAppState('onboarding')
  }

  const handleLoginClick = () => {
    // Existing user login - check if profile exists
    if (isNewUser()) {
      alert('No account found. Please register first.')
    } else {
      setAppState('app')
    }
  }

  const handleOnboardingComplete = () => {
    console.log('App: Onboarding completed, switching to app state')
    setAppState('app')
    setActiveTab('home')
  }

  const handleResetData = () => {
    // When user resets data from settings, go back to landing
    setAppState('landing')
    setActiveTab('home')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading HealthFlow AI...</p>
      </div>
    )
  }

  // Show landing page
  if (appState === 'landing') {
    return (
      <div className="landing">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="13" y="4" width="6" height="24" rx="3" fill="#62d5d0"/>
                <rect x="4" y="13" width="24" height="6" rx="3" fill="#62d5d0"/>
              </svg>
              <span className="logo-text">HealthFlow AI</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="nav-login" onClick={handleLoginClick}>
                Login
              </button>
              <button className="nav-cta" onClick={handleRegisterClick}>
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">AI-Powered Medical Recovery</span>
            </div>
            <h1 className="hero-title">
              Preventing Re-Injuries with
              <br />
              <span className="gradient-text">Multi-Agent AI Recovery</span>
            </h1>
            <p className="hero-description">
              Adaptive fitness & nutrition that reads your medical records, monitors recovery biomarkers,
              and prevents medication-food interactions—all voice-controlled and privacy-first.
            </p>
            <div className="hero-cta">
              <button className="btn-primary-medicus" onClick={handleRegisterClick}>
                Try Live Demo →
              </button>
              <button className="btn-secondary-medicus" onClick={handleLoginClick}>
                Existing User? Login
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/hero-illustration.jpg"
              alt="HealthFlow AI Dashboard"
              className="hero-image"
            />
          </div>
        </section>

        {/* Problem Section */}
        <section className="problem-section">
          <div className="section-container">
            <div className="problem-header">
              <div className="problem-text">
                <h2 className="section-title">The Problem: 25% Re-Injury Rate</h2>
                <p className="section-subtitle">
                  Post-surgical patients and chronic disease patients re-injure themselves because traditional fitness apps can't:
                </p>
              </div>
              <div className="problem-visual">
                <div className="stat-circle">
                  <div className="stat-circle-inner">
                    <div className="stat-number-large">25%</div>
                    <div className="stat-label-large">Re-Injury Rate</div>
                  </div>
                </div>
                <p className="stat-context">of post-surgical patients re-injure within 12 months</p>
              </div>
            </div>

            <div className="problem-grid">
              <div className="problem-card">
                <img src="/AI doc.jpg" alt="Medical Records" className="problem-image" />
                <h3>Read Medical Records</h3>
                <p>Apps ask "do you have injuries?" and rely on memory, not actual PT notes, lab results, or X-rays</p>
              </div>
              <div className="problem-card">
                <img src="/fitness app.jpg" alt="Recovery Monitoring" className="problem-image" />
                <h3>Monitor Recovery</h3>
                <p>No HRV tracking, sleep analysis, or detection of overtraining before injury happens</p>
              </div>
              <div className="problem-card">
                <img src="/warning.jpg" alt="Drug Interactions" className="problem-image" />
                <h3>Check Interactions</h3>
                <p>No one warns you that warfarin + spinach or statins + grapefruit can be dangerous</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="solution-section">
          <div className="section-container">
            <h2 className="section-title">Multi-Agent AI System</h2>
            <p className="section-subtitle">
              4 specialized AI agents work together to create medically-safe, adaptive plans
            </p>

            <div className="agents-flow">
              <div className="agent-card">
                <div className="agent-number">1</div>
                <svg className="agent-image" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#62d5d0" opacity="0.2"/>
                  <path d="M50 20 L50 50 L35 50" stroke="#62d5d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M50 50 L65 50" stroke="#62d5d0" strokeWidth="4" strokeLinecap="round"/>
                  <rect x="30" y="55" width="40" height="20" rx="2" fill="#62d5d0" opacity="0.6"/>
                </svg>
                <h3>Medical Intelligence</h3>
                <p className="agent-tech">Gemini 2.0 Flash</p>
                <ul className="agent-features">
                  <li>Reads surgery reports & PT notes</li>
                  <li>Extracts restrictions: "ACL Week 8, no pivoting"</li>
                  <li>100% on-device (privacy-first)</li>
                </ul>
              </div>

              <div className="agent-arrow">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M5 20 L50 20" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M45 15 L55 20 L45 25" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>

              <div className="agent-card">
                <div className="agent-number">2</div>
                <svg className="agent-image" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#62d5d0" opacity="0.2"/>
                  <path d="M30 50 Q40 30 50 50 T70 50" stroke="#62d5d0" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <circle cx="50" cy="50" r="8" fill="#62d5d0"/>
                </svg>
                <h3>HRV Monitor</h3>
                <p className="agent-tech">Gemini 2.0 Flash-Lite</p>
                <ul className="agent-features">
                  <li>Analyzes HRV, sleep, heart rate</li>
                  <li>Detects overtraining patterns</li>
                  <li>Adjusts intensity: "HRV down 15% → reduce 30%"</li>
                </ul>
              </div>

              <div className="agent-arrow">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M5 20 L50 20" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M45 15 L55 20 L45 25" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>

              <div className="agent-card">
                <div className="agent-number">3</div>
                <svg className="agent-image" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#62d5d0" opacity="0.2"/>
                  <circle cx="50" cy="45" r="20" fill="#62d5d0" opacity="0.6"/>
                  <path d="M45 65 Q50 75 55 65" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
                <h3>Nutrition Advisor</h3>
                <p className="agent-tech">Gemini 2.0 Flash</p>
                <ul className="agent-features">
                  <li>Checks medication-food interactions</li>
                  <li>Warns: warfarin + vitamin K foods</li>
                  <li>Suggests safe alternatives</li>
                </ul>
              </div>

              <div className="agent-arrow">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M5 20 L50 20" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M45 15 L55 20 L45 25" stroke="#62d5d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>

              <div className="agent-card">
                <div className="agent-number">4</div>
                <svg className="agent-image" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#62d5d0" opacity="0.2"/>
                  <rect x="35" y="30" width="10" height="40" rx="5" fill="#62d5d0"/>
                  <rect x="55" y="30" width="10" height="40" rx="5" fill="#62d5d0"/>
                  <circle cx="40" cy="25" r="6" fill="#62d5d0"/>
                  <circle cx="60" cy="25" r="6" fill="#62d5d0"/>
                </svg>
                <h3>Workout Orchestrator</h3>
                <p className="agent-tech">Gemini 2.0 Flash-Lite</p>
                <ul className="agent-features">
                  <li>Combines all agent inputs</li>
                  <li>Generates adaptive workout plan</li>
                  <li>Zero constraint violations</li>
                </ul>
              </div>
            </div>

            <div className="observability-badge">
              <svg width="120" height="30" viewBox="0 0 120 30" fill="none" className="opik-logo">
                <rect width="120" height="30" rx="6" fill="#f59e0b" opacity="0.2"/>
                <text x="60" y="20" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#f59e0b" textAnchor="middle">OPIK</text>
              </svg>
              <span>Monitored by <strong>Opik</strong> - Every decision tracked & evaluated</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="section-container">
            <h2 className="section-title">How It Works</h2>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect x="30" y="20" width="60" height="80" rx="4" fill="#62d5d0" opacity="0.2" stroke="#62d5d0" strokeWidth="3"/>
                  <line x1="40" y1="35" x2="80" y2="35" stroke="#62d5d0" strokeWidth="2"/>
                  <line x1="40" y1="50" x2="80" y2="50" stroke="#62d5d0" strokeWidth="2"/>
                  <line x1="40" y1="65" x2="65" y2="65" stroke="#62d5d0" strokeWidth="2"/>
                </svg>
                <h3>Upload Medical Info</h3>
                <p>Share surgery reports, PT notes, medications (processed 100% on-device for privacy)</p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="35" stroke="#62d5d0" strokeWidth="8" fill="none"/>
                  <circle cx="60" cy="60" r="25" fill="#62d5d0" opacity="0.3"/>
                  <rect x="55" y="25" width="10" height="15" rx="3" fill="#62d5d0"/>
                </svg>
                <h3>Connect Wearables</h3>
                <p>Sync Apple Health/Google Fit for HRV, sleep, heart rate monitoring</p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="40" cy="40" r="12" fill="#62d5d0"/>
                  <circle cx="80" cy="40" r="12" fill="#62d5d0"/>
                  <circle cx="40" cy="80" r="12" fill="#62d5d0"/>
                  <circle cx="80" cy="80" r="12" fill="#62d5d0"/>
                  <line x1="40" y1="40" x2="80" y2="40" stroke="#62d5d0" strokeWidth="3"/>
                  <line x1="40" y1="40" x2="40" y2="80" stroke="#62d5d0" strokeWidth="3"/>
                  <line x1="80" y1="40" x2="80" y2="80" stroke="#62d5d0" strokeWidth="3"/>
                  <line x1="40" y1="80" x2="80" y2="80" stroke="#62d5d0" strokeWidth="3"/>
                </svg>
                <h3>AI Analyzes</h3>
                <p>4 agents collaborate: Medical → HRV → Nutrition → Workout generation</p>
              </div>

              <div className="step-card">
                <div className="step-number">4</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="40" stroke="#62d5d0" strokeWidth="4" fill="none"/>
                  <circle cx="60" cy="60" r="30" fill="#62d5d0" opacity="0.3"/>
                  <circle cx="60" cy="60" r="10" fill="#62d5d0"/>
                </svg>
                <h3>Get Adaptive Plan</h3>
                <p>Daily workouts that adjust to your recovery status—100% medically safe</p>
              </div>

              <div className="step-card">
                <div className="step-number">5</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <ellipse cx="60" cy="70" rx="20" ry="30" fill="#62d5d0" opacity="0.3"/>
                  <rect x="50" y="35" width="20" height="35" rx="10" fill="#62d5d0"/>
                  <circle cx="60" cy="30" r="8" fill="#62d5d0"/>
                </svg>
                <h3>Voice Control</h3>
                <p>"Finished 3 sets of 10 push-ups" → auto-logged, completely hands-free</p>
              </div>

              <div className="step-card">
                <div className="step-number">6</div>
                <svg className="step-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <polyline points="20,90 35,70 50,75 65,50 80,60 95,30" stroke="#62d5d0" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="20" y1="95" x2="95" y2="95" stroke="#62d5d0" strokeWidth="3"/>
                  <line x1="20" y1="25" x2="20" y2="95" stroke="#62d5d0" strokeWidth="3"/>
                </svg>
                <h3>Track Progress</h3>
                <p>Monitor HRV trends, workout history, streak tracking—all in one dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-container">
            <h2 className="section-title">Why Choose HealthFlow AI</h2>

            <div className="criteria-grid">
              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <circle cx="45" cy="45" r="40" fill="#10b981" opacity="0.2"/>
                  <polyline points="25,45 38,58 65,30" stroke="#10b981" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Fully Functional</h3>
                <p>Complete multi-agent system with 4 specialized LLMs, HRV tracking, workout generation, and nutrition checking</p>
              </div>

              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <circle cx="45" cy="45" r="35" stroke="#10b981" strokeWidth="3" fill="none"/>
                  <circle cx="45" cy="45" r="25" fill="#10b981" opacity="0.3"/>
                  <path d="M30 30 Q45 50 60 30" stroke="#10b981" strokeWidth="2" fill="none"/>
                  <path d="M30 60 Q45 40 60 60" stroke="#10b981" strokeWidth="2" fill="none"/>
                </svg>
                <h3>Real-World Impact</h3>
                <p>Solves the 25% re-injury rate problem for 60M+ post-surgical patients yearly. Sustainable fitness routines that adapt to actual recovery</p>
              </div>

              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="20" y="30" width="50" height="40" rx="5" fill="#10b981" opacity="0.3"/>
                  <circle cx="35" cy="20" r="8" fill="#10b981"/>
                  <circle cx="55" cy="20" r="8" fill="#10b981"/>
                  <line x1="35" y1="28" x2="35" y2="35" stroke="#10b981" strokeWidth="3"/>
                  <line x1="55" y1="28" x2="55" y2="35" stroke="#10b981" strokeWidth="3"/>
                </svg>
                <h3>Advanced AI</h3>
                <p>4 autonomous agents (Gemini 2.0 Flash + Flash-Lite) with reasoning chains, tool use, and inter-agent communication</p>
              </div>

              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <circle cx="45" cy="45" r="30" fill="#10b981" opacity="0.2"/>
                  <circle cx="45" cy="45" r="15" fill="none" stroke="#10b981" strokeWidth="3"/>
                  <circle cx="45" cy="45" r="5" fill="#10b981"/>
                  <line x1="45" y1="15" x2="45" y2="30" stroke="#10b981" strokeWidth="3"/>
                  <line x1="45" y1="60" x2="45" y2="75" stroke="#10b981" strokeWidth="3"/>
                  <line x1="15" y1="45" x2="30" y2="45" stroke="#10b981" strokeWidth="3"/>
                  <line x1="60" y1="45" x2="75" y2="45" stroke="#10b981" strokeWidth="3"/>
                </svg>
                <h3>Full Observability</h3>
                <p>Opik integration tracks every agent decision, measures outcomes, and enables human-in-the-loop validation</p>
              </div>

              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <circle cx="45" cy="40" r="20" fill="#10b981" opacity="0.3"/>
                  <path d="M45 60 L35 75 L40 75 L40 85 L50 85 L50 75 L55 75 Z" fill="#10b981"/>
                  <circle cx="45" cy="40" r="12" fill="#10b981"/>
                </svg>
                <h3>Personalized Plans</h3>
                <p>Directly supports physical health, mental wellness, and recovery goals through adaptive, personalized plans</p>
              </div>

              <div className="criteria-card">
                <svg className="feature-image" width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <path d="M45 15 L60 25 L60 50 Q60 65 45 70 Q30 65 30 50 L30 25 Z" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="3"/>
                  <polyline points="35,45 42,52 55,38" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Safety First</h3>
                <p>Medical disclaimers, privacy-first design, appropriate caveats, and promotes healthy behaviors responsibly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase */}
        <section className="showcase-section">
          <div className="section-container">
            <h2 className="section-title">See It In Action</h2>
            <div className="showcase-grid">
              <div className="showcase-item">
                <svg className="showcase-screenshot" viewBox="0 0 800 600" fill="none">
                  <rect width="800" height="600" fill="#f0f9ff"/>
                  <rect x="50" y="50" width="700" height="80" rx="8" fill="#62d5d0" opacity="0.3"/>
                  <rect x="50" y="150" width="340" height="200" rx="8" fill="white" stroke="#62d5d0" strokeWidth="2"/>
                  <polyline points="80,320 150,280 220,300 290,240 360,260" stroke="#62d5d0" strokeWidth="3" fill="none"/>
                  <rect x="410" y="150" width="340" height="200" rx="8" fill="white" stroke="#62d5d0" strokeWidth="2"/>
                  <circle cx="580" cy="250" r="60" stroke="#62d5d0" strokeWidth="8" fill="none"/>
                  <text x="580" y="265" fontSize="40" fill="#62d5d0" textAnchor="middle" fontWeight="bold">65</text>
                </svg>
                <h3>Intelligent Dashboard</h3>
                <p>Real-time HRV monitoring and recovery status</p>
              </div>
              <div className="showcase-item">
                <svg className="showcase-screenshot" viewBox="0 0 800 600" fill="none">
                  <rect width="800" height="600" fill="#f0f9ff"/>
                  <rect x="50" y="50" width="700" height="80" rx="8" fill="#62d5d0" opacity="0.3"/>
                  <rect x="50" y="150" width="700" height="100" rx="8" fill="white" stroke="#62d5d0" strokeWidth="2"/>
                  <rect x="50" y="270" width="700" height="100" rx="8" fill="white" stroke="#62d5d0" strokeWidth="2"/>
                  <rect x="50" y="390" width="700" height="100" rx="8" fill="white" stroke="#62d5d0" strokeWidth="2"/>
                  <circle cx="100" cy="200" r="20" fill="#62d5d0"/>
                  <circle cx="100" cy="320" r="20" fill="#62d5d0"/>
                  <circle cx="100" cy="440" r="20" fill="#62d5d0"/>
                </svg>
                <h3>Adaptive Workouts</h3>
                <p>AI-generated plans that respect your limits</p>
              </div>
              <div className="showcase-item">
                <svg className="showcase-screenshot" viewBox="0 0 800 600" fill="none">
                  <rect width="800" height="600" fill="#f0f9ff"/>
                  <rect x="50" y="50" width="700" height="80" rx="8" fill="#62d5d0" opacity="0.3"/>
                  <rect x="50" y="150" width="700" height="150" rx="8" fill="#fff5f5" stroke="#ef4444" strokeWidth="3"/>
                  <path d="M100 200 L100 250" stroke="#ef4444" strokeWidth="4"/>
                  <circle cx="100" cy="175" r="15" stroke="#ef4444" strokeWidth="4" fill="none"/>
                  <rect x="50" y="320" width="700" height="150" rx="8" fill="white" stroke="#10b981" strokeWidth="3"/>
                  <polyline points="90,380 105,395 120,370" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Nutrition Safety</h3>
                <p>Medication-food interaction warnings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Notice */}
        <section className="safety-section">
          <div className="section-container">
            <div className="safety-box">
              <svg className="safety-image" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <path d="M60 10 L80 25 L80 60 Q80 85 60 95 Q40 85 40 60 L40 25 Z" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="4"/>
                <path d="M60 40 L60 65" stroke="#ef4444" strokeWidth="6" strokeLinecap="round"/>
                <path d="M45 52.5 L75 52.5" stroke="#ef4444" strokeWidth="6" strokeLinecap="round"/>
              </svg>
              <div className="safety-content">
                <h3>Medical Disclaimer & Safety</h3>
                <p>
                  <strong>Not medical advice.</strong> This app is a fitness and wellness tool designed to support your recovery journey,
                  not replace professional medical care. Always consult your physician, physical therapist, or healthcare provider before
                  starting any exercise program, especially after surgery or while managing chronic conditions.
                </p>
                <p className="safety-privacy">
                  <strong>Privacy-First:</strong> All medical data processing happens on-device. Your medical records never leave your phone.
                  We use local storage only—no cloud uploads, no data sharing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section">
          <div className="section-container">
            <h2 className="cta-title">Ready to Try It?</h2>
            <p className="cta-description">
              Experience the power of multi-agent AI for safe, adaptive recovery
            </p>
            <div className="cta-buttons">
              <button className="btn-primary-medicus btn-large" onClick={handleRegisterClick}>
                Start Demo Now →
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

  // Show onboarding for new users
  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // Main app for existing users
  return (
    <div className="app-container">
      <div className="app-content">
        {activeTab === 'home' && <DailyHome />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'nutrition' && (
          <div className="nutrition-wrapper">
            <header className="screen-header">
              <h1>Nutrition Safety</h1>
              <p className="header-subtitle">Check medication-food interactions</p>
            </header>
            <NutritionCheck />
          </div>
        )}
        {activeTab === 'settings' && <Settings onResetComplete={handleResetData} />}
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
