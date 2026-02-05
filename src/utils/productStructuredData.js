/**
 * Generate JSON-LD structured data for product pages
 * @param {Object} product - Product data from API
 * @returns {Object} JSON-LD structured data object
 */
export const generateProductStructuredData = (product) => {
  if (!product) return null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.productTitle || product.name || "Product",
    "image": product.image1CloudUrl || "",
    "description": product.shortProductDescription || product.description || "",
    "brand": {
      "@type": "Brand",
      "name": "AGE"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratingValue?.toString() || "4",
      "bestRating": "5",
      "worstRating": "4",
      "ratingCount": product.ratingCount?.toString() || "0"
    }
  };
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