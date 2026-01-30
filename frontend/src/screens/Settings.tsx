import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { BottomSheet } from '../components/ui/BottomSheet'
import { getUserProfile, saveUserProfile, clearAllData, UserProfile } from '../utils/storage'
import '../styles/Settings.css'

interface SettingsProps {
  onResetComplete?: () => void
}

export const Settings: React.FC<SettingsProps> = ({ onResetComplete }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    const userProfile = getUserProfile()
    setProfile(userProfile)
    if (userProfile) {
      setEditForm(userProfile)
    }
  }, [])

  const handleEdit = (section: string) => {
    setEditingSection(section)
  }

  const handleSave = () => {
    if (profile && editForm) {
      const updatedProfile = { ...profile, ...editForm }
      saveUserProfile(updatedProfile)
      setProfile(updatedProfile)
      setEditingSection(null)
    }
  }

  const handleCancel = () => {
    setEditForm(profile || {})
    setEditingSection(null)
  }

  const handleReset = () => {
    clearAllData()
    setShowResetConfirm(false)
    if (onResetComplete) {
      onResetComplete()
    }
  }

  const addItem = (field: 'restrictions' | 'medications' | 'equipment', value: string) => {
    if (value.trim()) {
      const currentArray = editForm[field] || []
      setEditForm({
        ...editForm,
        [field]: [...currentArray, value.trim()]
      })
    }
  }

  const removeItem = (field: 'restrictions' | 'medications' | 'equipment', index: number) => {
    const currentArray = editForm[field] || []
    setEditForm({
      ...editForm,
      [field]: currentArray.filter((_, i) => i !== index)
    })
  }

  if (!profile) {
    return <div className="settings-loading">Loading...</div>
  }

  return (
    <div className="settings-screen">
      <header className="settings-header">
        <h1>Settings</h1>
        <p className="header-subtitle">Manage your profile and preferences</p>
      </header>

      {/* Personal Info */}
      <Card className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Personal Information</h3>
          <button className="edit-button" onClick={() => handleEdit('personal')}>
            ✏️ Edit
          </button>
        </div>
        <div className="settings-info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{profile.name || 'Not set'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age</span>
            <span className="info-value">{profile.age || 'Not set'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Surgery Date</span>
            <span className="info-value">
              {profile.surgery?.date ? new Date(profile.surgery.date).toLocaleDateString() : 'Not set'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Surgery Type</span>
            <span className="info-value">{profile.surgery?.type || 'Not set'}</span>
          </div>
        </div>
      </Card>

      {/* Medical Profile */}
      <Card className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Medical Profile</h3>
          <button className="edit-button" onClick={() => handleEdit('medical')}>
            ✏️ Edit
          </button>
        </div>
        <div className="settings-section">
          <h4 className="subsection-title">Restrictions</h4>
          {profile.restrictions && profile.restrictions.length > 0 ? (
            <div className="tag-list">
              {profile.restrictions.map((item, i) => (
                <span key={i} className="info-tag">{item}</span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No restrictions set</p>
          )}
        </div>
        <div className="settings-section">
          <h4 className="subsection-title">Medications</h4>
          {profile.medications && profile.medications.length > 0 ? (
            <div className="tag-list">
              {profile.medications.map((item, i) => (
                <span key={i} className="info-tag">{item}</span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No medications set</p>
          )}
        </div>
      </Card>

      {/* Fitness Profile */}
      <Card className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Fitness Profile</h3>
          <button className="edit-button" onClick={() => handleEdit('fitness')}>
            ✏️ Edit
          </button>
        </div>
        <div className="settings-section">
          <h4 className="subsection-title">Goals</h4>
          {profile.goals && profile.goals.length > 0 ? (
            <div className="tag-list">
              {profile.goals.map((item, i) => (
                <span key={i} className="info-tag goal-tag">{item}</span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No goals set</p>
          )}
        </div>
        <div className="settings-section">
          <h4 className="subsection-title">Available Equipment</h4>
          {profile.equipment && profile.equipment.length > 0 ? (
            <div className="tag-list">
              {profile.equipment.map((item, i) => (
                <span key={i} className="info-tag equipment-tag">{item}</span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No equipment set</p>
          )}
        </div>
      </Card>

      {/* Biometrics */}
      <Card className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Baseline Biometrics</h3>
          <button className="edit-button" onClick={() => handleEdit('biometrics')}>
            ✏️ Edit
          </button>
        </div>
        <div className="biometrics-grid">
          <div className="biometric-item">
            <span className="biometric-icon">❤️</span>
            <div>
              <span className="biometric-label">Resting HR</span>
              <span className="biometric-value">{profile.baselineHR || 'Not set'} bpm</span>
            </div>
          </div>
          <div className="biometric-item">
            <span className="biometric-icon">📊</span>
            <div>
              <span className="biometric-label">Baseline HRV</span>
              <span className="biometric-value">{profile.baselineHRV || 'Not set'} ms</span>
            </div>
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="settings-card">
        <h3 className="settings-card-title">App Settings</h3>
        <div className="settings-actions">
          <button className="settings-action-btn" onClick={() => window.location.reload()}>
            <span className="action-icon">🔄</span>
            <span>Refresh App</span>
          </button>
          <button className="settings-action-btn danger" onClick={() => setShowResetConfirm(true)}>
            <span className="action-icon">⚠️</span>
            <span>Reset All Data</span>
          </button>
        </div>
      </Card>

      {/* About */}
      <Card className="settings-card about-card">
        <h3 className="settings-card-title">About HealthFlow AI</h3>
        <p className="about-text">
          Version 2.0.0<br />
          Multi-agent AI system for personalized medical recovery and fitness
        </p>
      </Card>

      {/* Edit Personal Info Sheet */}
      <BottomSheet
        isOpen={editingSection === 'personal'}
        onClose={handleCancel}
        title="Edit Personal Information"
      >
        <div className="edit-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={editForm.name || ''}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-input"
              value={editForm.age || ''}
              onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Surgery Type</label>
            <input
              type="text"
              className="form-input"
              value={editForm.surgery?.type || ''}
              onChange={e => setEditForm({
                ...editForm,
                surgery: {
                  type: e.target.value,
                  date: editForm.surgery?.date || '',
                  weeksPostOp: editForm.surgery?.weeksPostOp || 0
                }
              })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Surgery Date</label>
            <input
              type="date"
              className="form-input"
              value={editForm.surgery?.date || ''}
              onChange={e => {
                const surgeryDate = new Date(e.target.value)
                const today = new Date()
                const weeks = Math.floor((today.getTime() - surgeryDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
                setEditForm({
                  ...editForm,
                  surgery: {
                    type: editForm.surgery?.type || '',
                    date: e.target.value,
                    weeksPostOp: weeks > 0 ? weeks : 0
                  }
                })
              }}
            />
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </BottomSheet>

      {/* Edit Medical Sheet */}
      <BottomSheet
        isOpen={editingSection === 'medical'}
        onClose={handleCancel}
        title="Edit Medical Profile"
      >
        <div className="edit-form">
          <div className="form-group">
            <label className="form-label">Restrictions</label>
            <div className="tag-input-group">
              {(editForm.restrictions || []).map((item, i) => (
                <div key={i} className="tag-removable">
                  {item}
                  <button onClick={() => removeItem('restrictions', i)}>×</button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="Add restriction..."
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addItem('restrictions', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Medications</label>
            <div className="tag-input-group">
              {(editForm.medications || []).map((item, i) => (
                <div key={i} className="tag-removable">
                  {item}
                  <button onClick={() => removeItem('medications', i)}>×</button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="Add medication..."
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addItem('medications', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </BottomSheet>

      {/* Edit Fitness Sheet */}
      <BottomSheet
        isOpen={editingSection === 'fitness'}
        onClose={handleCancel}
        title="Edit Fitness Profile"
      >
        <div className="edit-form">
          <div className="form-group">
            <label className="form-label">Goals</label>
            <div className="tag-input-group">
              {(editForm.goals || []).map((item, i) => (
                <div key={i} className="tag-removable goal-tag">
                  {item}
                  <button onClick={() => removeItem('goals', i)}>×</button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="Add goal..."
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addItem('goals', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Equipment</label>
            <div className="tag-input-group">
              {(editForm.equipment || []).map((item, i) => (
                <div key={i} className="tag-removable equipment-tag">
                  {item}
                  <button onClick={() => removeItem('equipment', i)}>×</button>
                </div>
              ))}
              <input
                type="text"
                className="form-input"
                placeholder="Add equipment..."
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addItem('equipment', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </BottomSheet>

      {/* Edit Biometrics Sheet */}
      <BottomSheet
        isOpen={editingSection === 'biometrics'}
        onClose={handleCancel}
        title="Edit Baseline Biometrics"
      >
        <div className="edit-form">
          <div className="form-group">
            <label className="form-label">Resting Heart Rate (bpm)</label>
            <input
              type="number"
              className="form-input"
              value={editForm.baselineHR || ''}
              onChange={e => setEditForm({ ...editForm, baselineHR: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 60"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Baseline HRV (ms)</label>
            <input
              type="number"
              className="form-input"
              value={editForm.baselineHRV || ''}
              onChange={e => setEditForm({ ...editForm, baselineHRV: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 65"
            />
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </BottomSheet>

      {/* Reset Confirmation Sheet */}
      <BottomSheet
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset All Data?"
      >
        <div className="reset-confirm">
          <p className="warning-text">
            ⚠️ This will permanently delete all your data including:
          </p>
          <ul className="warning-list">
            <li>Profile information</li>
            <li>HRV history</li>
            <li>Workout records</li>
            <li>All progress data</li>
          </ul>
          <p className="warning-text"><strong>This action cannot be undone.</strong></p>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleReset}>
              Reset Everything
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
