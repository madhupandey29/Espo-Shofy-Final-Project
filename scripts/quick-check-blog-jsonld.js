/**
 * Quick Check: Blog JSON-LD Implementation
 * Run this to verify everything is set up correctly
 */

const https = require('https');

const TOPIC_PAGE_API = 'https://espobackend.vercel.app/api/topicpage';
const BLOG_API = 'https://espobackend.vercel.app/api/blog';

console.log('🔍 Quick Check: Blog JSON-LD Implementation\n');
console.log('='.repeat(70));

// Helper to fetch data
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runChecks() {
  let allPassed = true;

  // Check 1: Topic Page API
  console.log('\n📋 Check 1: Topic Page API');
  console.log('-'.repeat(70));
  try {
    const topicData = await fetchData(TOPIC_PAGE_API);
    
    if (topicData.success && Array.isArray(topicData.data)) {
      console.log('✓ Topic Page API is accessible');
      
      const blogEntry = topicData.data.find(item => item.name === 'blog');
      
      if (blogEntry) {
        console.log('✓ Blog entry found in Topic Page API');
        console.log(`  - metaTitle: ${blogEntry.metaTitle ? '✓' : '✗ MISSING'}`);
        console.log(`  - description: ${blogEntry.description ? '✓' : '✗ MISSING'}`);
        console.log(`  - canonicalUrl: ${blogEntry.canonicalUrl ? '✓' : '✗ MISSING'}`);
        
        if (!blogEntry.metaTitle || !blogEntry.description || !blogEntry.canonicalUrl) {
          console.log('\n⚠️  WARNING: Some required fields are missing!');
          allPassed = false;
        }
      } else {
        console.log('✗ Blog entry NOT found in Topic Page API');
        console.log('  ACTION REQUIRED: Add entry with name: "blog"');
        allPassed = false;
      }
    } else {
      console.log('✗ Invalid Topic Page API response');
      allPassed = false;
    }
  } catch (error) {
    console.log('✗ Failed to fetch Topic Page API:', error.message);
    allPassed = false;
  }

  // Check 2: Blog API
  console.log('\n📋 Check 2: Blog API');
  console.log('-'.repeat(70));
  try {
    const blogData = await fetchData(BLOG_API);
    
    if (blogData.success && Array.isArray(blogData.data)) {
      console.log('✓ Blog API is accessible');
      console.log(`✓ Found ${blogData.data.length} blog posts`);
      
      if (blogData.data.length === 0) {
        console.log('\n⚠️  WARNING: No blog posts found!');
        console.log('  The blogPost ItemList will be empty');
      } else {
        // Check first blog
        const firstBlog = blogData.data[0];
        console.log(`\n  First blog:`);
        console.log(`  - title: ${firstBlog.title ? '✓' : '✗ MISSING'}`);
        console.log(`  - slug: ${firstBlog.slug ? '✓' : '✗ MISSING'}`);
        
        if (!firstBlog.title || !firstBlog.slug) {
          console.log('\n⚠️  WARNING: Blog posts missing required fields!');
          allPassed = false;
        }
      }
    } else {
      console.log('✗ Invalid Blog API response');
      allPassed = false;
    }
  } catch (error) {
    console.log('✗ Failed to fetch Blog API:', error.message);
    allPassed = false;
  }

  // Check 3: Files Exist
  console.log('\n📋 Check 3: Required Files');
  console.log('-'.repeat(70));
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'src/utils/blogPageStructuredData.js',
    'src/components/seo/BlogPageJsonLd.jsx',
    'src/app/blog/page.jsx'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ ${file} - NOT FOUND`);
      allPassed = false;
    }
  });

  // Summary
  console.log('\n' + '='.repeat(70));
  if (allPassed) {
    console.log('✅ All Checks Passed!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Start dev server: npm run dev');
    console.log('  2. Navigate to: http://localhost:3000/blog');
    console.log('  3. View page source (Ctrl+U)');
    console.log('  4. Search for "application/ld+json"');
    console.log('  5. Verify Blog schema is present');
    console.log('  6. Test with Google Rich Results Test');
  } else {
    console.log('❌ Some Checks Failed!');
    console.log('\n📝 Action Required:');
    console.log('  1. Review the errors above');
    console.log('  2. Fix missing data/files');
    console.log('  3. Run this script again');
    console.log('  4. See BLOG_JSON_LD_DEBUGGING.md for help');
  }
  console.log('='.repeat(70));
  console.log('');
}

runChecks().catch(error => {
  console.error('\n❌ Error running checks:', error);
  process.exit(1);
});
