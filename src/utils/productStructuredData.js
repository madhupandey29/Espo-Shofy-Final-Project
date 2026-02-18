/**
 * Generate JSON-LD structured data for product pages
 * @param {Object} product - Product data from API
 * @returns {Object} JSON-LD structured data object
 */
export const generateProductStructuredData = (product) => {
  if (!product) return null;

  // Get base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 
                  'https://www.amrita-fashions.com';

  // Clean slug by removing trailing hash
  const cleanSlug = (slug) => {
    if (!slug || typeof slug !== 'string') return '';
    return slug.trim().replace(/#$/, '');
  };

  // Get product slug
  const productSlug = cleanSlug(
    product.productslug || 
    product.slug || 
    product.aiTempOutput || 
    product.fabricCode ||
    product.id
  );

  // Get product URL
  const productUrl = productSlug ? `${baseUrl}/fabric/${productSlug}` : baseUrl;

  // Collect all available images (filter out empty values)
  const images = [
    product.image1CloudUrlWeb,
    product.image2CloudUrlWeb,
    product.image3CloudUrlWeb,
    product.image1CloudUrl,
    product.image2CloudUrl,
    product.image3CloudUrl,
    product.image1,
    product.image2,
    product.image3,
    product.img,
    product.image
  ].filter(img => img && typeof img === 'string' && img.trim() !== '');

  // Remove duplicates and clean trailing hash
  const uniqueImages = [...new Set(images)].map(img => img.replace(/#$/, ''));

  // Build the Product schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": productUrl,
    "name": product.productTitle || product.name || "Product",
    "description": product.fullProductDescription || product.shortProductDescription || product.description || "",
    "url": productUrl
  };

  // Add SKU if available
  if (product.sku || product.fabricCode || product.productIdentifier) {
    productSchema.sku = product.sku || product.fabricCode || product.productIdentifier;
  }

  // Add images (use array if multiple, single string if one)
  if (uniqueImages.length > 0) {
    productSchema.image = uniqueImages.length === 1 ? uniqueImages[0] : uniqueImages;
  }

  // Add brand
  productSchema.brand = {
    "@type": "Brand",
    "name": "Amrita Global Enterprises"
  };

  // ✅ Add aggregateRating (required by Google) - Use real ratings from API
  if (product.ratingValue && product.ratingCount && parseInt(product.ratingCount) > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.ratingValue.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": product.ratingCount.toString()
    };
  } else {
    // Fallback: Add offers if no ratings available
    productSchema.offers = {
      "@type": "Offer",
      "url": productUrl,
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    };
  }

  return productSchema;
};

/**
 * Generate JSON-LD script tag for product pages
 * @param {Object} product - Product data from API
 * @returns {string} HTML script tag with JSON-LD
 */
export const generateProductJsonLdScript = (product) => {
  const structuredData = generateProductStructuredData(product);
  
  if (!structuredData) return '';

  return `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
};