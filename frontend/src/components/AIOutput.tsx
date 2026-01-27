import React from 'react'

interface AIOutputProps {
  response: string
  fallback?: boolean
}

function AIOutput({ response, fallback }: AIOutputProps) {
  // Parse the response into sections
  const parseResponse = (text: string) => {
    const sections: { title: string; content: string; icon?: string }[] = []

    // Split by common section headers
    const sectionPatterns = [
      { pattern: /REASONING:/gi, title: 'Reasoning', icon: '🧠' },
      { pattern: /DECISION:/gi, title: 'Decision', icon: '✓' },
      { pattern: /EXPLANATION:/gi, title: 'Explanation', icon: '💡' },
      { pattern: /CONCERNS:/gi, title: 'Concerns', icon: '⚠️' },
      { pattern: /RECOMMENDATIONS:/gi, title: 'Recommendations', icon: '📋' },
      { pattern: /WORKOUT PLAN:/gi, title: 'Workout Plan', icon: '💪' },
      { pattern: /REASONING FOR EACH EXERCISE:/gi, title: 'Exercise Reasoning', icon: '🎯' },
      { pattern: /MEDICAL SAFETY CHECKS:/gi, title: 'Medical Safety Checks', icon: '🏥' },
      { pattern: /RECOVERY ALIGNMENT:/gi, title: 'Recovery Alignment', icon: '📊' },
      { pattern: /WARM-UP/gi, title: 'Warm-Up', icon: '🔥' },
      { pattern: /MAIN WORKOUT:/gi, title: 'Main Workout', icon: '💪' },
      { pattern: /COOL-DOWN/gi, title: 'Cool-Down', icon: '❄️' },
    ]

    let processedText = text
    const foundSections: { start: number; title: string; icon?: string; key: string }[] = []

    // Find all section headers
    sectionPatterns.forEach(({ pattern, title, icon }) => {
      const matches = [...processedText.matchAll(pattern)]
      matches.forEach(match => {
        if (match.index !== undefined) {
          foundSections.push({
            start: match.index,
            title,
            icon,
            key: match[0]
          })
        }
      })
    })

    // Sort sections by position
    foundSections.sort((a, b) => a.start - b.start)

    // Extract content for each section
    for (let i = 0; i < foundSections.length; i++) {
      const current = foundSections[i]
      const next = foundSections[i + 1]

      const start = current.start + current.key.length
      const end = next ? next.start : processedText.length
      const content = processedText.substring(start, end).trim()

      if (content) {
        sections.push({
          title: current.title,
          content,
          icon: current.icon
        })
      }
    }

    // If no sections found, treat entire text as one section
    if (sections.length === 0) {
      sections.push({
        title: 'Analysis',
        content: text.trim(),
        icon: '📝'
      })
    }

    return sections
  }

  const sections = parseResponse(response)

  return (
    <div className="ai-output">
      {fallback && (
        <div className="ai-fallback-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 11a5 5 0 110-10 5 5 0 010 10zm.5-5.5v-3h-1v3H5v1h2.5v3h1v-3H11v-1H8.5z"/>
          </svg>
          <span>Generated with rule-based fallback (API limited)</span>
        </div>
      )}

      <div className="ai-sections">
        {sections.map((section, idx) => (
          <div key={idx} className="ai-section">
            <div className="ai-section-header">
              {section.icon && <span className="ai-section-icon">{section.icon}</span>}
              <h4 className="ai-section-title">{section.title}</h4>
            </div>
            <div className="ai-section-content">
              {section.content.split('\n').map((line, lineIdx) => {
                // Format bullet points
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <div key={lineIdx} className="ai-bullet">
                      <span className="ai-bullet-icon">→</span>
                      <span>{line.trim().substring(1).trim()}</span>
                    </div>
                  )
                }
                // Format numbered lists
                if (/^\d+\./.test(line.trim())) {
                  return (
                    <div key={lineIdx} className="ai-numbered">
                      {line.trim()}
                    </div>
                  )
                }
                // Format checkmarks
                if (line.trim().startsWith('✓')) {
                  return (
                    <div key={lineIdx} className="ai-check">
                      <span className="ai-check-icon">✓</span>
                      <span>{line.trim().substring(1).trim()}</span>
                    </div>
                  )
                }
                // Regular text
                if (line.trim()) {
                  return <p key={lineIdx} className="ai-text">{line.trim()}</p>
                }
                return null
              })}
            </div>
          </div>
        ))}
      </div>

      {response.includes('[Note:') && (
        <div className="ai-note">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm.5 9h-1V7h1v4zm0-5h-1V5h1v1z"/>
          </svg>
          <span>
            {response.match(/\[Note:([^\]]+)\]/)?.[1]?.trim()}
          </span>
        </div>
      )}
    </div>
  )
}

export default AIOutput
