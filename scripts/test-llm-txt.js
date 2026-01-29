#!/usr/bin/env node

/**
 * LLM.txt validation and testing script
 * Usage: node scripts/test-llm-txt.js
 */

const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
function loadEnvVars() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envVars = {};
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value;
      }
    });
  }
  
  return envVars;
}

function testLlmTxt() {
  try {
    // Check if static file exists
    const llmTxtPath = path.join(process.cwd(), 'public', 'llm.txt');
    
    if (!fs.existsSync(llmTxtPath)) {
      return;
    }
    
    // Read and analyze content
    const content = fs.readFileSync(llmTxtPath, 'utf8');
    
    if (!content) {
      return;
    }
    const lines = content.split('\n');
    
    // Check for key sections
    const requiredSections = [
      'PURPOSE',
      'BRAND IDENTITY', 
      'SITE STRUCTURE',
      'PRODUCT INFORMATION',
      'CONTENT GUIDELINES',
      'PRIVACY & SECURITY'
    ];
    
    requiredSections.forEach(section => {
      const hasSection = content.includes(section);
      });
    
    // Check for fabric-specific content
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
      });
    
    // Check URL and site info
    const envVars = loadEnvVars();
    const siteUrl = envVars.NEXT_PUBLIC_SITE_URL || 'https://amrita-fashions.com';
    const hasCorrectUrl = content.includes(siteUrl);
    const currentYear = new Date().getFullYear();
    const hasCurrentYear = content.includes(currentYear.toString());
    // Check for common routes
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
      });
    
    // Content quality checks
    const wordCount = content.split(/\s+/).length;
    const sectionCount = (content.match(/===/g) || []).length / 2;
    const hasExamples = content.includes('Example:') || content.includes('example');
    const hasGuidelines = content.includes('guidelines') || content.includes('Guidelines');
    // Show first few lines for verification
    lines.slice(0, 10).forEach((line, index) => {
      });
    // Generate summary
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
    if (score >= 90) {
      } else if (score >= 75) {
      } else if (score >= 50) {
      } else {
      }
    
    // Live URL info
    } catch (error) {
    }
}

// Run the test
testLlmTxt();