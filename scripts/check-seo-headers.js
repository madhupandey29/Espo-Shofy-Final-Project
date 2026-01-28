#!/usr/bin/env node

/**
 * SEO Headers Checker
 * Checks for proper H1, H2, H3 usage across the site
 * Usage: node scripts/check-seo-headers.js
 */

const fs = require('fs');
const path = require('path');

function checkSEOHeaders() {
  console.log('🔍 Checking SEO headers across your site...\n');
  
  const results = [];
  
  // Define pages to check
  const pagesToCheck = [
    { file: 'src/app/page.jsx', name: 'Homepage', url: '/' },
    { file: 'src/app/shop/page.jsx', name: 'Shop Page', url: '/shop' },
    { file: 'src/app/blog/page.jsx', name: 'Blog Page', url: '/blog' },
    { file: 'src/app/contact/page.jsx', name: 'Contact Page', url: '/contact' },
    { file: 'src/components/banner/fashion-banner.jsx', name: 'Homepage Banner', url: '/' },
  ];
  
  // Check each page
  pagesToCheck.forEach(page => {
    const filePath = path.join(process.cwd(), page.file);
    
    if (!fs.existsSync(filePath)) {
      results.push({
        ...page,
        status: 'missing',
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        issues: ['File not found']
      });
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count header tags
    const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
    const h2Count = (content.match(/<h2[^>]*>/g) || []).length;
    const h3Count = (content.match(/<h3[^>]*>/g) || []).length;
    
    // Check for issues
    const issues = [];
    
    if (h1Count === 0) {
      issues.push('No H1 tag found');
    } else if (h1Count > 1) {
      issues.push(`Multiple H1 tags found (${h1Count})`);
    }
    
    if (h1Count === 1 && h2Count === 0 && content.length > 1000) {
      issues.push('No H2 tags found (recommended for long content)');
    }
    
    // Check for SEO-friendly content in H1
    if (h1Count > 0) {
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
      if (h1Match) {
        const h1Content = h1Match[1].replace(/<[^>]*>/g, '').trim();
        
        // Check for fabric-related keywords
        const fabricKeywords = ['fabric', 'textile', 'cotton', 'ecatalogue', 'amrita', 'quality', 'premium'];
        const hasKeywords = fabricKeywords.some(keyword => 
          h1Content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (!hasKeywords && page.name === 'Homepage') {
          issues.push('H1 should include fabric/business keywords');
        }
        
        if (h1Content.length < 10) {
          issues.push('H1 content too short');
        } else if (h1Content.length > 100) {
          issues.push('H1 content too long');
        }
      }
    }
    
    results.push({
      ...page,
      status: 'checked',
      h1Count,
      h2Count,
      h3Count,
      issues: issues.length > 0 ? issues : ['No issues found']
    });
  });
  
  // Display results
  console.log('📊 SEO Headers Analysis Results:\n');
  console.log('─'.repeat(80));
  
  results.forEach(result => {
    const statusIcon = result.status === 'missing' ? '❌' : 
                      result.issues[0] === 'No issues found' ? '✅' : '⚠️';
    
    console.log(`${statusIcon} ${result.name} (${result.url})`);
    console.log(`   File: ${result.file}`);
    
    if (result.status !== 'missing') {
      console.log(`   Headers: H1(${result.h1Count}) H2(${result.h2Count}) H3(${result.h3Count})`);
    }
    
    console.log(`   Issues: ${result.issues.join(', ')}`);
    console.log('');
  });
  
  // Summary
  const totalPages = results.length;
  const pagesWithH1 = results.filter(r => r.h1Count > 0).length;
  const pagesWithIssues = results.filter(r => r.issues[0] !== 'No issues found').length;
  const pagesWithMultipleH1 = results.filter(r => r.h1Count > 1).length;
  
  console.log('─'.repeat(80));
  console.log('📈 Summary:');
  console.log(`Total pages checked: ${totalPages}`);
  console.log(`Pages with H1 tags: ${pagesWithH1}/${totalPages}`);
  console.log(`Pages with issues: ${pagesWithIssues}/${totalPages}`);
  console.log(`Pages with multiple H1s: ${pagesWithMultipleH1}/${totalPages}`);
  
  const score = Math.round(((totalPages - pagesWithIssues) / totalPages) * 100);
  console.log(`\n🎯 SEO Score: ${score}%`);
  
  if (score >= 90) {
    console.log('🏆 Excellent! Your header structure is SEO-optimized.');
  } else if (score >= 75) {
    console.log('👍 Good! Minor improvements needed.');
  } else if (score >= 50) {
    console.log('⚠️ Fair. Several header issues need attention.');
  } else {
    console.log('❌ Poor. Header structure needs significant improvement.');
  }
  
  // Recommendations
  console.log('\n💡 SEO Recommendations:');
  console.log('• Each page should have exactly one H1 tag');
  console.log('• H1 should include relevant keywords for your fabric business');
  console.log('• Use H2 tags for main sections, H3 for subsections');
  console.log('• Keep H1 content between 10-60 characters when possible');
  console.log('• Include "fabric", "textile", "eCatalogue" in homepage H1');
}

// Run the checker
checkSEOHeaders();