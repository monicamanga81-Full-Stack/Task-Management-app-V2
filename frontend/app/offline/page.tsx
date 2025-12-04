import React from 'react';

export default function OfflinePage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center' 
    }}>
      <h1>You are offline</h1>
      <p>Please check your internet connection to log in.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
      >
        Retry
      </button>
    </div>
  );
}
