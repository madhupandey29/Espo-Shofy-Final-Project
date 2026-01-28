'use client';

import React from 'react';

const AltTextDebugger = ({ productItem, show = false }) => {
  if (!show || process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Normalize product data (same logic as ProductDetailsContent)
  let normalizedProduct = {};
  
  if (Array.isArray(productItem)) {
    normalizedProduct = productItem[0] || {};
  } else if (Array.isArray(productItem?.data)) {
    normalizedProduct = productItem.data[0] || {};
  } else if (productItem?.data && typeof productItem.data === 'object') {
    normalizedProduct = productItem.data;
  } else {
    normalizedProduct = productItem;
  }

  const altTextData = {
    altTextImage1: normalizedProduct?.altTextImage1,
    altTextImage2: normalizedProduct?.altTextImage2,
    altTextImage3: normalizedProduct?.altTextImage3,
    altTextVideo: normalizedProduct?.altTextVideo,
    collectionAltTextImage1: normalizedProduct?.collection?.altTextCollectionImage1,
    collectionAltTextVideo: normalizedProduct?.collection?.collectionaltTextVideo
  };

  const imageData = {
    image1: normalizedProduct?.image1 || normalizedProduct?.image1CloudUrl,
    image2: normalizedProduct?.image2 || normalizedProduct?.image2CloudUrl,
    image3: normalizedProduct?.image3 || normalizedProduct?.image3CloudUrl,
    videourl: normalizedProduct?.videourl || normalizedProduct?.videoURL,
    collectionImage: normalizedProduct?.collection?.collectionImage1CloudUrl,
    collectionVideo: normalizedProduct?.collection?.collectionvideoURL
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      border: '2px solid #4CAF50'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🔍 Alt Text Debugger</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#FFC107' }}>📝 Alt Text Data:</h4>
        {Object.entries(altTextData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '3px' }}>
            <span style={{ color: '#81C784' }}>{key}:</span>{' '}
            <span style={{ color: value ? '#E8F5E8' : '#FFCDD2' }}>
              {value || 'null'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#FFC107' }}>🖼️ Image/Video URLs:</h4>
        {Object.entries(imageData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '3px' }}>
            <span style={{ color: '#81C784' }}>{key}:</span>{' '}
            <span style={{ color: value ? '#E8F5E8' : '#FFCDD2' }}>
              {value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null'}
            </span>
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ margin: '0 0 5px 0', color: '#FFC107' }}>📊 Summary:</h4>
        <div style={{ color: '#E8F5E8' }}>
          Product Name: {normalizedProduct?.name || normalizedProduct?.productTitle || 'Unknown'}
        </div>
        <div style={{ color: '#E8F5E8' }}>
          Alt Texts Available: {Object.values(altTextData).filter(Boolean).length}/6
        </div>
        <div style={{ color: '#E8F5E8' }}>
          Media URLs Available: {Object.values(imageData).filter(Boolean).length}/6
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#BDBDBD' }}>
        Add ?debug=alt to URL to show this debugger
      </div>
    </div>
  );
};

export default AltTextDebugger;