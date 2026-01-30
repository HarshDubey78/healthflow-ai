import React from 'react'
import '../../styles/Card.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`ui-card ${hover ? 'ui-card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="ui-card-header">
      <div>
        <h3 className="ui-card-title">{title}</h3>
        {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="ui-card-action">{action}</div>}
    </div>
  )
}

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return <div className={`ui-card-content ${className}`}>{children}</div>
}
