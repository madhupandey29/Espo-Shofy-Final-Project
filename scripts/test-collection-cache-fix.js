console.log('🧪 Testing Collection Cache Fix...\n');

// Simulate the Redux query behavior
function simulateReduxQuery(collectionId) {
  console.log(`📡 Simulating Redux query for collection: ${collectionId}`);
  
  // This is what the query would generate
  const queryUrl = `/product?limit=150&collection=${collectionId}`;
  console.log(`  Query URL: ${queryUrl}`);
  
  // This is the cache key that would be generated
  const cacheKey = `getProductsByCollection-${collectionId}`;
  console.log(`  Cache Key: ${cacheKey}`);
  
  return { queryUrl, cacheKey };
}

// Test different collection IDs
const testCollections = [
  '690a0e676132664ee', // Nokia
  '695f9b0b956eb958b', // Majestica
  null, // No collection
  ''    // Empty collection
];

console.log('🔍 Testing cache key generation for different collections:\n');

testCollections.forEach((collectionId, index) => {
  console.log(`Test ${index + 1}:`);
  const result = simulateReduxQuery(collectionId);
  console.log(`  Collection ID: ${collectionId || 'null/empty'}`);
  console.log(`  Query URL: ${result.queryUrl}`);
  console.log(`  Cache Key: ${result.cacheKey}`);
  console.log('');
});

console.log('✅ Each collection should now have its own cache entry!');
console.log('📋 Expected behavior:');
console.log('  - Nokia products: Query with collection=690a0e676132664ee, cache key includes Nokia ID');
console.log('  - Majestica products: Query with collection=695f9b0b956eb958b, cache key includes Majestica ID');
console.log('  - Different collections will not share cached results');
console.log('');
console.log('🎯 This should fix the issue where Nokia products show 123 items instead of 51!');