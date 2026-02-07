'use client';

import { useState, useEffect } from 'react';
import { useGetProductsByCollectionQuery, useGetSingleNewProductQuery } from '@/redux/features/newProductApi';
import { generateCollectionItemListStructuredData } from '@/utils/collectionItemListStructuredData';

export default function TestCollectionItemListPage() {
  const [testSlug, setTestSlug] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [structuredData, setStructuredData] = useState(null);

  // Fetch product by slug
  const { data: productData } = useGetSingleNewProductQuery(testSlug, { skip: !testSlug });
  
  // Fetch collection products
  const { data: collectionData } = useGetProductsByCollectionQuery(collectionId, { skip: !collectionId });

  useEffect(() => {
    if (productData?.data && collectionData?.data) {
      const product = productData.data;
      const products = collectionData.data;
      
      const data = generateCollectionItemListStructuredData(
        products,
        product,
        product?.collection
      );
      
      setStructuredData(data);
    }
  }, [productData, collectionData]);

  const handleTest = () => {
    if (!testSlug) {
      alert('Please enter a product slug');
      return;
    }
    
    // Get collection ID from product
    if (productData?.data) {
      const product = productData.data;
      const id = product?.collectionId || product?.collection?.id || product?.collection?._id || product?.collection;
      setCollectionId(id || '');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Test Collection ItemList Structured Data</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '15px' }}>Test Product</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Product Slug:
          </label>
          <input
            type="text"
            value={testSlug}
            onChange={(e) => setTestSlug(e.target.value)}
            placeholder="Enter product slug (e.g., nokia-1)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <button
          onClick={handleTest}
          style={{
            padding: '10px 20px',
            background: '#0989ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Generate Structured Data
        </button>
      </div>

      {productData?.data && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#e8f4fd', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px' }}>Product Info</h3>
          <p><strong>Name:</strong> {productData.data.name || productData.data.productTitle}</p>
          <p><strong>Collection ID:</strong> {collectionId || 'Not found'}</p>
          <p><strong>Collection Name:</strong> {productData.data.collection?.name || 'Not found'}</p>
        </div>
      )}

      {collectionData?.data && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#e8f4fd', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px' }}>Collection Products</h3>
          <p><strong>Total Products:</strong> {collectionData.data.length}</p>
          <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '10px' }}>
            {collectionData.data.map((p, i) => (
              <div key={i} style={{ padding: '5px 0', borderBottom: '1px solid #ddd' }}>
                {i + 1}. {p.name || p.productTitle} ({p.productslug || p.slug})
              </div>
            ))}
          </div>
        </div>
      )}

      {structuredData && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Generated Structured Data (JSON-LD)</h3>
          <div style={{ 
            background: '#1e1e1e', 
            color: '#d4d4d4', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '500px'
          }}>
            <pre style={{ margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
              {JSON.stringify(structuredData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {structuredData && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Preview (How it appears in HTML)</h3>
          <div style={{ 
            background: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <code style={{ fontSize: '13px', wordBreak: 'break-all' }}>
              {`<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
            </code>
          </div>
        </div>
      )}

      <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <h3 style={{ marginBottom: '15px' }}>How to Test</h3>
        <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Enter a product slug (e.g., "nokia-1", "majestica-1")</li>
          <li>Click "Generate Structured Data"</li>
          <li>View the generated JSON-LD below</li>
          <li>Copy the JSON and test it in <a href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#0989ff' }}>Google's Structured Data Testing Tool</a></li>
          <li>Or test in <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" style={{ color: '#0989ff' }}>Rich Results Test</a></li>
        </ol>
      </div>
    </div>
  );
}
