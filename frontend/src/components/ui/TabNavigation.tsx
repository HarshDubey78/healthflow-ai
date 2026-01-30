import React from 'react'
import '../../styles/TabNavigation.css'

export type TabType = 'home' | 'progress' | 'nutrition' | 'settings'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: '🏠' },
  { id: 'progress' as TabType, label: 'Progress', icon: '📊' },
  { id: 'nutrition' as TabType, label: 'Nutrition', icon: '🍎' },
  { id: 'settings' as TabType, label: 'Settings', icon: '⚙️' }
]

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
