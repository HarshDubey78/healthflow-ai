import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { HRVTrendGraph } from '../components/ui/HRVTrendGraph'
import {
  getUserProfile,
  getHRVHistory,
  getWorkoutHistory,
  getCurrentStreak,
  type HRVData,
  type WorkoutHistory
} from '../utils/storage'
import '../styles/Progress.css'

export const Progress: React.FC = () => {
  const [profile] = useState(getUserProfile())
  const [hrvHistory, setHRVHistory] = useState<HRVData[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
  const [streak, setStreak] = useState(0)
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d')

  useEffect(() => {
    const days = timeframe === '7d' ? 7 : 30
    setHRVHistory(getHRVHistory(days))
    setWorkoutHistory(getWorkoutHistory(days))
    setStreak(getCurrentStreak())
  }, [timeframe])

  if (!profile) {
    return <div className="progress-loading">Loading...</div>
  }

  const calculateAverageHRV = () => {
    if (hrvHistory.length === 0) return 0
    const sum = hrvHistory.reduce((acc, h) => acc + h.hrv, 0)
    return Math.round(sum / hrvHistory.length)
  }

  const calculateRecoveryDistribution = () => {
    const distribution = {
      optimal: 0,
      good: 0,
      moderate: 0,
      poor: 0
    }

    hrvHistory.forEach(h => {
      distribution[h.recoveryScore]++
    })

    return distribution
  }

  const getWorkoutsByType = () => {
    const types: { [key: string]: number } = {}
    workoutHistory.forEach(w => {
      types[w.type] = (types[w.type] || 0) + 1
    })
    return types
  }

  const getTotalWorkoutMinutes = () => {
    return workoutHistory.reduce((acc, w) => acc + w.duration, 0)
  }

  const recoveryDistribution = calculateRecoveryDistribution()
  const workoutsByType = getWorkoutsByType()
  const totalMinutes = getTotalWorkoutMinutes()
  const avgHRV = calculateAverageHRV()

  const mostCommonRecovery = Object.entries(recoveryDistribution)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as 'optimal' | 'good' | 'moderate' | 'poor' | undefined

  return (
    <div className="progress-screen">
      <header className="progress-header">
        <h1>Your Progress</h1>
        <p className="header-subtitle">Track your recovery and training journey</p>
      </header>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        <button
          className={`timeframe-btn ${timeframe === '7d' ? 'active' : ''}`}
          onClick={() => setTimeframe('7d')}
        >
          7 Days
        </button>
        <button
          className={`timeframe-btn ${timeframe === '30d' ? 'active' : ''}`}
          onClick={() => setTimeframe('30d')}
        >
          30 Days
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{workoutHistory.length}</div>
          <div className="stat-label">Workouts</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{totalMinutes}</div>
          <div className="stat-label">Total Minutes</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-value">{avgHRV}</div>
          <div className="stat-label">Avg HRV</div>
        </Card>
      </div>

      {/* HRV Trend */}
      {hrvHistory.length > 0 && (
        <Card className="trend-card">
          <div className="card-header-section">
            <h3 className="section-title">HRV Trend</h3>
            {mostCommonRecovery && (
              <StatusBadge status={mostCommonRecovery} />
            )}
          </div>
          <HRVTrendGraph data={hrvHistory.slice().reverse()} height={150} />
          <div className="trend-stats">
            <div className="trend-stat">
              <span className="trend-stat-label">Highest</span>
              <span className="trend-stat-value">{Math.max(...hrvHistory.map(h => h.hrv))} ms</span>
            </div>
            <div className="trend-stat">
              <span className="trend-stat-label">Lowest</span>
              <span className="trend-stat-value">{Math.min(...hrvHistory.map(h => h.hrv))} ms</span>
            </div>
            <div className="trend-stat">
              <span className="trend-stat-label">Average</span>
              <span className="trend-stat-value">{avgHRV} ms</span>
            </div>
          </div>
        </Card>
      )}

      {/* Recovery Distribution */}
      {hrvHistory.length > 0 && (
        <Card className="distribution-card">
          <h3 className="section-title">Recovery Distribution</h3>
          <div className="distribution-bars">
            {Object.entries(recoveryDistribution).map(([status, count]) => {
              const percentage = (count / hrvHistory.length) * 100
              const colors = {
                optimal: '#10b981',
                good: '#059669',
                moderate: '#f59e0b',
                poor: '#ef4444'
              }
              return (
                <div key={status} className="distribution-row">
                  <div className="distribution-label">
                    <StatusBadge status={status as any} />
                  </div>
                  <div className="distribution-bar-container">
                    <div
                      className="distribution-bar"
                      style={{
                        width: `${percentage}%`,
                        background: colors[status as keyof typeof colors]
                      }}
                    />
                  </div>
                  <div className="distribution-count">{count} days</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Workout Summary */}
      {workoutHistory.length > 0 && (
        <Card className="workout-summary-card">
          <h3 className="section-title">Workout Summary</h3>
          <div className="workout-types">
            {Object.entries(workoutsByType).map(([type, count]) => (
              <div key={type} className="workout-type-row">
                <span className="workout-type-name">{type}</span>
                <span className="workout-type-count">{count} sessions</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Milestones */}
      <Card className="milestones-card">
        <h3 className="section-title">Milestones</h3>
        <div className="milestones-list">
          <div className={`milestone-item ${workoutHistory.length >= 1 ? 'achieved' : ''}`}>
            <span className="milestone-icon">{workoutHistory.length >= 1 ? '✅' : '⭕'}</span>
            <div className="milestone-info">
              <h4 className="milestone-title">First Workout</h4>
              <p className="milestone-description">Complete your first workout</p>
            </div>
          </div>

          <div className={`milestone-item ${workoutHistory.length >= 5 ? 'achieved' : ''}`}>
            <span className="milestone-icon">{workoutHistory.length >= 5 ? '✅' : '⭕'}</span>
            <div className="milestone-info">
              <h4 className="milestone-title">5 Workouts</h4>
              <p className="milestone-description">Stay consistent with 5 workouts</p>
            </div>
            {workoutHistory.length < 5 && (
              <span className="milestone-progress">{workoutHistory.length}/5</span>
            )}
          </div>

          <div className={`milestone-item ${streak >= 7 ? 'achieved' : ''}`}>
            <span className="milestone-icon">{streak >= 7 ? '✅' : '⭕'}</span>
            <div className="milestone-info">
              <h4 className="milestone-title">Week Warrior</h4>
              <p className="milestone-description">Maintain a 7-day streak</p>
            </div>
            {streak < 7 && (
              <span className="milestone-progress">{streak}/7</span>
            )}
          </div>

          <div className={`milestone-item ${totalMinutes >= 300 ? 'achieved' : ''}`}>
            <span className="milestone-icon">{totalMinutes >= 300 ? '✅' : '⭕'}</span>
            <div className="milestone-info">
              <h4 className="milestone-title">5 Hour Club</h4>
              <p className="milestone-description">Train for 300 minutes total</p>
            </div>
            {totalMinutes < 300 && (
              <span className="milestone-progress">{totalMinutes}/300</span>
            )}
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {hrvHistory.length === 0 && workoutHistory.length === 0 && (
        <Card className="empty-state">
          <div className="empty-icon">📊</div>
          <h3 className="empty-title">No Data Yet</h3>
          <p className="empty-description">
            Start logging workouts and HRV data to see your progress here!
          </p>
        </Card>
      )}
    </div>
  )
}
