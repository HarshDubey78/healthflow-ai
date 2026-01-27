import { useState } from 'react'
import axios from 'axios'
import AIOutput from './AIOutput'

const API_URL = 'http://localhost:5001/api'

// Configure axios with timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

interface MedicationInteraction {
  medication: string
  food: string
  severity: string
  message: string
}

interface NutritionAnalysis {
  nutritional_analysis: string
  medication_interactions: MedicationInteraction[]
  safe_to_consume: boolean
}

function NutritionCheck() {
  const [meal, setMeal] = useState('')
  const [medications, setMedications] = useState('warfarin 5mg')
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeMeal = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/nutrition/analyze', {
        meal_description: meal,
        medications: medications.split(',').map(m => m.trim())
      })
      setAnalysis(response.data)
    } catch (error: any) {
      console.error('Error analyzing meal:', error)
      alert('Failed to connect to backend. Check browser console for details.')
    }
    setLoading(false)
  }

  return (
    <div className="nutrition-check">
      <h2>Nutrition & Medication Safety Check</h2>
      
      <div className="meal-input">
        <div className="form-group">
          <label>What did you eat?</label>
          <textarea 
            placeholder="e.g., grilled chicken, brown rice, spinach salad"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Current Medications</label>
          <input 
            placeholder="e.g., warfarin 5mg, simvastatin 20mg"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
          />
        </div>

        <button onClick={analyzeMeal} disabled={loading || !meal}>
          {loading ? 'Analyzing Medication Interactions...' : '🤖 Check Meal Safety'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-result">
          {analysis.medication_interactions.length > 0 && (
            <div className="interactions-warning">
              <h3>⚠️ Medication Interactions Detected</h3>
              {analysis.medication_interactions.map((interaction, idx) => (
                <div key={idx} className={`interaction severity-${interaction.severity}`}>
                  <strong>{interaction.food} + {interaction.medication}</strong>
                  <p>{interaction.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="nutritional-analysis">
            <h3>Nutritional Analysis</h3>
            <AIOutput
              response={analysis.nutritional_analysis}
              fallback={analysis.nutritional_analysis.includes('AI Analysis Unavailable')}
            />
          </div>

          <div className={`safety-badge ${analysis.safe_to_consume ? 'safe' : 'caution'}`}>
            {analysis.safe_to_consume ? '✅ Safe to consume' : '⚠️ Consume with caution - see interactions above'}
          </div>
        </div>
      )}
    </div>
  )
}

export default NutritionCheck