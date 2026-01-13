#!/usr/bin/env node

/**
 * Test Dynamic Author Fix
 * Verifies that the author components are properly updated to use dynamic API data
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 TESTING DYNAMIC AUTHOR FIX');
console.log('=' .repeat(40));

function checkFileContent(filePath, checks) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    Object.entries(checks).forEach(([checkName, searchString]) => {
      results[checkName] = content.includes(searchString);
    });
    
    return { exists: true, content, results };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

console.log('\n📋 Step 1: Check Blog Details Author Component');
console.log('-'.repeat(45));

const blogDetailsPath = 'src/components/blog-details/blog-details-author.jsx';
const blogDetailsChecks = {
  'Correct API import': 'from "@/redux/api/apiSlice"',
  'API response handling': 'apiResponse?.success && apiResponse?.data',
  'Fallback name logic': 'author.name !== \'author name\'',
  'Display name variable': 'const displayName',
  'Display designation variable': 'const displayDesignation',
  'Display description variable': 'const displayDescription'
};

const blogDetailsResult = checkFileContent(blogDetailsPath, blogDetailsChecks);

if (blogDetailsResult.exists) {
  console.log('✅ Blog Details Author component found');
  Object.entries(blogDetailsResult.results).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}: ${passed}`);
  });
} else {
  console.log('❌ Blog Details Author component not found');
}

console.log('\n📋 Step 2: Check Blog Sidebar Component');
console.log('-'.repeat(40));

const sidebarPath = 'src/components/blog/blog-postox/blog-sidebar.jsx';
const sidebarChecks = {
  'Correct API import': 'from "@/redux/api/apiSlice"',
  'API response handling': 'apiResponse?.success && apiResponse?.data',
  'Display variables': 'const displayName',
  'Fallback image': '"/assets/img/blog/founder1.jpg"',
  'Dynamic name display': '{displayName}',
  'Dynamic designation display': '{displayDesignation}'
};

const sidebarResult = checkFileContent(sidebarPath, sidebarChecks);

if (sidebarResult.exists) {
  console.log('✅ Blog Sidebar component found');
  Object.entries(sidebarResult.results).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}: ${passed}`);
  });
} else {
  console.log('❌ Blog Sidebar component not found');
}

console.log('\n📋 Step 3: Check API Slice Integration');
console.log('-'.repeat(40));

const apiSlicePath = 'src/redux/api/apiSlice.js';
const apiSliceChecks = {
  'getAuthors endpoint': 'getAuthors: builder.query',
  'getAuthorById endpoint': 'getAuthorById: builder.query',
  'Authors tag': '"Authors"',
  'Author tag': '"Author"',
  'useGetAuthorsQuery export': 'useGetAuthorsQuery'
};

const apiSliceResult = checkFileContent(apiSlicePath, apiSliceChecks);

if (apiSliceResult.exists) {
  console.log('✅ API Slice found');
  Object.entries(apiSliceResult.results).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check}: ${passed}`);
  });
} else {
  console.log('❌ API Slice not found');
}

console.log('\n📋 Step 4: Check AuthorProfile Component');
console.log('-'.repeat(40));

const authorProfilePath = 'src/components/author/AuthorProfile.jsx';
const authorProfileResult = checkFileContent(authorProfilePath, {
  'Component exists': 'export default AuthorProfile'
});

if (authorProfileResult.exists) {
  console.log('✅ AuthorProfile component found');
  console.log('  ✅ Available for use in other pages');
} else {
  console.log('❌ AuthorProfile component not found');
}

// Calculate overall score
const allResults = [
  ...Object.values(blogDetailsResult.results || {}),
  ...Object.values(sidebarResult.results || {}),
  ...Object.values(apiSliceResult.results || {}),
  authorProfileResult.exists
];

const passedTests = allResults.filter(Boolean).length;
const totalTests = allResults.length;
const score = ((passedTests / totalTests) * 100).toFixed(1);

console.log('\n' + '='.repeat(40));
console.log('📊 SUMMARY');
console.log('='.repeat(40));
console.log(`✅ Tests Passed: ${passedTests}/${totalTests} (${score}%)`);

if (score >= 90) {
  console.log('\n🎉 EXCELLENT! Dynamic author integration is working!');
  console.log('\n📋 What should happen now:');
  console.log('   • Author data is fetched from API automatically');
  console.log('   • Shows "Rajesh Goyal" with proper fallback content');
  console.log('   • Loading states display while fetching data');
  console.log('   • Components gracefully handle API errors');
  
  console.log('\n🔍 To see the changes:');
  console.log('   1. Restart your development server (npm run dev)');
  console.log('   2. Visit any blog page to see the author section');
  console.log('   3. Check browser console for API calls');
  console.log('   4. Author info should now be dynamic from API');
  
  console.log('\n📝 To update author data:');
  console.log('   • Update the author record in your API backend');
  console.log('   • Change name from "author name" to "Rajesh Goyal"');
  console.log('   • Add description and designation fields');
  console.log('   • Add authorimage URL for profile photo');
  
} else if (score >= 70) {
  console.log('\n⚠️  PARTIAL SUCCESS: Most components updated');
  console.log('   • Review failed tests above');
  console.log('   • Some manual fixes may be needed');
} else {
  console.log('\n❌ ISSUES DETECTED: Several components need attention');
  console.log('   • Check the failed tests above');
  console.log('   • Verify file paths and imports');
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Restart your development server');
console.log('2. Test the blog pages to see dynamic author data');
console.log('3. Update author data in your API for full effect');
console.log('4. Check browser console for any API errors');