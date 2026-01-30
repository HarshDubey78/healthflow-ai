import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { HRVTrendGraph } from '../components/ui/HRVTrendGraph'
import { BottomSheet } from '../components/ui/BottomSheet'
import {
  getUserProfile,
  getHRVHistory,
  saveHRVData,
  generateSimulatedHRV,
  getWorkoutHistory,
  getCurrentStreak,
  HRVData,
  WorkoutHistory
} from '../utils/storage'
import { orchestrator } from '../utils/orchestrator'
import '../styles/DailyHome.css'

export const DailyHome: React.FC = () => {
  const [profile] = useState(getUserProfile())
  const [todayHRV, setTodayHRV] = useState<HRVData | null>(null)
  const [hrvHistory, setHRVHistory] = useState<HRVData[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
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
    setHRVHistory(history)

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
      setHRVHistory([newHRV, ...history].slice(0, 7))
    }

    // Load workout history
    const workouts = getWorkoutHistory(3)
    setWorkoutHistory(workouts)

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
        surgery: profile.surgery || 'None',
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
    <div className="daily-home">
      {/* Header */}
      <header className="daily-header">
        <div>
          <h1 className="greeting">{getGreeting()}, {profile.name || 'there'}!</h1>
          <p className="header-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="streak-badge">
          <span className="streak-icon">🔥</span>
          <span className="streak-number">{streak}</span>
        </div>
      </header>

      {/* Recovery Card */}
      <Card className="recovery-card">
        <div className="recovery-header">
          <div>
            <h2 className="card-title">Today's Recovery</h2>
            <StatusBadge status={todayHRV.recoveryScore} />
          </div>
          <div className="hrv-value">
            <span className="hrv-number">{todayHRV.hrv}</span>
            <span className="hrv-label">ms</span>
          </div>
        </div>

        <div className="hrv-change">
          <span className={`change-value ${todayHRV.deviation >= 0 ? 'positive' : 'negative'}`}>
            {todayHRV.deviation >= 0 ? '↑' : '↓'} {Math.abs(todayHRV.deviation).toFixed(1)}%
          </span>
          <span className="change-label">from baseline</span>
        </div>

        {hrvHistory.length > 1 && (
          <div className="hrv-trend-section">
            <h4 className="trend-title">7-Day Trend</h4>
            <HRVTrendGraph data={hrvHistory.slice().reverse()} height={100} />
          </div>
        )}
      </Card>

      {/* Today's Workout Card */}
      <Card className="workout-card" hover>
        <div className="workout-header">
          <div className="workout-icon">💪</div>
          <div>
            <h3 className="card-title">Today's Workout</h3>
            <p className="workout-subtitle">Based on your recovery status</p>
          </div>
        </div>

        <div className="intensity-banner" style={{ background: `linear-gradient(135deg, ${intensity.color}15 0%, ${intensity.color}05 100%)` }}>
          <div className="intensity-label" style={{ color: intensity.color }}>
            Recommended Intensity: <strong>{intensity.level}</strong>
          </div>
          <p className="intensity-description">{intensity.description}</p>
        </div>

        <div className="workout-details">
          <div className="workout-detail-item">
            <span className="detail-icon">⏱️</span>
            <div>
              <span className="detail-label">Duration</span>
              <span className="detail-value">30-45 min</span>
            </div>
          </div>
          <div className="workout-detail-item">
            <span className="detail-icon">🎯</span>
            <div>
              <span className="detail-label">Focus</span>
              <span className="detail-value">{profile.goals?.[0] || 'Full body'}</span>
            </div>
          </div>
        </div>

        <button
          className="btn-primary workout-start-btn"
          onClick={handleGenerateWorkout}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : "Generate Today's Workout"}
        </button>
      </Card>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">Quick Actions</h3>
        <div className="action-grid">
          <button className="action-card" onClick={() => setShowMealLog(true)}>
            <span className="action-icon">🍎</span>
            <span className="action-label">Log Meal</span>
          </button>
          <button className="action-card" onClick={() => setShowFeelingCheck(true)}>
            <span className="action-icon">💭</span>
            <span className="action-label">How do you feel?</span>
          </button>
          <button className="action-card">
            <span className="action-icon">💊</span>
            <span className="action-label">Log Medication</span>
          </button>
          <button className="action-card">
            <span className="action-icon">😴</span>
            <span className="action-label">Sleep Quality</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {workoutHistory.length > 0 && (
        <div className="recent-activity">
          <h3 className="section-title">Recent Activity</h3>
          {workoutHistory.map((workout, index) => (
            <Card key={index} className="activity-item">
              <div className="activity-header">
                <span className="activity-icon">💪</span>
                <div className="activity-info">
                  <h4 className="activity-title">{workout.type}</h4>
                  <p className="activity-date">
                    {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className="activity-duration">{workout.duration} min</span>
              </div>
              {workout.exercises.length > 0 && (
                <div className="activity-exercises">
                  {workout.exercises.slice(0, 2).map((ex, i) => (
                    <span key={i} className="exercise-tag">{ex}</span>
                  ))}
                  {workout.exercises.length > 2 && (
                    <span className="exercise-tag">+{workout.exercises.length - 2} more</span>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

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
