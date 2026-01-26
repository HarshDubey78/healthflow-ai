import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

// Configure axios with timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

function HRVCheck({ onAnalysis, onNext }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const checkHRV = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/hrv/check')
      setData(response.data)
      onAnalysis(response.data.analysis)
    } catch (error: any) {
      console.error('Error checking HRV:', error)
      const errorMsg = error.code === 'ECONNREFUSED' || error.response?.status === 0
        ? 'Backend is not responding. Ensure Flask is running on port 5001.'
        : error.code === 'ECONNABORTED'
        ? 'Request timeout. Backend may be slow.'
        : 'Failed to connect to backend.'
      alert(errorMsg + '\n\nCheck browser console for full error details.')
    }
    setLoading(false)
  }

  useEffect(() => {
    checkHRV()
  }, [])

  if (loading) return <div className="loading">Analyzing your recovery state...</div>

  if (!data) return <div>Loading...</div>

  const hrvData = data.hrv_data
  const deviation = ((hrvData.hrv_ms - hrvData.baseline_hrv) / hrvData.baseline_hrv * 100).toFixed(1)
  const status = deviation > -10 ? 'good' : deviation > -20 ? 'moderate' : 'poor'

  return (
    <div className="hrv-check">
      <h2>Morning Recovery Check</h2>
      
      <div className={`hrv-status status-${status}`}>
        <div className="hrv-value">
          <span className="label">HRV</span>
          <span className="value">{hrvData.hrv_ms}ms</span>
        </div>
        <div className="hrv-baseline">
          <span className="label">Baseline</span>
          <span className="value">{hrvData.baseline_hrv}ms</span>
        </div>
        <div className="hrv-deviation">
          <span className="label">Deviation</span>
          <span className="value">{deviation}%</span>
        </div>
      </div>

      <div className="biometrics">
        <div className="metric">
          <span>💓 Resting HR</span>
          <strong>{hrvData.resting_hr} bpm</strong>
        </div>
        <div className="metric">
          <span>😴 Sleep</span>
          <strong>{hrvData.sleep_hours} hrs</strong>
        </div>
      </div>

      <div className="agent-analysis">
        <h3>🤖 AI Analysis</h3>
        <pre>{data.analysis.response}</pre>
      </div>

      <button onClick={onNext} className="next-btn">
        Continue to Medical Profile →
      </button>
    </div>
  )
}

export default HRVCheck