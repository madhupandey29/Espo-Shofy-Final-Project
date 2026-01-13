// Debug script to test image fallback logic

// Simulate the imageUrl logic from product-item.jsx
function simulateImageUrl(product) {
  console.log('🔍 Simulating imageUrl logic for product:', product.name);
  
  // First check for Cloudinary URLs (direct URLs)
  const cloudinaryFields = [
    product?.image1CloudUrl,
    product?.image2CloudUrl,
    product?.image3CloudUrl,
    product?.imageCloudUrl,
    product?.cloudUrl,
  ];

  console.log('📊 Cloudinary fields:', cloudinaryFields);

  for (const field of cloudinaryFields) {
    if (field && typeof field === 'string' && field.trim() && field !== 'null' && field !== 'undefined' && field !== '') {
      const cleanUrl = field.trim().replace(/#$/, ''); // Remove trailing hash character
      if (cleanUrl.startsWith('http')) {
        console.log('✅ Found Cloudinary URL:', cleanUrl);
        return cleanUrl;
      }
    }
  }

  console.log('❌ No Cloudinary URLs found, checking fallback fields...');

  // Simulate valueToUrlString function
  const valueToUrlString = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v.trim();
    if (Array.isArray(v)) return valueToUrlString(v[0]);
    if (typeof v === 'object') return valueToUrlString(v.secure_url || v.url || v.path || v.key);
    return '';
  };

  // Fallback to other image fields
  const raw =
    valueToUrlString(product?.img) ||
    valueToUrlString(product?.image1) ||
    valueToUrlString(product?.image2) ||
    valueToUrlString(product?.image3) ||
    valueToUrlString(product?.image) ||
    valueToUrlString(product?.images) ||
    valueToUrlString(product?.thumbnail);

  console.log('📊 Raw fallback value:', raw);

  if (!raw) {
    console.log('✅ Using default fallback image: /assets/img/product/default-product-img.jpg');
    return '/assets/img/product/default-product-img.jpg';
  }

  const isHttpUrl = (s) => /^https?:\/\//i.test(s);
  if (isHttpUrl(raw)) {
    console.log('✅ Found HTTP URL:', raw);
    return raw;
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  const clean = (p) =>
    (p || '')
      .replace(/^\/+/, '')
      .replace(/^api\/uploads\/?/, '')
      .replace(/^uploads\/?/, '');
  
  const finalUrl = `${base}/uploads/${clean(raw)}`;
  console.log('✅ Constructed URL:', finalUrl);
  return finalUrl;
}

// Test with the Nokia-602 product data
const testProduct = {
  name: "Nokia-602",
  image1CloudUrl: null,
  image2CloudUrl: null,
  image3CloudUrl: null,
  imageCloudUrl: undefined,
  cloudUrl: undefined,
  img: undefined,
  image: undefined,
  image1: undefined,
  image2: undefined,
  image3: undefined,
  images: undefined,
  thumbnail: undefined
};

console.log('🧪 Testing image URL logic...');
const result = simulateImageUrl(testProduct);
console.log('🎯 Final result:', result);

// Test what happens in the browser
console.log('\n🌐 Browser behavior:');
console.log('- If the default image exists at /assets/img/product/default-product-img.jpg, it should display');
console.log('- If the default image is missing or corrupted, you will see a red placeholder');
console.log('- Check browser network tab to see if the default image is loading successfully');