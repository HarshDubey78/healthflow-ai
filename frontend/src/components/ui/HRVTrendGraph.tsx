import React from 'react'
import { HRVData } from '../../utils/storage'
import '../../styles/HRVTrendGraph.css'

interface HRVTrendGraphProps {
  data: HRVData[]
  height?: number
}

export const HRVTrendGraph: React.FC<HRVTrendGraphProps> = ({ data, height = 120 }) => {
  if (data.length === 0) {
    return (
      <div className="hrv-trend-empty" style={{ height }}>
        <p>No HRV data yet</p>
      </div>
    )
  }

  // Calculate min/max for scaling
  const hrvValues = data.map(d => d.hrv)
  const minHRV = Math.min(...hrvValues) - 5
  const maxHRV = Math.max(...hrvValues) + 5
  const range = maxHRV - minHRV

  // Create SVG points
  const width = 100 // percentage
  const step = width / (data.length - 1 || 1)

  const points = data
    .map((d, i) => {
      const x = i * step
      const y = height - ((d.hrv - minHRV) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  // Baseline (average)
  const baseline = data.reduce((sum, d) => sum + d.hrv, 0) / data.length
  const baselineY = height - ((baseline - minHRV) / range) * height

  return (
    <div className="hrv-trend-graph">
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {/* Baseline */}
        <line
          x1="0"
          y1={baselineY}
          x2="100"
          y2={baselineY}
          stroke="#cbd5e0"
          strokeWidth="1"
          strokeDasharray="4"
        />

        {/* Area under curve */}
        <polygon
          points={`0,${height} ${points} 100,${height}`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2" />

        {/* Data points */}
        {data.map((d, i) => {
          const x = i * step
          const y = height - ((d.hrv - minHRV) / range) * height
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="var(--primary)" className="hrv-point" />
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="hrv-trend-labels">
        {data.map((d, i) => (
          <div key={i} className="hrv-trend-label">
            <span className="trend-date">{new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
