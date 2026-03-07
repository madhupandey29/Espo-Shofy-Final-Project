'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorMsg from "../common/error-msg";
import ShopCategoryLoader from "../loader/shop/shop-category-loader";

const HomeCategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Get merchtag filter from environment
  const merchTagFilter = "ecatalogue";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiBase = "https://espobackend.vercel.app/api";

        // Fetch categories
        const categoriesRes = await fetch(`${apiBase}/product/fieldname/category`);
        
        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesRes.json();
        const categoryList = categoriesData?.values || [];
        setCategories(categoryList);

        // Fetch ALL products (handle pagination)
        let allProducts = [];
        let currentPage = 1;
        let totalPages = 1;

        // Fetch first page to get total pages
        const firstPageRes = await fetch(`${apiBase}/product?page=1&limit=20`);
        if (!firstPageRes.ok) {
          throw new Error("Failed to fetch products");
        }

        const firstPageData = await firstPageRes.json();
        console.log("First page response:", firstPageData);

        // Extract products and pagination info
        const firstPageProducts = firstPageData?.data || [];
        allProducts = [...firstPageProducts];
        totalPages = firstPageData?.pagination?.totalPages || 1;

        console.log(`Total pages: ${totalPages}, First page products: ${firstPageProducts.length}`);

        // Fetch remaining pages if there are more
        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(
              fetch(`${apiBase}/product?page=${page}&limit=20`).then(res => res.json())
            );
          }

          const remainingPages = await Promise.all(pagePromises);
          remainingPages.forEach(pageData => {
            const pageProducts = pageData?.data || [];
            allProducts = [...allProducts, ...pageProducts];
          });
        }

        console.log("Total products fetched:", allProducts.length);
        console.log("Sample product:", allProducts[0]);
        console.log("Sample product merchTags:", allProducts[0]?.merchTags);

        setProducts(allProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by merchTags and get category data with images
  const categoriesWithData = useMemo(() => {
    if (!categories.length) return [];

    // If no products loaded, show categories with placeholder
    if (!products.length) {
      return categories.map((categoryName) => ({
        name: categoryName,
        count: 0,
        image: '/assets/img/about/about1.jpg',
      }));
    }

    // Filter products by merchTags (note: plural and capital T)
    const filteredProducts = products.filter((product) => {
      const merchTags = product.merchTags || product.merchtags || product.merchtag || product.merchTag;
      if (!merchTags) return false;
      
      // Check if merchTags contains "ecatalogue" (case insensitive)
      if (Array.isArray(merchTags)) {
        return merchTags.some(tag => tag?.toLowerCase().includes('ecatalogue'));
      }
      return String(merchTags).toLowerCase().includes('ecatalogue');
    });

    console.log("Total products:", products.length);
    console.log("Filtered products by merchTags:", filteredProducts.length);
    console.log("Sample product merchTags:", products[0]?.merchTags);

    // If no products match merchtag, show all products instead
    const productsToCount = filteredProducts.length > 0 ? filteredProducts : products;

    // Get category data with first product image
    const categoryCounts = categories.map((categoryName) => {
      const categoryProducts = productsToCount.filter(
        (product) => product.category === categoryName
      );
      
      // Get first product image for category
      const firstProduct = categoryProducts[0];
      let categoryImage = '/assets/img/about/about1.jpg';
      
      if (firstProduct) {
        // Check for Cloudinary URLs
        const cloudinaryFields = [
          firstProduct?.image1CloudUrlWeb,
          firstProduct?.image2CloudUrlWeb,
          firstProduct?.image3CloudUrlWeb,
          firstProduct?.imageCloudUrl,
          firstProduct?.cloudUrl
        ];

        for (const field of cloudinaryFields) {
          if (field && typeof field === 'string' && field.trim() && field !== 'null' && field !== 'undefined') {
            const cleanUrl = field.trim().replace(/#$/, '');
            if (cleanUrl.startsWith('http')) {
              categoryImage = cleanUrl;
              break;
            }
          }
        }
      }

      return {
        name: categoryName,
        count: categoryProducts.length,
        image: categoryImage,
      };
    });

    // Show all categories
    return categoryCounts;
  }, [categories, products, merchTagFilter]);

  console.log("Categories with data:", categoriesWithData);

  // Handle category click - redirect to dedicated category page
  const handleCategoryClick = (categoryName) => {
    const slug = categoryName
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    router.push(`/category/${slug}`);
  };

  // Decide what to render
  let content = null;

  if (loading) {
    content = <ShopCategoryLoader loading={true} />;
  } else if (error) {
    content = <ErrorMsg msg={`Error: ${error}`} />;
  } else if (categoriesWithData.length === 0) {
    content = <ErrorMsg msg="No categories found!" />;
  } else {
    const displayCategories = categoriesWithData.slice(0, 8); // Show max 8 categories on home
    content = displayCategories.map((item, index) => (
      <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div
          className="tp-category-card"
          onClick={() => handleCategoryClick(item.name)}
        >
          <div className="tp-category-img-wrapper">
            <Image
              src={item.image}
              alt={item.name}
              width={300}
              height={300}
              className="tp-category-img"
              onError={(e) => {
                e.target.src = '/assets/img/about/about1.jpg';
              }}
            />
            <div className="tp-category-overlay"></div>
          </div>
          <div className="tp-category-content">
            <h3 className="tp-category-title">{item.name}</h3>
            <span className="tp-category-count">{item.count} Products</span>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <>
      <section className="tp-category-section pt-70 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Browse Categories
                  <svg className="tp-shape-line" width="60" height="4" viewBox="0 0 60 4" fill="none">
                    <path d="M0 2H60" stroke="var(--tp-theme-secondary)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="tp-section-title-2">Shop by Category</h3>
                <p className="tp-section-description">Explore our wide range of fabric categories</p>
              </div>
            </div>
          </div>
          <div className="row">{content}</div>
        </div>
      </section>

      <style jsx global>{`
        .tp-category-section {
          background: var(--tp-grey-1);
          position: relative;
        }

        .tp-category-card {
          background: var(--tp-common-white);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15, 34, 53, 0.06);
          border: 1px solid rgba(44, 76, 151, 0.08);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          height: 100%;
          margin-bottom: 30px;
          position: relative;
        }

        .tp-category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(44, 76, 151, 0.03) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 1;
          pointer-events: none;
        }

        .tp-category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(44, 76, 151, 0.12);
          border-color: rgba(44, 76, 151, 0.2);
        }

        .tp-category-card:hover::before {
          opacity: 1;
        }

        .tp-category-img-wrapper {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .tp-category-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(0.98);
        }

        .tp-category-card:hover .tp-category-img {
          transform: scale(1.08);
          filter: brightness(1.02);
        }

        .tp-category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            rgba(1, 15, 28, 0) 0%, 
            rgba(1, 15, 28, 0.15) 50%,
            rgba(1, 15, 28, 0.4) 100%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 2;
        }

        .tp-category-card:hover .tp-category-overlay {
          opacity: 1;
        }

        .tp-category-content {
          padding: 28px 24px;
          text-align: center;
          background: var(--tp-common-white);
          position: relative;
          z-index: 3;
        }

        .tp-category-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--tp-text-1);
          margin-bottom: 10px;
          font-family: var(--tp-ff-jost);
          transition: color 0.25s ease;
          letter-spacing: -0.3px;
        }

        .tp-category-card:hover .tp-category-title {
          color: var(--tp-theme-primary);
        }

        .tp-category-count {
          font-size: 14px;
          color: var(--tp-text-2);
          font-family: var(--tp-ff-roboto);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--tp-grey-1);
          border-radius: 20px;
          transition: all 0.25s ease;
        }

        .tp-category-count::before {
          content: '';
          width: 6px;
          height: 6px;
          background: var(--tp-theme-primary);
          border-radius: 50%;
          display: inline-block;
        }

        .tp-category-card:hover .tp-category-count {
          background: rgba(44, 76, 151, 0.1);
          color: var(--tp-theme-primary);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .tp-category-title {
            font-size: 19px;
          }
        }

        @media (max-width: 992px) {
          .tp-category-content {
            padding: 24px 20px;
          }

          .tp-category-title {
            font-size: 18px;
          }

          .tp-category-count {
            font-size: 13px;
            padding: 5px 12px;
          }
        }

        @media (max-width: 768px) {
          .tp-category-section {
            padding: 50px 0;
          }

          .tp-section-title-wrapper-2 {
            margin-bottom: 35px !important;
          }

          .tp-category-card {
            margin-bottom: 24px;
          }

          .tp-category-content {
            padding: 22px 18px;
          }

          .tp-category-title {
            font-size: 17px;
            margin-bottom: 8px;
          }

          .tp-category-count {
            font-size: 13px;
          }

          .tp-category-img-wrapper {
            aspect-ratio: 1;
          }
        }

        @media (max-width: 576px) {
          .tp-category-section {
            padding: 40px 0;
          }

          .tp-category-card {
            margin-bottom: 20px;
          }

          .tp-category-title {
            font-size: 16px;
          }

          .tp-category-count {
            font-size: 12px;
            padding: 4px 10px;
          }

          .tp-category-count::before {
            width: 5px;
            height: 5px;
          }
        }

        /* Dark Theme Support */
        .theme-dark .tp-category-section {
          background: var(--tp-grey-1);
        }

        .theme-dark .tp-category-card {
          background: var(--tp-common-white);
          border-color: rgba(44, 76, 151, 0.1);
        }

        .theme-dark .tp-category-img-wrapper {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        }

        .theme-dark .tp-category-count {
          background: rgba(44, 76, 151, 0.08);
        }
      `}</style>
    </>
  );
};

export default HomeCategorySection;
