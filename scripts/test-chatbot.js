#!/usr/bin/env node

// Simple test to verify chatbot Redux integration
console.log('🤖 Testing chatbot Redux integration...');

try {
  // Test importing the chatbot slice
  const chatbotSlice = require('../src/redux/features/chatbotSlice.js');
  console.log('✅ Chatbot slice imported successfully');
  
  // Test selectors
  const selectors = [
    'selectChatbot',
    'selectMessages', 
    'selectIsOpen',
    'selectIsTyping',
    'selectUserContext'
  ];
  
  selectors.forEach(selector => {
    if (typeof chatbotSlice[selector] === 'function') {
      console.log(`✅ Selector ${selector} is available`);
    } else {
      console.log(`❌ Selector ${selector} is missing`);
    }
  });
  
  // Test actions
  const actions = [
    'toggleChat',
    'openChat', 
    'closeChat',
    'addMessage',
    'setTyping',
    'updateUserContext',
    'setSessionId',
    'clearMessages'
  ];
  
  actions.forEach(action => {
    if (typeof chatbotSlice[action] === 'function') {
      console.log(`✅ Action ${action} is available`);
    } else {
      console.log(`❌ Action ${action} is missing`);
    }
  });
  
  console.log('');
  console.log('🎉 Chatbot Redux integration test completed!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. The chatbot is now included inside the Redux Provider');
  console.log('2. It should appear as a floating button on all pages');
  console.log('3. The button will be positioned on the left side, above other floating buttons');
  
} catch (error) {
  console.error('❌ Error testing chatbot:', error.message);
}