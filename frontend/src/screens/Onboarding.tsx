import { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { UserProfile, saveUserProfile, generateSimulatedHRV, saveHRVData } from '../utils/storage'
import '../styles/Onboarding.css'

interface OnboardingProps {
  onComplete: () => void
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    restrictions: [],
    medications: [],
    equipment: [],
    timeAvailable: 30
  })

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      console.log('Completing onboarding with profile:', profile)

      const fullProfile: UserProfile = {
        id: profile.id!,
        createdAt: profile.createdAt!,
        name: profile.name,
        age: profile.age,
        surgery: profile.surgery,
        restrictions: profile.restrictions || [],
        medications: profile.medications || [],
        equipment: profile.equipment || [],
        timeAvailable: profile.timeAvailable || 30,
        goals: profile.goals || [],
        baselineHRV: 65,
        baselineHR: 62,
        baselineRestingHR: 62,
        baselineSleep: 7.5
      }

      console.log('Saving profile:', fullProfile)
      saveUserProfile(fullProfile)

      // Generate initial HRV data
      const initialHRV = generateSimulatedHRV(65)
      saveHRVData(initialHRV)

      console.log('Onboarding complete, calling onComplete callback')
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const addRestriction = (restriction: string) => {
    if (!profile.restrictions?.includes(restriction)) {
      setProfile({
        ...profile,
        restrictions: [...(profile.restrictions || []), restriction]
      })
    }
  }

  const removeRestriction = (restriction: string) => {
    setProfile({
      ...profile,
      restrictions: profile.restrictions?.filter(r => r !== restriction)
    })
  }

  const addEquipment = (equipment: string) => {
    if (!profile.equipment?.includes(equipment)) {
      setProfile({
        ...profile,
        equipment: [...(profile.equipment || []), equipment]
      })
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <span className="progress-text">
          Step {step} of 5
        </span>
      </div>

      <div className="onboarding-content">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="onboarding-card fade-in">
            <div className="onboarding-hero">
              <div className="hero-icon">👋</div>
              <h1>Welcome to HealthFlow AI</h1>
              <p className="hero-subtitle">
                Your personalized medical recovery intelligence system
              </p>
            </div>

            <CardContent>
              <div className="benefit-list">
                <div className="benefit-item">
                  <span className="benefit-icon">🏥</span>
                  <div>
                    <h3>Medical-Safe Workouts</h3>
                    <p>AI respects your restrictions and recovery timeline</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📊</span>
                  <div>
                    <h3>Daily HRV Monitoring</h3>
                    <p>Prevent overtraining with biometric tracking</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">💊</span>
                  <div>
                    <h3>Medication Safety</h3>
                    <p>Check food-drug interactions instantly</p>
                  </div>
                </div>
              </div>

              <p className="onboarding-note">
                <strong>This takes 2 minutes</strong> and you'll only do it once.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Medical Profile */}
        {step === 2 && (
          <Card className="onboarding-card fade-in">
            <CardHeader title="Your Medical Profile" subtitle="Tell us about your recovery journey" />
            <CardContent>
              <div className="form-group">
                <label>Surgery or Injury Type</label>
                <input
                  type="text"
                  placeholder="e.g., ACL Reconstruction, Shoulder Surgery"
                  value={profile.surgery?.type || ''}
                  onChange={e =>
                    setProfile({ ...profile, surgery: { ...profile.surgery!, type: e.target.value, date: profile.surgery?.date || '', weeksPostOp: 0 } })
                  }
                />
              </div>

              <div className="form-group">
                <label>Surgery Date</label>
                <input
                  type="date"
                  value={profile.surgery?.date || ''}
                  onChange={e => {
                    const date = new Date(e.target.value)
                    const weeks = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))
                    setProfile({
                      ...profile,
                      surgery: { ...profile.surgery!, type: profile.surgery?.type || '', date: e.target.value, weeksPostOp: weeks }
                    })
                  }}
                />
                {profile.surgery?.weeksPostOp !== undefined && profile.surgery.weeksPostOp > 0 && (
                  <p className="form-hint">
                    That's {profile.surgery.weeksPostOp} weeks post-op
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Current Restrictions</label>
                <div className="tag-selector">
                  {['no pivoting', 'no jumping', 'no impact', 'no rotation', 'limited range of motion'].map(
                    restriction => (
                      <button
                        key={restriction}
                        className={`tag-button ${
                          profile.restrictions?.includes(restriction) ? 'tag-selected' : ''
                        }`}
                        onClick={() =>
                          profile.restrictions?.includes(restriction)
                            ? removeRestriction(restriction)
                            : addRestriction(restriction)
                        }
                      >
                        {restriction}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Current Medications (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., warfarin, ibuprofen"
                  value={profile.medications?.join(', ') || ''}
                  onChange={e =>
                    setProfile({ ...profile, medications: e.target.value.split(',').map(m => m.trim()).filter(Boolean) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Goals & Equipment */}
        {step === 3 && (
          <Card className="onboarding-card fade-in">
            <CardHeader title="Goals & Equipment" subtitle="What do you want to achieve?" />
            <CardContent>
              <div className="form-group">
                <label>Recovery Goals (select multiple)</label>
                <div className="tag-selector">
                  {[
                    'Return to Sports',
                    'Daily Activities',
                    'Strength Building',
                    'Pain Reduction',
                    'Mobility Improvement'
                  ].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      className={`tag-button ${
                        profile.goals?.includes(goal) ? 'tag-selected' : ''
                      }`}
                      onClick={() => {
                        if (profile.goals?.includes(goal)) {
                          setProfile({ ...profile, goals: profile.goals.filter(g => g !== goal) })
                        } else {
                          setProfile({ ...profile, goals: [...(profile.goals || []), goal] })
                        }
                      }}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Available Equipment</label>
                <div className="tag-selector">
                  {[
                    'dumbbells',
                    'resistance bands',
                    'kettlebells',
                    'pull-up bar',
                    'yoga mat',
                    'foam roller',
                    'bodyweight only'
                  ].map(equip => (
                    <button
                      key={equip}
                      type="button"
                      className={`tag-button ${
                        profile.equipment?.includes(equip) ? 'tag-selected' : ''
                      }`}
                      onClick={() =>
                        profile.equipment?.includes(equip)
                          ? setProfile({ ...profile, equipment: profile.equipment.filter(e => e !== equip) })
                          : addEquipment(equip)
                      }
                    >
                      {equip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Time Available Per Day</label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={profile.timeAvailable || 30}
                  onChange={e => setProfile({ ...profile, timeAvailable: parseInt(e.target.value) })}
                />
                <p className="range-value">{profile.timeAvailable} minutes</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Baseline Biometrics */}
        {step === 4 && (
          <Card className="onboarding-card fade-in">
            <CardHeader
              title="Baseline Biometrics"
              subtitle="We'll monitor these daily to optimize your recovery"
            />
            <CardContent>
              <div className="biometric-card">
                <div className="biometric-icon">💓</div>
                <div>
                  <h3>Heart Rate Variability (HRV)</h3>
                  <p className="biometric-value">65 ms</p>
                  <p className="biometric-description">
                    We'll establish your baseline over the next few days
                  </p>
                </div>
              </div>

              <div className="biometric-card">
                <div className="biometric-icon">🏃</div>
                <div>
                  <h3>Resting Heart Rate</h3>
                  <p className="biometric-value">62 bpm</p>
                  <p className="biometric-description">Typical range: 58-70 bpm</p>
                </div>
              </div>

              <div className="biometric-card">
                <div className="biometric-icon">😴</div>
                <div>
                  <h3>Sleep Quality</h3>
                  <p className="biometric-value">7.5 hours</p>
                  <p className="biometric-description">Essential for recovery</p>
                </div>
              </div>

              <div className="info-box">
                <p>
                  <strong>Connect Apple Health / Google Fit</strong>
                  <br />
                  For now, we'll simulate data. Wearable integration coming soon!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Ready to Start */}
        {step === 5 && (
          <Card className="onboarding-card fade-in">
            <div className="onboarding-hero">
              <div className="hero-icon">🎉</div>
              <h1>You're All Set!</h1>
              <p className="hero-subtitle">
                Your personalized recovery program is ready
              </p>
            </div>

            <CardContent>
              <div className="summary-section">
                <h3>Your Profile Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Surgery:</span>
                    <span className="summary-value">{profile.surgery?.type || 'Not specified'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Weeks Post-Op:</span>
                    <span className="summary-value">{profile.surgery?.weeksPostOp || 0}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Restrictions:</span>
                    <span className="summary-value">{profile.restrictions?.length || 0} active</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Equipment:</span>
                    <span className="summary-value">{profile.equipment?.length || 0} items</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Daily Time:</span>
                    <span className="summary-value">{profile.timeAvailable} min</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Goals:</span>
                    <span className="summary-value">
                      {profile.goals && profile.goals.length > 0 ? profile.goals.join(', ') : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="next-steps-box">
                <h4>What's Next?</h4>
                <ul>
                  <li>Check your daily HRV score every morning</li>
                  <li>Get AI-generated workouts based on your recovery</li>
                  <li>Track your progress and maintain your streak</li>
                  <li>Log meals and check medication interactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="onboarding-actions">
        {step > 1 && (
          <button type="button" className="btn-secondary" onClick={handleBack}>
            Back
          </button>
        )}
        <button type="button" className="btn-primary" onClick={handleNext}>
          {step === 5 ? "Start My Recovery Journey →" : "Continue"}
        </button>
      </div>
    </div>
  )
}
