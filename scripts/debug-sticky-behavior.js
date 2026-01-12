#!/usr/bin/env node

/**
 * Debug script to help verify sticky filter behavior
 * Run this in browser console to check if sticky is working
 */

console.log('🔍 Sticky Filter Debug Script');
console.log('Copy and paste this code into your browser console on the shop page:\n');

const debugCode = `
// 🔍 Sticky Filter Debug Script
console.log('🔍 Debugging Sticky Filter...');

// Check if elements exist
const sidebar = document.querySelector('.sticky-filter');
const shopArea = document.querySelector('.tp-shop-area');
const header = document.querySelector('.tp-header-area') || document.querySelector('.tp-header-style-primary');

console.log('📋 Element Check:');
console.log('  Sidebar (.sticky-filter):', !!sidebar);
console.log('  Shop Area (.tp-shop-area):', !!shopArea);
console.log('  Header:', !!header);

if (!sidebar) {
  console.error('❌ Sidebar not found! Check if .sticky-filter class exists');
  return;
}

// Check CSS properties
const sidebarStyles = window.getComputedStyle(sidebar);
console.log('\\n🎨 CSS Properties:');
console.log('  Position:', sidebarStyles.position);
console.log('  Top:', sidebarStyles.top);
console.log('  Max-height:', sidebarStyles.maxHeight);
console.log('  Z-index:', sidebarStyles.zIndex);
console.log('  Display:', sidebarStyles.display);

// Check custom properties
const rootStyles = window.getComputedStyle(document.documentElement);
const headerHeight = rootStyles.getPropertyValue('--tp-header-height');
console.log('\\n🔧 Custom Properties:');
console.log('  --tp-header-height:', headerHeight);

// Check actual header height
if (header) {
  const headerRect = header.getBoundingClientRect();
  console.log('\\n📏 Header Measurements:');
  console.log('  Header height:', headerRect.height + 'px');
  console.log('  Header top:', headerRect.top + 'px');
  console.log('  Header bottom:', headerRect.bottom + 'px');
}

// Check sidebar position
const sidebarRect = sidebar.getBoundingClientRect();
console.log('\\n📏 Sidebar Measurements:');
console.log('  Sidebar top:', sidebarRect.top + 'px');
console.log('  Sidebar height:', sidebarRect.height + 'px');
console.log('  Viewport height:', window.innerHeight + 'px');

// Check parent container
const sidebarParent = sidebar.parentElement;
const parentStyles = window.getComputedStyle(sidebarParent);
console.log('\\n👨‍👩‍👧‍👦 Parent Container:');
console.log('  Parent class:', sidebarParent.className);
console.log('  Parent position:', parentStyles.position);
console.log('  Parent display:', parentStyles.display);

// Test sticky behavior
console.log('\\n🧪 Sticky Test:');
const expectedStickyTop = (header ? header.getBoundingClientRect().height : 88) + 20;
console.log('  Expected sticky top:', expectedStickyTop + 'px');
console.log('  Current sidebar top:', sidebarRect.top + 'px');

if (sidebarStyles.position === 'sticky') {
  console.log('  ✅ Position is sticky');
  if (sidebarRect.top <= expectedStickyTop + 10) {
    console.log('  ✅ Sidebar appears to be in sticky position');
  } else {
    console.log('  ⚠️ Sidebar might not be sticky yet (scroll down to test)');
  }
} else {
  console.log('  ❌ Position is not sticky:', sidebarStyles.position);
}

// Scroll test
console.log('\\n📜 Scroll Test Instructions:');
console.log('  1. Scroll down the page slowly');
console.log('  2. Watch the sidebar - it should stick to the top');
console.log('  3. The sidebar should remain visible while scrolling through products');
console.log('  4. Run this script again after scrolling to see updated measurements');

// Live scroll monitoring
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) return;
  scrollTimeout = setTimeout(() => {
    const newSidebarRect = sidebar.getBoundingClientRect();
    console.log('📜 Scroll Update - Sidebar top:', newSidebarRect.top + 'px');
    scrollTimeout = null;
  }, 100);
}, { passive: true });

console.log('\\n✅ Debug complete! Scroll monitoring is now active.');
`;

console.log(debugCode);
console.log('\n📋 Instructions:');
console.log('1. Open your shop page in the browser');
console.log('2. Open browser developer tools (F12)');
console.log('3. Go to the Console tab');
console.log('4. Copy and paste the code above');
console.log('5. Press Enter to run the debug script');
console.log('6. Check the console output for sticky behavior analysis');
console.log('\n🎯 What to look for:');
console.log('• Position should be "sticky"');
console.log('• Sidebar should stick when scrolling down');
console.log('• Top position should be around header height + 20px');
console.log('• Scroll monitoring will show position updates');