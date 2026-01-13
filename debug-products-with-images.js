// Debug script to find products that actually have images

const API_BASE = 'https://espobackend.vercel.app/api';

async function findProductsWithImages() {
  try {
    console.log('🔍 Looking for products with images...');
    
    // Get a list of products
    const response = await fetch(`${API_BASE}/product/?limit=50`);
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      console.log(`📊 Found ${data.data.length} products`);
      
      const productsWithImages = [];
      const productsWithoutImages = [];
      
      data.data.forEach((product, index) => {
        const hasImage1 = product.image1CloudUrl && product.image1CloudUrl !== null;
        const hasImage2 = product.image2CloudUrl && product.image2CloudUrl !== null;
        const hasImage3 = product.image3CloudUrl && product.image3CloudUrl !== null;
        const hasAnyImage = hasImage1 || hasImage2 || hasImage3;
        
        if (hasAnyImage) {
          productsWithImages.push({
            name: product.name,
            slug: product.productslug,
            image1: product.image1CloudUrl,
            image2: product.image2CloudUrl,
            image3: product.image3CloudUrl
          });
        } else {
          productsWithoutImages.push({
            name: product.name,
            slug: product.productslug
          });
        }
      });
      
      console.log(`\n✅ Products WITH images: ${productsWithImages.length}`);
      productsWithImages.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.slug})`);
        if (product.image1) console.log(`   Image1: ${product.image1}`);
        if (product.image2) console.log(`   Image2: ${product.image2}`);
        if (product.image3) console.log(`   Image3: ${product.image3}`);
        
        // Check for hash characters in image URLs
        [product.image1, product.image2, product.image3].forEach((url, i) => {
          if (url && url.includes('#')) {
            console.log(`   ❌ Image${i+1} contains hash: ${url}`);
          }
        });
      });
      
      console.log(`\n❌ Products WITHOUT images: ${productsWithoutImages.length}`);
      productsWithoutImages.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.slug})`);
      });
      
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findProductsWithImages();