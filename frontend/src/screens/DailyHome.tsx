import React, { useState, useEffect } from 'react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { BottomSheet } from '../components/ui/BottomSheet'
import {
  getUserProfile,
  getHRVHistory,
  saveHRVData,
  generateSimulatedHRV,
  getCurrentStreak,
  type HRVData
} from '../utils/storage'
import { orchestrator } from '../utils/orchestrator'
import '../styles/DailyHome.css'

export const DailyHome: React.FC = () => {
  const [profile] = useState(getUserProfile())
  const [todayHRV, setTodayHRV] = useState<HRVData | null>(null)
  const [streak, setStreak] = useState(0)
  const [showMealLog, setShowMealLog] = useState(false)
  const [showFeelingCheck, setShowFeelingCheck] = useState(false)
  const [showWorkout, setShowWorkout] = useState(false)
  const [feeling, setFeeling] = useState<string>('')
  const [workoutPlan, setWorkoutPlan] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!profile) return

    // Load HRV data
    const history = getHRVHistory(7)

    // Check if we have today's HRV
    const today = new Date().toDateString()
    const existingTodayHRV = history.find(h => new Date(h.date).toDateString() === today)

    if (existingTodayHRV) {
      setTodayHRV(existingTodayHRV)
    } else {
      // Simulate today's HRV based on baseline
      const newHRV = generateSimulatedHRV(profile.baselineHRV || 65)
      saveHRVData(newHRV)
      setTodayHRV(newHRV)
    }

    // Load streak
    setStreak(getCurrentStreak())
  }, [profile])

  if (!profile || !todayHRV) {
    return <div className="daily-home-loading">Loading...</div>
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getIntensityRecommendation = () => {
    const score = todayHRV.recoveryScore
    if (score === 'optimal') return { level: 'High', description: 'Push yourself today!', color: '#10b981' }
    if (score === 'good') return { level: 'Moderate-High', description: 'Great day for training', color: '#059669' }
    if (score === 'moderate') return { level: 'Moderate', description: 'Listen to your body', color: '#f59e0b' }
    return { level: 'Light', description: 'Focus on recovery', color: '#ef4444' }
  }

  const intensity = getIntensityRecommendation()

  const handleFeelingSubmit = () => {
    // In a real app, this would save to backend/storage
    console.log('Feeling logged:', feeling)
    setShowFeelingCheck(false)
    setFeeling('')
  }

  const handleGenerateWorkout = async () => {
    if (!profile || !todayHRV) return

    setIsGenerating(true)
    try {
      const result = await orchestrator.generateDailyWorkout({
        hrv_ms: todayHRV.hrv,
        baseline_hrv: profile.baselineHRV || 65,
        resting_hr: profile.baselineRestingHR || 60,
        baseline_resting_hr: profile.baselineRestingHR || 60,
        sleep_hours: profile.baselineSleep || 7,
        baseline_sleep: profile.baselineSleep || 7,
        surgery: typeof profile.surgery === 'string' ? profile.surgery : (profile.surgery?.type || 'None'),
        restrictions: profile.restrictions || [],
        medications: profile.medications || [],
        equipment: profile.equipment || [],
        time_available: profile.timeAvailable || 30,
        goals: profile.goals
      })

      if (result.workout.success) {
        setWorkoutPlan(result.workout.response)
        setShowWorkout(true)
      } else {
        alert('Failed to generate workout. Please check if the backend is running on port 5001.')
      }
    } catch (error) {
      console.error('Workout generation error:', error)
      alert('Error generating workout. Make sure the backend server is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="daily-home-wrapper">
      {/* Phone Mockup Container */}
      <div className="phone-mockup">
        {/* Phone Notch */}
        <div className="phone-notch"></div>

        {/* Phone Content */}
        <div className="phone-content">
          {/* Header */}
          <header className="phone-header">
            <div>
              <h1 className="phone-greeting">{getGreeting()}, {profile.name || 'there'}!</h1>
              <p className="phone-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="phone-streak-badge">
              <span className="streak-icon">🔥</span>
              <span className="streak-number">{streak}</span>
            </div>
          </header>

          {/* Recovery Status */}
          <div className="phone-recovery-card">
            <div className="recovery-status-row">
              <div>
                <h3 className="recovery-label">Today's Recovery</h3>
                <StatusBadge status={todayHRV.recoveryScore} />
              </div>
              <div className="hrv-display">
                <span className="hrv-number">{todayHRV.hrv}</span>
                <span className="hrv-label">ms</span>
              </div>
            </div>
            <div className="recovery-change">
              <span className={`change-indicator ${(todayHRV.deviation || 0) >= 0 ? 'positive' : 'negative'}`}>
                {(todayHRV.deviation || 0) >= 0 ? '↑' : '↓'} {Math.abs(todayHRV.deviation || 0).toFixed(1)}%
              </span>
              <span className="change-text">from baseline</span>
            </div>
          </div>

          {/* Intensity Recommendation */}
          <div className="phone-intensity-banner" style={{
            background: `linear-gradient(135deg, ${intensity.color}20 0%, ${intensity.color}10 100%)`,
            borderLeft: `4px solid ${intensity.color}`
          }}>
            <div className="intensity-text" style={{ color: intensity.color }}>
              <strong>{intensity.level}</strong> Intensity
            </div>
            <p className="intensity-desc">{intensity.description}</p>
          </div>

          {/* Primary Action - Generate Workout */}
          <button
            className="phone-primary-btn"
            onClick={handleGenerateWorkout}
            disabled={isGenerating}
          >
            <span className="btn-icon">💪</span>
            <span className="btn-text">
              {isGenerating ? 'Generating Workout...' : "Generate Today's Workout"}
            </span>
          </button>

          {/* Quick Actions - Simplified to 2 */}
          <div className="phone-quick-actions">
            <button className="phone-action-btn" onClick={() => setShowMealLog(true)}>
              <span className="action-icon">🍎</span>
              <span className="action-text">Check Meal Safety</span>
            </button>
            <button className="phone-action-btn" onClick={() => setShowFeelingCheck(true)}>
              <span className="action-icon">💭</span>
              <span className="action-text">Log How You Feel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meal Log Bottom Sheet */}
      <BottomSheet
        isOpen={showMealLog}
        onClose={() => setShowMealLog(false)}
        title="Log a Meal"
      >
        <div className="meal-log-content">
          <p className="sheet-description">Quick meal logging coming soon!</p>
          <button className="btn-primary" onClick={() => setShowMealLog(false)}>
            Close
          </button>
        </div>
      </BottomSheet>

      {/* Feeling Check Bottom Sheet */}
      <BottomSheet
        isOpen={showFeelingCheck}
        onClose={() => setShowFeelingCheck(false)}
        title="How are you feeling?"
      >
        <div className="feeling-check-content">
          <div className="feeling-options">
            {['😊 Great', '🙂 Good', '😐 Okay', '😔 Not great', '😴 Tired'].map(f => (
              <button
                key={f}
                className={`feeling-button ${feeling === f ? 'selected' : ''}`}
                onClick={() => setFeeling(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={handleFeelingSubmit}
            disabled={!feeling}
          >
            Save
          </button>
        </div>
      </BottomSheet>

      {/* Workout Plan Bottom Sheet */}
      <BottomSheet
        isOpen={showWorkout}
        onClose={() => setShowWorkout(false)}
        title="Today's Workout Plan"
      >
        <div className="workout-plan-content">
          <div className="ai-output-container">
            <pre className="workout-plan-text">{workoutPlan}</pre>
          </div>
          <button className="btn-primary" onClick={() => setShowWorkout(false)}>
            Close
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
