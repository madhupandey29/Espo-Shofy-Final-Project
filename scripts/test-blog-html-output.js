/**
 * Test Blog Page HTML Output
 * This script helps verify that the Blog JSON-LD is properly rendered in the HTML
 */

const { generateBlogPageStructuredData } = require('../src/utils/blogPageStructuredData');

// Mock Topic Page Data (raw data from API)
const mockTopicPageData = {
  id: "6986ebc7799fab2bb",
  name: "blog",
  deleted: false,
  description: "Explore our latest insights on textiles, fabrics, and fashion trends",
  slug: "blog",
  metaTitle: "Latest Textile & Fabric Insights | Amrita Global Blog",
  keywords: [
    "textile blog",
    "fabric trends",
    "fashion insights",
    "manufacturing updates",
    "industry news",
    "textile technology"
  ],
  canonicalUrl: "https://www.amrita-fashions.com/blog",
  excerpt: "Stay updated with the latest trends and insights in the textile industry",
  ogType: "blog",
  versionNumber: 1
};

// Mock Blog data
const mockBlogs = [
  {
    id: "697de99534ba364a2",
    title: "Is Modern Fabric Technology Making Clothing Better?",
    slug: "is-modern-fabric-technology-making-clothing-better-or-making-consumers-careless-about-quality",
    status: "Approved",
    publishedAt: "2026-01-25 18:30:00"
  },
  {
    id: "697a03d42bfdf49cf",
    title: "Why Is the Textile Industry in West Bengal Ideal for Denim?",
    slug: "denim-manufacturers-in-west-bengal-for-garment-bran",
    status: "Approved",
    publishedAt: "2026-01-31 18:30:00"
  }
];

console.log('🧪 Testing Blog Page HTML Output\n');
console.log('='.repeat(70));

// Generate structured data
const structuredData = generateBlogPageStructuredData(
  mockTopicPageData,
  mockBlogs,
  'https://www.amrita-fashions.com'
);

// Simulate HTML output
const htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${mockTopicPageData.metaTitle}</title>
  <meta name="description" content="${mockTopicPageData.description}">
  
  <!-- Blog Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
  </script>
  
</head>
<body>
  <h1>Blog Page</h1>
</body>
</html>
`;

console.log('\n📄 Simulated HTML Output:');
console.log('-'.repeat(70));
console.log(htmlOutput);

console.log('\n✅ JSON-LD Validation:');
console.log('-'.repeat(70));

// Validate the JSON-LD
try {
  const jsonLdMatch = htmlOutput.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    const jsonLdContent = jsonLdMatch[1].trim();
    const parsed = JSON.parse(jsonLdContent);
    
    console.log('✓ JSON-LD is valid JSON');
    console.log('✓ @type:', parsed['@type']);
    console.log('✓ name:', parsed.name);
    console.log('✓ description:', parsed.description);
    console.log('✓ url:', parsed.url);
    console.log('✓ blogPost items:', parsed.blogPost?.numberOfItems || 0);
    
    console.log('\n📋 Blog Posts in ItemList:');
    if (parsed.blogPost?.itemListElement) {
      parsed.blogPost.itemListElement.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name}`);
        console.log(`     ${item.url}`);
      });
    }
    
  } else {
    console.log('❌ No JSON-LD script tag found in HTML');
  }
} catch (error) {
  console.log('❌ Error parsing JSON-LD:', error.message);
}

console.log('\n' + '='.repeat(70));
console.log('✅ Test Complete!');
console.log('\n💡 Next Steps:');
console.log('  1. Start your dev server: npm run dev');
console.log('  2. Navigate to: http://localhost:3000/blog');
console.log('  3. View page source (Ctrl+U)');
console.log('  4. Search for "application/ld+json"');
console.log('  5. Verify Blog schema is present');
console.log('  6. Test with Google Rich Results Test');
console.log('\n');
