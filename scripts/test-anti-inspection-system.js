#!/usr/bin/env node

/**
 * Anti-Inspection Protection System Validation Script
 * Tests the complete environment-aware protection system
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️  ANTI-INSPECTION PROTECTION SYSTEM VALIDATION');
console.log('=' .repeat(60));

let totalTests = 0;
let passedTests = 0;

function test(description, condition) {
  totalTests++;
  const status = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${description}`);
  if (condition) passedTests++;
  return condition;
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Test 1: Check if all protection files exist
console.log('\n📁 FILE EXISTENCE TESTS');
console.log('-'.repeat(30));

test('AntiInspection component exists', checkFileExists('src/components/security/AntiInspection.jsx'));
test('AdvancedProtection component exists', checkFileExists('src/components/security/AdvancedProtection.jsx'));
test('Security protection CSS exists', checkFileExists('src/styles/security-protection.css'));
test('Layout file exists', checkFileExists('src/app/layout.jsx'));

// Test 2: Check AntiInspection component implementation
console.log('\n🔒 ANTI-INSPECTION COMPONENT TESTS');
console.log('-'.repeat(40));

const antiInspectionContent = readFileContent('src/components/security/AntiInspection.jsx');
if (antiInspectionContent) {
  test('Environment check implemented', antiInspectionContent.includes('process.env.NODE_ENV !== \'production\''));
  test('Development mode logging present', antiInspectionContent.includes('Development Mode: Anti-inspection protection is DISABLED'));
  test('Production mode logging present', antiInspectionContent.includes('Production Mode: Anti-inspection protection is ACTIVE'));
  test('Right-click protection implemented', antiInspectionContent.includes('disableRightClick'));
  test('Dev tools shortcuts disabled', antiInspectionContent.includes('disableDevTools'));
  test('Text selection disabled', antiInspectionContent.includes('disableSelection'));
  test('Dev tools detection implemented', antiInspectionContent.includes('detectDevTools'));
  test('Image drag protection implemented', antiInspectionContent.includes('disableImageDrag'));
  test('Console warning implemented', antiInspectionContent.includes('consoleWarning'));
  test('Security warning overlay implemented', antiInspectionContent.includes('showWarning'));
} else {
  console.log('❌ Could not read AntiInspection component');
}

// Test 3: Check AdvancedProtection component implementation
console.log('\n🛡️  ADVANCED PROTECTION COMPONENT TESTS');
console.log('-'.repeat(45));

const advancedProtectionContent = readFileContent('src/components/security/AdvancedProtection.jsx');
if (advancedProtectionContent) {
  test('Environment check implemented', advancedProtectionContent.includes('process.env.NODE_ENV !== \'production\''));
  test('Development mode logging present', advancedProtectionContent.includes('Development Mode: Advanced protection is DISABLED'));
  test('Production mode logging present', advancedProtectionContent.includes('Production Mode: Advanced protection is ACTIVE'));
  test('Console obfuscation implemented', advancedProtectionContent.includes('obfuscateConsole'));
  test('Debugging detection implemented', advancedProtectionContent.includes('detectDebugging'));
  test('Dev tools detection handler implemented', advancedProtectionContent.includes('handleDevToolsDetection'));
  test('Security alert system implemented', advancedProtectionContent.includes('showSecurityAlert'));
  test('Inspection methods disabled', advancedProtectionContent.includes('disableInspectionMethods'));
  test('Image protection implemented', advancedProtectionContent.includes('protectImages'));
  test('Periodic detection implemented', advancedProtectionContent.includes('setInterval(detectDebugging'));
} else {
  console.log('❌ Could not read AdvancedProtection component');
}

// Test 4: Check CSS protection rules
console.log('\n🎨 CSS PROTECTION RULES TESTS');
console.log('-'.repeat(35));

const cssContent = readFileContent('src/styles/security-protection.css');
if (cssContent) {
  test('Development mode rules present', cssContent.includes('body[data-env="development"]'));
  test('Production mode rules present', cssContent.includes('body[data-env="production"]'));
  test('Text selection disabled in production', cssContent.includes('user-select: none'));
  test('Text selection enabled in development', cssContent.includes('user-select: text !important'));
  test('Image drag disabled in production', cssContent.includes('-webkit-user-drag: none'));
  test('Image drag enabled in development', cssContent.includes('-webkit-user-drag: auto !important'));
  test('Print protection implemented', cssContent.includes('@media print'));
  test('Dev tools detection CSS implemented', cssContent.includes('dev-tools-warning'));
  test('Fabric-specific protection present', cssContent.includes('.fabric-image-container'));
  test('Watermark overlay implemented', cssContent.includes('eCatalogue'));
  test('Development mode indicator present', cssContent.includes('Development Mode - Inspection Enabled'));
  test('Production mode indicator present', cssContent.includes('Protected Site'));
} else {
  console.log('❌ Could not read CSS protection file');
}

// Test 5: Check layout integration
console.log('\n🏗️  LAYOUT INTEGRATION TESTS');
console.log('-'.repeat(35));

const layoutContent = readFileContent('src/app/layout.jsx');
if (layoutContent) {
  test('Environment detection script present', layoutContent.includes('environment-detection'));
  test('Data-env attribute setting implemented', layoutContent.includes('setAttribute(\'data-env\''));
  test('AntiInspection component imported', layoutContent.includes('import AntiInspection'));
  test('AdvancedProtection component imported', layoutContent.includes('import AdvancedProtection'));
  test('Security CSS imported', layoutContent.includes('security-protection.css'));
  test('AntiInspection component rendered', layoutContent.includes('<AntiInspection />'));
  test('AdvancedProtection component rendered', layoutContent.includes('<AdvancedProtection />'));
  test('Environment logging implemented', layoutContent.includes('Environment Detection'));
} else {
  console.log('❌ Could not read layout file');
}

// Test 6: Check environment-specific behavior
console.log('\n🌍 ENVIRONMENT-SPECIFIC BEHAVIOR TESTS');
console.log('-'.repeat(45));

// Check if NODE_ENV handling is correct
test('Production environment check syntax correct', 
  antiInspectionContent && antiInspectionContent.includes('process.env.NODE_ENV !== \'production\''));

test('Environment variable interpolation in layout', 
  layoutContent && layoutContent.includes('${process.env.NODE_ENV}'));

// Test 7: Security feature completeness
console.log('\n🔐 SECURITY FEATURE COMPLETENESS TESTS');
console.log('-'.repeat(45));

const hasAllBasicFeatures = antiInspectionContent && [
  'contextmenu', // Right-click protection
  'keydown', // Keyboard shortcuts
  'selectstart', // Text selection
  'dragstart', // Drag protection
  'F12', // Dev tools key
  'Ctrl+Shift+I', // Inspector shortcut
  'Ctrl+U', // View source
].every(feature => antiInspectionContent.includes(feature));

test('All basic protection features implemented', hasAllBasicFeatures);

const hasAllAdvancedFeatures = advancedProtectionContent && [
  'console.log = () => {}', // Console obfuscation
  'debugger', // Debugger detection
  'outerHeight - window.innerHeight', // Window size detection
  'blur(5px)', // Content blurring
  'setInterval', // Periodic detection
].every(feature => advancedProtectionContent.includes(feature));

test('All advanced protection features implemented', hasAllAdvancedFeatures);

// Test 8: Fabric e-commerce specific protections
console.log('\n🧵 FABRIC E-COMMERCE SPECIFIC TESTS');
console.log('-'.repeat(40));

const hasFabricProtections = cssContent && [
  '.product-image',
  '.fabric-sample',
  '.product-details',
  '.price-info',
  '.fabric-image-container',
  'eCatalogue', // Watermark
].every(selector => cssContent.includes(selector));

test('Fabric-specific CSS protections implemented', hasFabricProtections);

const hasFabricMessages = antiInspectionContent && 
  antiInspectionContent.includes('fabric e-commerce site is protected');

test('Fabric e-commerce specific messaging present', hasFabricMessages);

// Test 9: User experience considerations
console.log('\n👤 USER EXPERIENCE TESTS');
console.log('-'.repeat(30));

test('Input fields remain selectable in production', 
  cssContent && cssContent.includes('input') && cssContent.includes('user-select: text !important'));

test('Textarea remains selectable in production', 
  cssContent && cssContent.includes('textarea') && cssContent.includes('user-select: text !important'));

test('Interactive images have pointer events', 
  cssContent && cssContent.includes('.interactive img') && cssContent.includes('pointer-events: auto'));

test('Warning messages are user-friendly', 
  antiInspectionContent && antiInspectionContent.includes('Continue Shopping'));

// Test 10: Development workflow preservation
console.log('\n🔧 DEVELOPMENT WORKFLOW TESTS');
console.log('-'.repeat(35));

test('Development mode allows text selection', 
  cssContent && cssContent.includes('body[data-env="development"] *') && 
  cssContent.includes('user-select: text !important'));

test('Development mode allows image dragging', 
  cssContent && cssContent.includes('body[data-env="development"] img') && 
  cssContent.includes('user-drag: auto !important'));

test('Development mode shows indicator', 
  cssContent && cssContent.includes('Development Mode - Inspection Enabled'));

test('Development mode console logging present', 
  antiInspectionContent && advancedProtectionContent && 
  antiInspectionContent.includes('You can freely use developer tools') &&
  advancedProtectionContent.includes('Full developer tools access available'));

// Final Results
console.log('\n' + '='.repeat(60));
console.log('📊 FINAL RESULTS');
console.log('='.repeat(60));

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`✅ Tests Passed: ${passedTests}/${totalTests} (${successRate}%)`);

if (passedTests === totalTests) {
  console.log('\n🎉 EXCELLENT! Anti-inspection protection system is fully implemented!');
  console.log('\n📋 SYSTEM FEATURES:');
  console.log('   🔒 Environment-aware protection (dev/prod)');
  console.log('   🚫 Right-click and keyboard shortcut blocking');
  console.log('   👁️  Developer tools detection and warnings');
  console.log('   🖼️  Image protection and watermarking');
  console.log('   📱 Mobile-specific protections');
  console.log('   🧵 Fabric e-commerce specific safeguards');
  console.log('   👤 User-friendly warning messages');
  console.log('   🔧 Full development mode functionality');
  
  console.log('\n🚀 DEPLOYMENT INSTRUCTIONS:');
  console.log('   1. In development: Full inspection capabilities available');
  console.log('   2. In production: Complete protection system activates');
  console.log('   3. Environment detection is automatic via NODE_ENV');
  console.log('   4. CSS rules adapt based on data-env attribute');
  
} else if (successRate >= 90) {
  console.log('\n✅ GOOD! System is mostly complete with minor issues.');
  console.log('   Review failed tests above for final improvements.');
} else if (successRate >= 70) {
  console.log('\n⚠️  PARTIAL! System has core functionality but needs work.');
  console.log('   Address failed tests to improve protection coverage.');
} else {
  console.log('\n❌ INCOMPLETE! System needs significant development.');
  console.log('   Many core features are missing or incorrectly implemented.');
}

console.log('\n🔍 TESTING INSTRUCTIONS:');
console.log('   • Development: npm run dev (protection disabled)');
console.log('   • Production: npm run build && npm start (protection active)');
console.log('   • Check browser console for environment detection logs');
console.log('   • Verify data-env attribute is set on body element');

console.log('\n📚 DOCUMENTATION:');
console.log('   • See docs/ANTI_INSPECTION_GUIDE.md for detailed usage');
console.log('   • CSS rules in src/styles/security-protection.css');
console.log('   • Components in src/components/security/');

process.exit(passedTests === totalTests ? 0 : 1);