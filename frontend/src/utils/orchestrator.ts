/**
 * Orchestrator - Bridges the new UI with existing backend agents
 * Connects DailyHome, Progress, and other screens to the multi-agent system
 */

const API_BASE = 'http://localhost:5001/api'

export interface HRVAnalysisRequest {
  hrv_ms: number
  baseline_hrv: number
  resting_hr: number
  baseline_resting_hr: number
  sleep_hours: number
  baseline_sleep: number
}

export interface HRVAnalysisResponse {
  success: boolean
  response: string
  recovery_score?: 'optimal' | 'good' | 'moderate' | 'poor'
}

export interface MedicalProfileRequest {
  surgery: string
  restrictions: string[]
  medications: string[]
}

export interface MedicalProfileResponse {
  success: boolean
  response: string
  parsed_constraints?: any
}

export interface WorkoutRequest {
  hrv_analysis: string
  medical_constraints: string
  equipment: string[]
  time_available: number
  goals?: string[]
}

export interface WorkoutResponse {
  success: boolean
  response: string
  workout_plan?: any
}

export interface NutritionRequest {
  medications: string[]
  recent_meals: string[]
}

export interface NutritionResponse {
  success: boolean
  response: string
  interactions?: any
}

class HealthFlowOrchestrator {
  /**
   * Analyze HRV data to determine recovery status
   */
  async analyzeHRV(data: HRVAnalysisRequest): Promise<HRVAnalysisResponse> {
    try {
      const response = await fetch(`${API_BASE}/hrv/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('HRV Analysis failed:', error)
      return {
        success: false,
        response: 'Unable to analyze HRV at this time. Using cached data.'
      }
    }
  }

  /**
   * Parse medical profile and extract constraints
   */
  async parseMedicalProfile(data: MedicalProfileRequest): Promise<MedicalProfileResponse> {
    try {
      const response = await fetch(`${API_BASE}/medical/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Medical profile parsing failed:', error)
      return {
        success: false,
        response: 'Unable to parse medical profile. Please try again.'
      }
    }
  }

  /**
   * Generate personalized workout based on HRV, medical constraints, and equipment
   */
  async generateWorkout(data: WorkoutRequest): Promise<WorkoutResponse> {
    try {
      const response = await fetch(`${API_BASE}/workout/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Workout generation failed:', error)
      return {
        success: false,
        response: 'Unable to generate workout. Backend may be offline.'
      }
    }
  }

  /**
   * Check nutrition for medication-food interactions
   */
  async checkNutrition(data: NutritionRequest): Promise<NutritionResponse> {
    try {
      const response = await fetch(`${API_BASE}/nutrition/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Nutrition check failed:', error)
      return {
        success: false,
        response: 'Unable to check nutrition interactions. Backend may be offline.'
      }
    }
  }

  /**
   * Full workflow: HRV → Medical → Workout generation
   * This orchestrates all agents for the daily workout flow
   */
  async generateDailyWorkout(params: {
    hrv_ms: number
    baseline_hrv: number
    resting_hr: number
    baseline_resting_hr: number
    sleep_hours: number
    baseline_sleep: number
    surgery: string
    restrictions: string[]
    medications: string[]
    equipment: string[]
    time_available: number
    goals?: string[]
  }): Promise<{
    hrv_analysis: HRVAnalysisResponse
    medical_profile: MedicalProfileResponse
    workout: WorkoutResponse
  }> {
    // Step 1: Analyze HRV
    const hrv_analysis = await this.analyzeHRV({
      hrv_ms: params.hrv_ms,
      baseline_hrv: params.baseline_hrv,
      resting_hr: params.resting_hr,
      baseline_resting_hr: params.baseline_resting_hr,
      sleep_hours: params.sleep_hours,
      baseline_sleep: params.baseline_sleep
    })

    // Step 2: Parse medical profile
    const medical_profile = await this.parseMedicalProfile({
      surgery: params.surgery,
      restrictions: params.restrictions,
      medications: params.medications
    })

    // Step 3: Generate workout
    const workout = await this.generateWorkout({
      hrv_analysis: hrv_analysis.response,
      medical_constraints: medical_profile.response,
      equipment: params.equipment,
      time_available: params.time_available,
      goals: params.goals
    })

    return {
      hrv_analysis,
      medical_profile,
      workout
    }
  }
}

// Export singleton instance
export const orchestrator = new HealthFlowOrchestrator()
