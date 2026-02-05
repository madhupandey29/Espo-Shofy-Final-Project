'use client';
import { useGetOfficeInformationQuery } from '@/redux/features/officeInformationApi';
import { generateCorporationStructuredData } from '@/utils/corporationStructuredData';
import { getDefaultSeoSettings } from '@/utils/seo';
import { useState, useEffect } from 'react';

const TestStructuredDataClient = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const { data: companyData, isLoading, error } = useGetOfficeInformationQuery();

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getDefaultSeoSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  if (isLoading) return <div className="p-4">Loading company data...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading company data: {error.message}</div>;

  const companyInfo = companyData?.data?.[0];
  const corporationStructuredData = generateCorporationStructuredData(companyInfo, siteSettings);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Structured Data Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Company Information (AGE)</h2>
          <pre className="text-sm overflow-auto bg-white p-3 rounded border">
            {JSON.stringify(companyInfo, null, 2)}
          </pre>
        </div>

        {/* Site Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Site Settings (eCatalogue)</h2>
          <pre className="text-sm overflow-auto bg-white p-3 rounded border">
            {JSON.stringify(siteSettings, null, 2)}
          </pre>
        </div>

        {/* Generated JSON-LD */}
        <div className="bg-blue-50 p-4 rounded-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Generated Corporation JSON-LD</h2>
          <pre className="text-sm overflow-auto bg-white p-3 rounded border">
            {JSON.stringify(corporationStructuredData, null, 2)}
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser developer tools (F12)</li>
          <li>Go to Elements/Inspector tab</li>
          <li>Search for `application/ld+json` in the HTML</li>
          <li>You should see the Corporation JSON-LD script in the head section</li>
          <li>Copy the JSON-LD and test it on <a href="https://search.google.com/test/rich-results" target="_blank" className="text-blue-600 underline">Google Rich Results Test</a></li>
        </ol>
      </div>
    </div>
  );
};

export default TestStructuredDataClient;