import { useState } from 'react'
import axios from 'axios'
import AIOutput from './AIOutput'

const API_URL = 'http://localhost:5001/api'

// Configure axios with timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

interface UserContext {
  time_minutes: number
  equipment: string[]
  energy_level: number
}

interface WorkoutDisplayProps {
  hrvAnalysis: { response: string; success: boolean } | null
  medicalConstraints: { response: string; success: boolean } | null
}

function WorkoutDisplay({ hrvAnalysis, medicalConstraints }: WorkoutDisplayProps) {
  const [workout, setWorkout] = useState<{ response: string; success: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<UserContext>({
    time_minutes: 30,
    equipment: ['dumbbells', 'resistance bands'],
    energy_level: 6
  })
  const [equipmentInput, setEquipmentInput] = useState('')

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setContext({
        ...context,
        equipment: [...context.equipment, equipmentInput.trim().toLowerCase()]
      })
      setEquipmentInput('')
    }
  }

  const removeEquipment = (item: string) => {
    setContext({
      ...context,
      equipment: context.equipment.filter(eq => eq !== item)
    })
  }

  const generateWorkout = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/workout/generate', {
        medical_constraints: medicalConstraints?.response || 'No specific constraints',
        hrv_analysis: hrvAnalysis?.response || 'Moderate recovery',
        user_context: context
      })
      setWorkout(response.data)
    } catch (error: any) {
      console.error('Error generating workout:', error)
      alert('Failed to connect to backend. Check browser console for details.')
    }
    setLoading(false)
  }

  return (
    <div className="workout-display">
      <h2>Adaptive Workout Generation</h2>
      
      <div className="context-inputs">
        <div className="input-group">
          <label>Time Available (minutes)</label>
          <input 
            type="number"
            value={context.time_minutes}
            onChange={(e) => setContext({...context, time_minutes: parseInt(e.target.value) || 0})}
          />
        </div>

        <div className="input-group">
          <label>Energy Level (1-10)</label>
          <input 
            type="number"
            min="1"
            max="10"
            value={context.energy_level}
            onChange={(e) => setContext({...context, energy_level: parseInt(e.target.value) || 5})}
          />
        </div>

        <div className="input-group">
          <label>Available Equipment</label>
          <div className="equipment-tags">
            {context.equipment.map(eq => (
              <span key={eq} className="tag equipment-tag">
                {eq}
                <button
                  className="tag-remove"
                  onClick={() => removeEquipment(eq)}
                  title="Remove equipment"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="equipment-input">
            <input
              type="text"
              placeholder="Add equipment (e.g., kettlebells, yoga mat)"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEquipment()}
            />
            <button onClick={addEquipment} className="btn-add">Add</button>
          </div>
        </div>
      </div>

      <button onClick={generateWorkout} disabled={loading}>
        {loading ? 'Generating Multi-Agent Workout...' : '🤖 Generate Smart Workout'}
      </button>

      {workout && (
        <div className="workout-result">
          <h3>Your Personalized Workout Plan</h3>
          <AIOutput
            response={workout.response}
            fallback={workout.response.includes('rule-based fallback')}
          />

          <div className="feedback">
            <p>Was this workout appropriate for your medical constraints and recovery state?</p>
            <div className="feedback-buttons">
              <button className="btn-success">👍 Yes, perfect</button>
              <button className="btn-danger">👎 No, too intense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutDisplay