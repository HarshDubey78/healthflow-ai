import { useState } from 'react'
import axios from 'axios'
import AIOutput from './AIOutput'

const API_URL = 'http://localhost:5001/api'

// Configure axios with timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

interface MedicalProfileData {
  surgery: string
  weeks_post_op: number
  restrictions: string[]
  medications: string[]
}

interface MedicalProfileProps {
  onConstraints: (constraints: { response: string; success: boolean }) => void
  onNext: () => void
}

function MedicalProfile({ onConstraints, onNext }: MedicalProfileProps) {
  const [profile, setProfile] = useState<MedicalProfileData>({
    surgery: 'ACL Reconstruction',
    weeks_post_op: 8,
    restrictions: ['no pivoting', 'no jumping', 'progress to single-leg exercises'],
    medications: ['warfarin 5mg daily']
  })
  const [constraints, setConstraints] = useState<{ response: string; success: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const parseProfile = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/medical/parse', profile)
      setConstraints(response.data)
      onConstraints(response.data)
    } catch (error: any) {
      console.error('Error parsing medical profile:', error)
      alert('Failed to connect to backend. Check browser console for details.')
    }
    setLoading(false)
  }

  return (
    <div className="medical-profile">
      <h2>Medical Profile</h2>
      
      <div className="profile-form">
        <div className="form-group">
          <label>Surgery Type</label>
          <input 
            value={profile.surgery}
            onChange={(e) => setProfile({...profile, surgery: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Weeks Post-Op</label>
          <input 
            type="number"
            value={profile.weeks_post_op}
            onChange={(e) => setProfile({...profile, weeks_post_op: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Restrictions (comma-separated)</label>
          <textarea 
            value={profile.restrictions.join(', ')}
            onChange={(e) => setProfile({...profile, restrictions: e.target.value.split(', ')})}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Medications (comma-separated)</label>
          <input 
            value={profile.medications.join(', ')}
            onChange={(e) => setProfile({...profile, medications: e.target.value.split(', ')})}
          />
        </div>

        <button onClick={parseProfile} disabled={loading}>
          {loading ? 'Analyzing...' : '🤖 Extract Medical Constraints'}
        </button>
      </div>

      {constraints && (
        <div className="constraints-result">
          <h3>AI-Extracted Constraints</h3>
          <AIOutput response={constraints.response} fallback={false} />

          <button onClick={onNext} className="next-btn">
            Generate Workout Plan →
          </button>
        </div>
      )}
    </div>
  )
}

export default MedicalProfile