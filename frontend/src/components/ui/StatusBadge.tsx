import React from 'react'
import '../../styles/StatusBadge.css'

export type RecoveryStatus = 'optimal' | 'good' | 'moderate' | 'poor'

interface StatusBadgeProps {
  status: RecoveryStatus
  label?: string
  size?: 'small' | 'medium' | 'large'
}

const statusConfig = {
  optimal: {
    label: 'Optimal Recovery',
    color: '#10b981',
    bgColor: '#ecfdf5',
    icon: '🟢'
  },
  good: {
    label: 'Good Recovery',
    color: '#059669',
    bgColor: '#d1fae5',
    icon: '🟢'
  },
  moderate: {
    label: 'Moderate Recovery',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: '🟡'
  },
  poor: {
    label: 'Poor Recovery',
    color: '#ef4444',
    bgColor: '#fef2f2',
    icon: '🔴'
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'medium'
}) => {
  const config = statusConfig[status]

  return (
    <div
      className={`status-badge status-badge-${size}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}40`
      }}
    >
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{label || config.label}</span>
    </div>
  )
}
