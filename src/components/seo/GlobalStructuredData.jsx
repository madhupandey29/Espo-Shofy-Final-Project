'use client';
import { useEffect, useState } from 'react';
import { useGetOfficeInformationQuery } from '@/redux/features/officeInformationApi';
import { generateCorporationStructuredData } from '@/utils/corporationStructuredData';

const GlobalStructuredData = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const { data: companyData, isSuccess, isLoading, error } = useGetOfficeInformationQuery();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch site settings on component mount
  useEffect(() => {
    if (!isClient) return;

    const fetchSiteSettings = async () => {
      try {
        // Import dynamically to avoid SSR issues
        const { getDefaultSeoSettings } = await import('@/utils/seo');
        const settings = await getDefaultSeoSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
        setSiteSettings(null);
      }
    };

    fetchSiteSettings();
  }, [isClient]);

  useEffect(() => {
    // Only run on client side
    if (!isClient || typeof window === 'undefined') return;
    
    // Wait for data to be loaded
    if (isLoading || error) return;
    
    // Check if we have valid company data
    if (!isSuccess || !companyData || !companyData.success || !companyData.data) return;

    const companyInfo = companyData.data[0];
    if (!companyInfo || !companyInfo.name) return;

    try {
      // Remove any existing corporation structured data scripts
      const existingCorporationScripts = document.querySelectorAll('script[data-structured-data="true"][data-type="corporation"]');
      existingCorporationScripts.forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });

      // Generate corporation structured data
      const corporationStructuredData = generateCorporationStructuredData(companyInfo, siteSettings);

      if (corporationStructuredData) {
        const corporationScript = document.createElement('script');
        corporationScript.type = 'application/ld+json';
        corporationScript.setAttribute('data-structured-data', 'true');
        corporationScript.setAttribute('data-type', 'corporation');
        corporationScript.textContent = JSON.stringify(corporationStructuredData, null, 2);
        
        if (document.head) {
          document.head.appendChild(corporationScript);
        }
      }
    } catch (err) {
      console.error('Error generating corporation structured data:', err);
    }

    // Cleanup function
    return () => {
      if (typeof document !== 'undefined' && document.querySelectorAll) {
        try {
          const scriptsToRemove = document.querySelectorAll('script[data-structured-data="true"][data-type="corporation"]');
          scriptsToRemove.forEach(script => {
            if (script && script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });
        } catch (err) {
          console.error('Error cleaning up structured data scripts:', err);
        }
      }
    };
  }, [companyData, isSuccess, isLoading, error, siteSettings, isClient]);

  return null;
};

export default GlobalStructuredData;