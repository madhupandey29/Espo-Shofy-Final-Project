#!/usr/bin/env node

/**
 * LLM.txt validation and testing script
 * Usage: node scripts/test-llm-txt.js
 */

const fs = require('fs');
const path = require('path');

function testLlmTxt() {
  console.log('🤖 Testing llm.txt file...\n');
  
  try {
    // Check if file exists
    const llmTxtPath = path.join(process.cwd(), 'public', 'llm.txt');
    
    if (!fs.existsSync(llmTxtPath)) {
      console.log('❌ llm.txt file not found at public/llm.txt');
      return;
    }
    
    // Read and analyze content
    const content = fs.readFileSync(llmTxtPath, 'utf8');
    const lines = content.split('\n');
    
    console.log('✅ File found and readable');
    console.log(`📄 File size: ${content.length} characters`);
    console.log(`📝 Line count: ${lines.length} lines\n`);
    
    // Check for key sections
    const requiredSections = [
      'PURPOSE',
      'BRAND IDENTITY', 
      'SITE STRUCTURE',
      'PRODUCT INFORMATION',
      'CONTENT GUIDELINES',
      'PRIVACY & SECURITY'
    ];
    
    console.log('🔍 Checking required sections:');
    requiredSections.forEach(section => {
      const hasSection = content.includes(section);
      console.log(`${hasSection ? '✅' : '❌'} ${section}`);
    });
    
    // Check for fabric-specific content
    console.log('\n🧵 Checking fabric-specific content:');
    const fabricTerms = [
      'cotton',
      'GSM',
      'mercerized',
      'fabric',
      'textile',
      'Nokia',
      'Majestica'
    ];
    
    fabricTerms.forEach(term => {
      const hasTerm = content.toLowerCase().includes(term.toLowerCase());
      console.log(`${hasTerm ? '✅' : '❌'} Contains "${term}"`);
    });
    
    // Check URL and site info
    console.log('\n🌐 Checking site information:');
    const siteUrl = 'espo-shofy-final-project.vercel.app';
    const hasCorrectUrl = content.includes(siteUrl);
    console.log(`${hasCorrectUrl ? '✅' : '❌'} Correct site URL`);
    
    const currentYear = new Date().getFullYear();
    const hasCurrentYear = content.includes(currentYear.toString());
    console.log(`${hasCurrentYear ? '✅' : '❌'} Current year (${currentYear})`);
    
    // Check for common routes
    console.log('\n🗺️ Checking route documentation:');
    const routes = [
      '/shop',
      '/fabric/',
      '/blog',
      '/contact',
      '/cart',
      '/wishlist'
    ];
    
    routes.forEach(route => {
      const hasRoute = content.includes(route);
      console.log(`${hasRoute ? '✅' : '❌'} Route: ${route}`);
    });
    
    // Content quality checks
    console.log('\n📊 Content quality analysis:');
    
    const wordCount = content.split(/\s+/).length;
    console.log(`📝 Word count: ${wordCount} words`);
    
    const sectionCount = (content.match(/===/g) || []).length / 2;
    console.log(`📑 Section count: ${sectionCount} sections`);
    
    const hasExamples = content.includes('Example:') || content.includes('example');
    console.log(`${hasExamples ? '✅' : '❌'} Contains examples`);
    
    const hasGuidelines = content.includes('guidelines') || content.includes('Guidelines');
    console.log(`${hasGuidelines ? '✅' : '❌'} Contains guidelines`);
    
    // Show first few lines for verification
    console.log('\n📋 File preview (first 10 lines):');
    console.log('─'.repeat(50));
    lines.slice(0, 10).forEach((line, index) => {
      console.log(`${(index + 1).toString().padStart(2)}: ${line}`);
    });
    console.log('─'.repeat(50));
    
    // Generate summary
    console.log('\n📈 Summary:');
    const totalChecks = requiredSections.length + fabricTerms.length + routes.length + 4; // +4 for URL, year, examples, guidelines
    const passedChecks = [
      ...requiredSections.map(s => content.includes(s)),
      ...fabricTerms.map(t => content.toLowerCase().includes(t.toLowerCase())),
      ...routes.map(r => content.includes(r)),
      hasCorrectUrl,
      hasCurrentYear,
      hasExamples,
      hasGuidelines
    ].filter(Boolean).length;
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`🎯 Quality Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`);
    
    if (score >= 90) {
      console.log('🏆 Excellent! Your llm.txt is comprehensive and well-structured.');
    } else if (score >= 75) {
      console.log('👍 Good! Consider adding missing sections for better AI understanding.');
    } else if (score >= 50) {
      console.log('⚠️ Fair. Several important sections are missing.');
    } else {
      console.log('❌ Needs improvement. Many key sections are missing.');
    }
    
    // Live URL info
    console.log(`\n🌐 Your llm.txt is available at:`);
    console.log(`   https://espo-shofy-final-project.vercel.app/llm.txt`);
    
    console.log(`\n💡 Test it by asking AI assistants about your site!`);
    
  } catch (error) {
    console.error('❌ Error testing llm.txt:', error.message);
  }
}

// Run the test
testLlmTxt();