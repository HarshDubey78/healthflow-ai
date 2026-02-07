// Local storage utilities for persistent user data

export interface UserProfile {
  id: string
  createdAt: string
  name?: string
  age?: number
  surgery?: {
    type: string
    date: string
    weeksPostOp: number
  }
  restrictions: string[]
  medications: string[]
  goals?: string[]
  equipment: string[]
  timeAvailable: number
  baselineHRV?: number
  baselineHR?: number
  baselineRestingHR?: number
  baselineSleep?: number
}

export interface WorkoutHistory {
  id: string
  date: string
  type: string
  completed: boolean
  workoutPlan: string
  intensity: string
  duration: number
  exercises: string[]
}

export interface HRVData {
  date: string
  hrv: number
  restingHR: number
  sleep: number
  recoveryScore: 'optimal' | 'good' | 'moderate' | 'poor'
  deviation: number
}

const STORAGE_KEYS = {
  USER_PROFILE: 'healthflow_user_profile',
  WORKOUT_HISTORY: 'healthflow_workout_history',
  HRV_HISTORY: 'healthflow_hrv_history',
  CURRENT_STREAK: 'healthflow_current_streak',
  LAST_WORKOUT_DATE: 'healthflow_last_workout_date'
}

// User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
}

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
  return data ? JSON.parse(data) : null
}

export const updateUserProfile = (updates: Partial<UserProfile>): void => {
  const current = getUserProfile()
  if (current) {
    saveUserProfile({ ...current, ...updates })
  }
}

export const isNewUser = (): boolean => {
  return getUserProfile() === null
}

// Workout History
export const saveWorkout = (workout: WorkoutHistory): void => {
  const history = getWorkoutHistory()
  history.unshift(workout) // Add to beginning
  if (history.length > 100) history.pop() // Keep last 100
  localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history))

  // Update streak
  updateStreak(workout.date, workout.completed)
}

export const getWorkoutHistory = (limit?: number): WorkoutHistory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY)
  const history = data ? JSON.parse(data) : []
  return limit ? history.slice(0, limit) : history
}

export const getRecentWorkouts = (count: number = 5): WorkoutHistory[] => {
  return getWorkoutHistory().slice(0, count)
}

// Removed markExerciseComplete - exercises are stored as string[] not objects

// HRV Data
export const saveHRVData = (data: HRVData): void => {
  const history = getHRVHistory()

  // Check if today's data already exists
  const existingIndex = history.findIndex(h => h.date === data.date)
  if (existingIndex >= 0) {
    history[existingIndex] = data
  } else {
    history.unshift(data)
  }

  if (history.length > 90) history.pop() // Keep 90 days
  localStorage.setItem(STORAGE_KEYS.HRV_HISTORY, JSON.stringify(history))
}

export const getHRVHistory = (limit?: number): HRVData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HRV_HISTORY)
  const history = data ? JSON.parse(data) : []
  return limit ? history.slice(0, limit) : history
}

export const getTodayHRV = (): HRVData | null => {
  const today = new Date().toISOString().split('T')[0]
  const history = getHRVHistory()
  return history.find(h => h.date === today) || null
}

export const getHRVTrend = (days: number = 7): HRVData[] => {
  return getHRVHistory().slice(0, days).reverse()
}

// Streak Tracking
export const updateStreak = (workoutDate: string, completed: boolean): void => {
  if (!completed) return

  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_WORKOUT_DATE)
  const currentStreak = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK) || '0')

  const workout = new Date(workoutDate)
  const last = lastDate ? new Date(lastDate) : null

  if (!last) {
    // First workout
    localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, '1')
  } else {
    const daysDiff = Math.floor((workout.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      // Consecutive day
      localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, String(currentStreak + 1))
    } else if (daysDiff > 1) {
      // Streak broken
      localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, '1')
    }
    // Same day workouts don't increase streak
  }

  localStorage.setItem(STORAGE_KEYS.LAST_WORKOUT_DATE, workoutDate)
}

export const getCurrentStreak = (): number => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK) || '0')
}

// Utility: Generate simulated HRV data
export const generateSimulatedHRV = (baselineHRV: number = 65): HRVData => {
  const today = new Date().toISOString().split('T')[0]

  // Random variation ±10ms from baseline
  const variation = (Math.random() - 0.5) * 20
  const hrv = Math.round(Math.max(45, Math.min(85, baselineHRV + variation)))

  // Calculate recovery score based on deviation from baseline
  const deviation = ((hrv - baselineHRV) / baselineHRV) * 100
  let recoveryScore: 'optimal' | 'good' | 'moderate' | 'poor'

  if (deviation > -5) recoveryScore = 'optimal'
  else if (deviation > -15) recoveryScore = 'good'
  else if (deviation > -25) recoveryScore = 'moderate'
  else recoveryScore = 'poor'

  return {
    date: today,
    hrv,
    restingHR: Math.round(58 + Math.random() * 10),
    sleep: Math.round((6.5 + Math.random() * 2) * 10) / 10,
    recoveryScore,
    deviation
  }
}

// Clear all data (for testing)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
}
