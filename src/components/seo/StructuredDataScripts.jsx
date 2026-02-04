'use client';
import { useEffect } from 'react';

const StructuredDataScripts = ({ blogStructuredData, breadcrumbStructuredData }) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll('script[data-structured-data="true"]');
    existingScripts.forEach(script => script.remove());

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

    // Cleanup function
    return () => {
      if (typeof document !== 'undefined') {
        const scriptsToRemove = document.querySelectorAll('script[data-structured-data="true"]');
        scriptsToRemove.forEach(script => script.remove());
      }
    };
  }, [blogStructuredData, breadcrumbStructuredData]);

  return null;
};

export default StructuredDataScripts;