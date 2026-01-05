'use client';

import React from 'react';

// Sample data from your API
const sampleProduct = {
  id: "695799535233a620b",
  name: "Nokia-602",
  suitability: [], // Empty array as in your API
  aiTempOutput: `| Suitablefor           | Product                              | Confidence |
|-----------------------|--------------------------------------|------------|
| Menswear              | Casual shirts                        | 90%        |
| Menswear              | Summer kurta / short kurta          | 85%        |
| Menswear              | Lightweight pajamas / lounge pants  | 75%        |
| Womenswear            | Blouses / tops                      | 90%        |
| Womenswear            | Summer dresses                      | 85%        |
| Womenswear            | Skirts (lined or relaxed)           | 80%        |
| Womenswear            | Kurtis / tunics                     | 90%        |
| Womenswear            | Nightwear / loungewear sets         | 88%        |
| Unisex                | Casual shirts                       | 90%        |
| Unisex                | Lounge / pajama sets                | 85%        |
| Unisex                | Scrubs / light clinic wear          | 70%        |
| Kidswear              | Shirts / tops                       | 92%        |
| Kidswear              | Dresses / frocks                    | 90%        |
| Kidswear              | Shorts / light pants                | 80%        |
| Kidswear              | School summer uniforms              | 88%        |
| Uniforms / Workwear   | Hotel / front-office shirts         | 85%        |
| Uniforms / Workwear   | Corporate / office shirts           | 80%        |
| Uniforms / Workwear   | School uniforms (shirts, tunics)    | 88%        |
| Accessories           | Lightweight scarves / stoles        | 80%        |
| Accessories           | Pocket squares / handkerchiefs      | 85%        |
| Home Textiles         | Pillow covers                       | 75%        |
| Home Textiles         | Lightweight cushion covers          | 70%        |`
};

function parseSuitabilityFromAiOutput(aiTempOutput) {
  if (!aiTempOutput || typeof aiTempOutput !== 'string') return {};
  
  try {
    const lines = aiTempOutput.split('\n').filter(line => line.trim());
    const suitabilityByCategory = {};
    
    for (const line of lines) {
      if (line.includes('Suitablefor') || line.includes('---') || line.includes('Product') || line.includes('Confidence')) {
        continue;
      }
      
      const match = line.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
      if (match) {
        const category = match[1].trim();
        const product = match[2].trim();
        if (category && product) {
          if (!suitabilityByCategory[category]) {
            suitabilityByCategory[category] = [];
          }
          suitabilityByCategory[category].push(product);
        }
      }
    }
    
    return suitabilityByCategory;
  } catch (error) {
    console.error('Error parsing aiTempOutput:', error);
    return {};
  }
}

export default function TestSuitabilityPage() {
  const rawSuitability = sampleProduct.suitability;
  const aiTempOutput = sampleProduct.aiTempOutput;
  
  const suitabilityData = Array.isArray(rawSuitability) && rawSuitability.length > 0
    ? { 'General': rawSuitability }
    : parseSuitabilityFromAiOutput(aiTempOutput);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Suitability Parsing Test</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Product Data</h2>
        <p><strong>Product Name:</strong> {sampleProduct.name}</p>
        <p><strong>Product ID:</strong> {sampleProduct.id}</p>
        <p><strong>Suitability Array:</strong> {Array.isArray(rawSuitability) ? `Array with ${rawSuitability.length} items` : 'Not an array'}</p>
        <p><strong>aiTempOutput:</strong> {aiTempOutput ? `Present (${aiTempOutput.length} chars)` : 'Missing'}</p>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Parsed Suitability by Category</h2>
        {Object.keys(suitabilityData).length > 0 ? (
          <div>
            {Object.entries(suitabilityData).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2C4C97', fontSize: '16px' }}>{category}</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {items.map((item, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#666' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No suitability data found</p>
        )}
      </div>

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Vertical Categorized UI Preview</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', maxWidth: '400px' }}>
          {Object.entries(suitabilityData).map(([category, items], categoryIndex) => (
            <div key={category} style={{ borderBottom: categoryIndex < Object.keys(suitabilityData).length - 1 ? '1px solid #ddd' : 'none' }}>
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#f8f9fa', 
                fontWeight: '600', 
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <span>{category}</span>
                <span style={{ color: '#666' }}>▼</span>
              </div>
              <div style={{ padding: '0', backgroundColor: '#fff', width: '100%' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ 
                    padding: '8px 32px', 
                    fontSize: '13px', 
                    color: '#666',
                    borderBottom: index < items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                    position: 'relative',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{ position: 'absolute', left: '16px', color: '#2C4C97', fontWeight: 'bold' }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          ✅ Each category is displayed vertically (stacked), not horizontally side-by-side
        </p>
      </div>
    </div>
  );
}