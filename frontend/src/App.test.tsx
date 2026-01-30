// Minimal test component to verify React is working

function TestApp() {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1a202c', marginBottom: '20px' }}>
        ✅ React is Working!
      </h1>
      <p style={{ color: '#4a5568', fontSize: '18px', marginBottom: '16px' }}>
        If you can see this, React is rendering correctly.
      </p>
      <button
        onClick={() => alert('Button works!')}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00b8d4 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ color: '#1a202c', marginBottom: '12px' }}>Next Steps:</h2>
        <ol style={{ color: '#4a5568', lineHeight: '1.8' }}>
          <li>If you see this, the basic React setup works</li>
          <li>Switch back to the real App by renaming files:
            <pre style={{ background: '#f1f5f9', padding: '8px', marginTop: '8px', borderRadius: '4px' }}>
              mv src/App.tsx src/App.backup.tsx{'\n'}
              mv src/App.test.tsx src/App.tsx{'\n'}
              # Restart dev server
            </pre>
          </li>
          <li>Check browser console for errors (F12 → Console tab)</li>
        </ol>
      </div>
    </div>
  )
}

export default TestApp
