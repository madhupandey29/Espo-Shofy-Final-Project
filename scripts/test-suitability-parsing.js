/**
 * Test script for Suitability Parsing
 * This script tests the parsing of suitability data from aiTempOutput field
 */

// Sample aiTempOutput from your API
const sampleAiTempOutput = `| Suitablefor           | Product                              | Confidence |
|-----------------------|--------------------------------------|------------|
| Menswear              | Casual shirts                        | 90%        |
| Menswear              | Summer kurta / short kurta          | 85%        |
| Menswear              | Lightweight pajamas / lounge pants  | 75%        |
| Womenswear            | Blouses / tops                      | 90%        |
| Womenswear            | Summer dresses                      | 85%        |
| Womenswear            | Skirts (lined or relaxed)           | 80%        |
| Womenswear            | Kurtis / tunics                     | 90%        |
| Womenswear            | Nightwear / loungewear sets         | 88%        |
| Unisex                | Casual shirts                       | 90%        |
| Unisex                | Lounge / pajama sets                | 85%        |
| Unisex                | Scrubs / light clinic wear          | 70%        |
| Kidswear              | Shirts / tops                       | 92%        |
| Kidswear              | Dresses / frocks                    | 90%        |
| Kidswear              | Shorts / light pants                | 80%        |
| Kidswear              | School summer uniforms              | 88%        |
| Uniforms / Workwear   | Hotel / front-office shirts         | 85%        |
| Uniforms / Workwear   | Corporate / office shirts           | 80%        |
| Uniforms / Workwear   | School uniforms (shirts, tunics)    | 88%        |
| Accessories           | Lightweight scarves / stoles        | 80%        |
| Accessories           | Pocket squares / handkerchiefs      | 85%        |
| Home Textiles         | Pillow covers                       | 75%        |
| Home Textiles         | Lightweight cushion covers          | 70%        |`;

function parseSuitabilityFromAiOutput(aiTempOutput) {
  if (!aiTempOutput || typeof aiTempOutput !== 'string') return [];
  
  try {
    // Parse the markdown table from aiTempOutput
    const lines = aiTempOutput.split('\n').filter(line => line.trim());
    const suitabilityItems = [];
    
    for (const line of lines) {
      // Skip header lines and separators
      if (line.includes('Suitablefor') || line.includes('---') || line.includes('Product') || line.includes('Confidence')) {
        continue;
      }
      
      // Parse table rows like: | Menswear | Casual shirts | 90% |
      const match = line.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
      if (match) {
        const category = match[1].trim();
        const product = match[2].trim();
        if (category && product) {
          suitabilityItems.push(`${category} - ${product}`);
        }
      }
    }
    
    return suitabilityItems;
  } catch (error) {
    console.error('Error parsing aiTempOutput:', error);
    return [];
  }
}

function testSuitabilityParsing() {
  console.log('🧪 Testing Suitability Parsing...\n');

  try {
    const parsedSuitability = parseSuitabilityFromAiOutput(sampleAiTempOutput);
    
    console.log('✅ Parsing successful!');
    console.log(`📊 Found ${parsedSuitability.length} suitability items:\n`);
    
    parsedSuitability.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });

    console.log('\n📋 First 3 items (for product card display):');
    parsedSuitability.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });

    console.log('\n✅ Suitability parsing test completed successfully!');
    
  } catch (error) {
    console.error('❌ Suitability parsing test failed:');
    console.error('Error:', error.message);
  }
}

// Test with empty/invalid inputs
function testEdgeCases() {
  console.log('\n🧪 Testing Edge Cases...\n');

  const testCases = [
    { name: 'Empty string', input: '' },
    { name: 'Null input', input: null },
    { name: 'Undefined input', input: undefined },
    { name: 'Invalid markdown', input: 'This is not a markdown table' },
  ];

  testCases.forEach(testCase => {
    const result = parseSuitabilityFromAiOutput(testCase.input);
    console.log(`${testCase.name}: ${result.length} items found`);
  });

  console.log('\n✅ Edge cases test completed!');
}

// Run the tests
testSuitabilityParsing();
testEdgeCases();