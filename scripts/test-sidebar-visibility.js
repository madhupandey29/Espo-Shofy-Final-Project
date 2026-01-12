#!/usr/bin/env node

/**
 * Test script to debug sidebar visibility issues
 * Run this in browser console to check sidebar rendering
 */

console.log('🔍 Sidebar Visibility Debug Script');
console.log('Copy and paste this code into your browser console on the shop page:\n');

const debugCode = `
// 🔍 Sidebar Visibility Debug Script
console.log('🔍 Debugging Sidebar Visibility...');

// Check if sidebar elements exist
const sidebar = document.querySelector('.sticky-filter');
const sidebarCol = document.querySelector('.shop-sidebar-col');
const sidebarAside = document.querySelector('aside.shop-sidebar-col');
const shopContentWrapper = document.querySelector('.shop-content-wrapper');

console.log('📋 Element Check:');
console.log('  Sidebar (.sticky-filter):', !!sidebar);
console.log('  Sidebar Column (.shop-sidebar-col):', !!sidebarCol);
console.log('  Sidebar Aside (aside.shop-sidebar-col):', !!sidebarAside);
console.log('  Shop Content Wrapper (.shop-content-wrapper):', !!shopContentWrapper);

// Check Bootstrap classes
if (sidebarAside) {
  const classes = sidebarAside.className;
  console.log('\\n🎨 Sidebar Classes:', classes);
  
  const computedStyle = window.getComputedStyle(sidebarAside);
  console.log('\\n📐 Computed Styles:');
  console.log('  Display:', computedStyle.display);
  console.log('  Visibility:', computedStyle.visibility);
  console.log('  Opacity:', computedStyle.opacity);
  console.log('  Width:', computedStyle.width);
  console.log('  Height:', computedStyle.height);
  console.log('  Position:', computedStyle.position);
  
  // Check if it's hidden by Bootstrap classes
  const isHidden = classes.includes('d-none');
  const isLgBlock = classes.includes('d-lg-block');
  const isMdBlock = classes.includes('d-md-block');
  
  console.log('\\n🔍 Bootstrap Visibility:');
  console.log('  Has d-none:', isHidden);
  console.log('  Has d-lg-block:', isLgBlock);
  console.log('  Has d-md-block:', isMdBlock);
  
  // Check viewport size
  const viewportWidth = window.innerWidth;
  console.log('\\n📱 Viewport:');
  console.log('  Width:', viewportWidth + 'px');
  console.log('  Bootstrap breakpoint:');
  if (viewportWidth >= 1200) console.log('    XL (≥1200px)');
  else if (viewportWidth >= 992) console.log('    LG (≥992px)');
  else if (viewportWidth >= 768) console.log('    MD (≥768px)');
  else if (viewportWidth >= 576) console.log('    SM (≥576px)');
  else console.log('    XS (<576px)');
  
  // Determine if sidebar should be visible
  let shouldBeVisible = false;
  if (isLgBlock && viewportWidth >= 992) shouldBeVisible = true;
  if (isMdBlock && viewportWidth >= 768) shouldBeVisible = true;
  
  console.log('\\n🎯 Visibility Analysis:');
  console.log('  Should be visible:', shouldBeVisible);
  console.log('  Actually visible:', computedStyle.display !== 'none');
  
  if (shouldBeVisible && computedStyle.display === 'none') {
    console.log('  ❌ ISSUE: Sidebar should be visible but is hidden!');
  } else if (!shouldBeVisible) {
    console.log('  ℹ️ Sidebar is hidden due to responsive breakpoint');
  } else {
    console.log('  ✅ Sidebar visibility is correct');
  }
} else {
  console.log('\\n❌ CRITICAL: Sidebar element not found in DOM!');
  console.log('This means the sidebar is not being rendered at all.');
  
  // Check if the condition is failing
  console.log('\\n🔍 Checking render conditions...');
  console.log('Check browser console for ShopContent logs with shop_right and hidden_sidebar values');
}

// Check if filters component exists
const filtersComponent = document.querySelector('.myntraSidebar');
console.log('\\n🎛️ Filters Component:');
console.log('  EnhancedShopSidebarFilters (.myntraSidebar):', !!filtersComponent);

if (filtersComponent) {
  const filtersStyle = window.getComputedStyle(filtersComponent);
  console.log('  Filters display:', filtersStyle.display);
  console.log('  Filters width:', filtersStyle.width);
  console.log('  Filters height:', filtersStyle.height);
}

// Check layout structure
console.log('\\n🏗️ Layout Structure:');
const container = document.querySelector('.tp-shop-area .container');
const row = document.querySelector('.shop-content-wrapper');
const mainCol = document.querySelector('.shop-main-col');

console.log('  Container:', !!container);
console.log('  Row (.shop-content-wrapper):', !!row);
console.log('  Main Column (.shop-main-col):', !!mainCol);

if (row) {
  const rowStyle = window.getComputedStyle(row);
  console.log('  Row display:', rowStyle.display);
  console.log('  Row flex-direction:', rowStyle.flexDirection);
}

console.log('\\n✅ Debug complete!');
`;

console.log(debugCode);
console.log('\n📋 Instructions:');
console.log('1. Open your shop page in the browser');
console.log('2. Open browser developer tools (F12)');
console.log('3. Go to the Console tab');
console.log('4. Copy and paste the code above');
console.log('5. Press Enter to run the debug script');
console.log('\n🎯 What to look for:');
console.log('• Check if sidebar elements exist in DOM');
console.log('• Verify Bootstrap responsive classes');
console.log('• Check viewport width vs breakpoints');
console.log('• Look for ShopContent console logs with props');
console.log('• Verify CSS display properties');