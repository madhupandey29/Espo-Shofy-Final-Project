#!/usr/bin/env node

g, '.*')
    .replace(/\?/g, '\\?')
    .replace(/\+/g, '\\+');
  
  const regex = new RegExp('^' + regexPattern);
  return regex.test(url);
}

// Run the test
testRobotsTxt();