'use client';
import { useEffect } from 'react';

const StructuredDataScripts = ({ 
  blogStructuredData, 
  breadcrumbStructuredData, 
  productStructuredData, 
  corporationStructuredData 
}) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll('script[data-structured-data="true"]');
    existingScripts.forEach(script => script.remove());

    // Add corporation structured data script to head (for all pages)
    if (corporationStructuredData) {
      const corporationScript = document.createElement('script');
      corporationScript.type = 'application/ld+json';
      corporationScript.setAttribute('data-structured-data', 'true');
      corporationScript.setAttribute('data-type', 'corporation');
      corporationScript.textContent = JSON.stringify(corporationStructuredData, null, 2);
      document.head.appendChild(corporationScript);
    }

    // Add blog structured data script to head
    if (blogStructuredData) {
      const blogScript = document.createElement('script');
      blogScript.type = 'application/ld+json';
      blogScript.setAttribute('data-structured-data', 'true');
      blogScript.setAttribute('data-type', 'blog');
      blogScript.textContent = JSON.stringify(blogStructuredData, null, 2);
      document.head.appendChild(blogScript);
    }

    // Add breadcrumb structured data script to head
    if (breadcrumbStructuredData) {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-structured-data', 'true');
      breadcrumbScript.setAttribute('data-type', 'breadcrumb');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbStructuredData, null, 2);
      document.head.appendChild(breadcrumbScript);
    }

    // Add product structured data script to head
    if (productStructuredData) {
      const productScript = document.createElement('script');
      productScript.type = 'application/ld+json';
      productScript.setAttribute('data-structured-data', 'true');
      productScript.setAttribute('data-type', 'product');
      productScript.textContent = JSON.stringify(productStructuredData, null, 2);
      document.head.appendChild(productScript);
    }

    // Cleanup function
    return () => {
      if (typeof document !== 'undefined') {
        const scriptsToRemove = document.querySelectorAll('script[data-structured-data="true"]');
        scriptsToRemove.forEach(script => script.remove());
      }
    };
  }, [blogStructuredData, breadcrumbStructuredData, productStructuredData, corporationStructuredData]);

  return null;
};

export default StructuredDataScripts;