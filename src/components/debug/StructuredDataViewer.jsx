'use client';
import React, { useState } from 'react';

const StructuredDataViewer = ({ blogData, authorData, structuredData }) => {
  const [activeTab, setActiveTab] = useState('structured');

  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const tabStyle = (isActive) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#0070f3' : '#f5f5f5',
    color: isActive ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0',
    marginRight: '4px'
  });

  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '400px',
    maxHeight: '500px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '12px'
  };

  const contentStyle = {
    padding: '16px',
    maxHeight: '400px',
    overflow: 'auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '0 0 8px 8px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
        <button 
          style={tabStyle(activeTab === 'structured')}
          onClick={() => setActiveTab('structured')}
        >
          Structured Data
        </button>
        <button 
          style={tabStyle(activeTab === 'blog')}
          onClick={() => setActiveTab('blog')}
        >
          Blog Data
        </button>
        <button 
          style={tabStyle(activeTab === 'author')}
          onClick={() => setActiveTab('author')}
        >
          Author Data
        </button>
      </div>
      
      <div style={contentStyle}>
        {activeTab === 'structured' && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#0070f3' }}>BlogPosting Schema</h4>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(structuredData, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'blog' && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#0070f3' }}>Blog API Data</h4>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(blogData, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'author' && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#0070f3' }}>Author API Data</h4>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {authorData ? JSON.stringify(authorData, null, 2) : 'No author data found'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StructuredDataViewer;