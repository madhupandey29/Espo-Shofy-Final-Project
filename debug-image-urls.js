// Debug script to check image URLs and identify where hash characters are coming from

const API_BASE = 'https://espobackend.vercel.app/api';

async function debugImageUrls() {
  try {
    console.log('🔍 Debugging image URLs...');
    
    // Test the specific product that has the hash issue
    const response = await fetch(`${API_BASE}/product/fieldname/productslug/nokia-602-plain-100cotton-125gsm-mercerized-butter-yellow`);
    const data = await response.json();
    
    console.log('📊 API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data && data.data.length > 0) {
      const product = data.data[0];
      console.log('\n🖼️ Image URL Analysis:');
      console.log('image1CloudUrl:', product.image1CloudUrl);
      console.log('image2CloudUrl:', product.image2CloudUrl);
      console.log('image3CloudUrl:', product.image3CloudUrl);
      console.log('imageCloudUrl:', product.imageCloudUrl);
      console.log('cloudUrl:', product.cloudUrl);
      console.log('img:', product.img);
      console.log('image:', product.image);
      console.log('image1:', product.image1);
      console.log('image2:', product.image2);
      console.log('image3:', product.image3);
      
      // Check if any URLs contain hash characters
      const imageFields = [
        'image1CloudUrl', 'image2CloudUrl', 'image3CloudUrl', 
        'imageCloudUrl', 'cloudUrl', 'img', 'image', 
        'image1', 'image2', 'image3'
      ];
      
      console.log('\n🔍 Hash Character Analysis:');
      imageFields.forEach(field => {
        const url = product[field];
        if (url && typeof url === 'string') {
          const hasHash = url.includes('#');
          const endsWithHash = url.endsWith('#');
          console.log(`${field}: ${hasHash ? '❌ HAS HASH' : '✅ NO HASH'} ${endsWithHash ? '(ENDS WITH #)' : ''}`);
          if (hasHash) {
            console.log(`  URL: ${url}`);
            console.log(`  Cleaned: ${url.replace(/#$/, '')}`);
          }
        }
      });
      
      // Check slug
      console.log('\n🏷️ Slug Analysis:');
      console.log('productslug:', product.productslug);
      console.log('slug:', product.slug);
      console.log('aiTempOutput:', product.aiTempOutput);
      console.log('fabricCode:', product.fabricCode);
      
      const slugFields = ['productslug', 'slug', 'aiTempOutput', 'fabricCode'];
      slugFields.forEach(field => {
        const slug = product[field];
        if (slug && typeof slug === 'string') {
          const hasHash = slug.includes('#');
          const endsWithHash = slug.endsWith('#');
          console.log(`${field}: ${hasHash ? '❌ HAS HASH' : '✅ NO HASH'} ${endsWithHash ? '(ENDS WITH #)' : ''}`);
          if (hasHash) {
            console.log(`  Value: ${slug}`);
            console.log(`  Cleaned: ${slug.replace(/#$/, '')}`);
          }
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugImageUrls();