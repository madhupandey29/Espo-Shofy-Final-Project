/**
 * Test script for Breadcrumb JSON-LD implementation
 * Run this to verify the utility function works correctly
 */

// Simulate the utility function
function generateBreadcrumbStructuredData(breadcrumbItems) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amrita-fashions.com';
  
  // Remove trailing slash from base URL
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  
  const itemListElement = breadcrumbItems.map((item, index) => {
    // Construct full URL
    const itemUrl = item.url.startsWith('http') 
      ? item.url 
      : `${cleanBaseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`;
    
    return {
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": itemUrl
    };
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
}

// Test cases
console.log('=== Breadcrumb JSON-LD Test Cases ===\n');

// Test 1: Fabric Page
console.log('1. Fabric Page:');
const fabricBreadcrumb = generateBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Fabrics', url: '/fabric' }
]);
console.log(JSON.stringify(fabricBreadcrumb, null, 2));
console.log('\n');

// Test 2: Product Details Page
console.log('2. Product Details Page:');
const productBreadcrumb = generateBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Fabric', url: '/fabric' },
  { name: 'Premium Cotton Fabric', url: '/fabric/premium-cotton' }
]);
console.log(JSON.stringify(productBreadcrumb, null, 2));
console.log('\n');

// Test 3: Blog Details Page
console.log('3. Blog Details Page:');
const blogBreadcrumb = generateBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Latest Textile Trends 2024', url: '/blog-details/textile-trends-2024' }
]);
console.log(JSON.stringify(blogBreadcrumb, null, 2));
console.log('\n');

// Test 4: Contact Page
console.log('4. Contact Page:');
const contactBreadcrumb = generateBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' }
]);
console.log(JSON.stringify(contactBreadcrumb, null, 2));
console.log('\n');

console.log('=== All Tests Completed ===');
console.log('\nTo test in browser:');
console.log('1. Start your Next.js dev server: npm run dev');
console.log('2. Visit any page (e.g., /fabric, /about, /contact)');
console.log('3. View page source (Ctrl+U or Cmd+U)');
console.log('4. Search for "BreadcrumbList" to see the JSON-LD');
console.log('5. Validate at: https://search.google.com/test/rich-results');
