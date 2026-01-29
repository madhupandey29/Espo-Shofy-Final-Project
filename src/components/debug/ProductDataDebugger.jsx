'use client';
import React, { useState } from 'react';

const ProductDataDebugger = ({ product = {}, show = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!show) return null;

  const relevantFields = {
    keywords: product.keywords,
    suitability: product.suitability,
    aiTempOutput: product.aiTempOutput,
    // Check for alternative field names that might contain this data
    productKeywords: product.productKeywords,
    productSuitability: product.productSuitability,
    suitableFor: product.suitableFor,
    tags: product.tags,
    categories: product.categories,
    // Check all fields that might contain suitable/keyword data
    allFields: Object.keys(product).filter(key => 
      key.toLowerCase().includes('suitable') || 
      key.toLowerCase().includes('keyword') ||
      key.toLowerCase().includes('tag') ||
      key.toLowerCase().includes('category')
    ).reduce((acc, key) => {
      acc[key] = product[key];
      return acc;
    }, {})
  };

  const hasAnyData = Object.values(relevantFields).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

  return (
    <div className="product-data-debugger">
      <div className="debugger-header">
        <h3>🔍 Product Data Debug - Suitable For & Keywords</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-btn"
        >
          {isExpanded ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>

      {isExpanded && (
        <div className="debugger-content">
          <div className="status-section">
            <h4>Data Status:</h4>
            <div className={`status ${hasAnyData ? 'has-data' : 'no-data'}`}>
              {hasAnyData ? '✅ Some relevant data found' : '❌ No suitable/keyword data found'}
            </div>
          </div>

          <div className="fields-section">
            <h4>Expected Fields:</h4>
            {Object.entries(relevantFields).map(([key, value]) => {
              if (key === 'allFields') return null;
              
              const hasValue = Array.isArray(value) ? value.length > 0 : 
                              (typeof value === 'object' && value !== null) ? Object.keys(value).length > 0 :
                              value !== undefined && value !== null && String(value).trim() !== '';
              
              return (
                <div key={key} className="field-row">
                  <span className="field-name">{key}:</span>
                  <span className={`field-status ${hasValue ? 'has-value' : 'no-value'}`}>
                    {hasValue ? '✅' : '❌'}
                  </span>
                  <div className="field-value">
                    {hasValue ? (
                      <pre>{JSON.stringify(value, null, 2)}</pre>
                    ) : (
                      <span className="empty">No data</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(relevantFields.allFields).length > 0 && (
            <div className="alternative-fields">
              <h4>Alternative Fields 