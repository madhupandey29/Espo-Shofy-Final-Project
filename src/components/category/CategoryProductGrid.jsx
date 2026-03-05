"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CategoryProductGrid = ({ products, categoryName }) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("recommended");

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "newest":
        return new Date(b.modifiedAt || 0) - new Date(a.modifiedAt || 0);
      default:
        return 0;
    }
  });

  const handleProductClick = (product) => {
    const slug = product.productslug || product.slug || product.name?.toLowerCase().replace(/\s+/g, '-');
    if (slug) {
      router.push(`/fabric/${slug}`);
    }
  };

  return (
    <div className="category-product-section">
      <div className="container">
        {/* Sort Bar */}
        <div className="category-sort-bar">
          <h3 className="products-heading">Our Collection</h3>
          <div className="sort-controls">
            <span className="product-count">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="no-products-message">
            <div className="no-products-icon">📦</div>
            <h3>No products found</h3>
            <p>Check back soon for new arrivals in {categoryName}</p>
          </div>
        ) : (
          <div className="category-products-grid">
            {sortedProducts.map((product) => {
              const productImage = product.image1CloudUrl || 
                                 product.image1CloudUrlWeb || 
                                 product.image || 
                                 '/assets/img/product/default.jpg';
              
              const productName = product.name || product.productTitle || 'Unnamed Product';
              
              return (
                <div 
                  key={product.id || product._id} 
                  className="simple-product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="simple-product-image">
                    <Image
                      src={productImage}
                      alt={productName}
                      width={250}
                      height={250}
                      className="product-img"
                      loading="lazy"
                    />
                    <div className="product-overlay"></div>
                  </div>
                  <div className="simple-product-name">
                    <span>{productName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductGrid;
