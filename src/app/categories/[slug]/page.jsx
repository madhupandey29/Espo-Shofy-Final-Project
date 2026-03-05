// app/categories/[slug]/page.jsx
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import CompactUniversalBreadcrumb from "@/components/breadcrumb/compact-universal-breadcrumb";
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";
import { BreadcrumbJsonLd } from "@/utils/breadcrumbStructuredData";
import { notFound } from "next/navigation";

export const revalidate = 120;

/* ---------------------------------------------
   Fetch Category Data
---------------------------------------------- */
async function fetchCategoryBySlug(slug) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
    const response = await fetch(`${API_BASE}/product/fieldname/category`, {
      next: { revalidate: 120 },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // API returns { values: ["Denim Fabrics", "Woven Fabrics"] }
    if (data?.values && Array.isArray(data.values)) {
      const categoryName = data.values.find(name => 
        name.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      if (categoryName) {
        return {
          id: slug,
          name: categoryName,
          slug: slug,
          description: `Explore our premium ${categoryName} collection`
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/* ---------------------------------------------
   Fetch Products by Category with merchTag filter
---------------------------------------------- */
async function fetchProductsByCategory(categoryName) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
    const MERCH_TAG_FILTER = process.env.NEXT_PUBLIC_MERCH_TAG_FILTER; // "ecatalogue"
    
    // Use the general product endpoint (same as fabric page)
    const url = `${API_BASE}/product?limit=150`;
    
    console.log('Fetching all products from:', url);
    console.log('Will filter by category:', categoryName);
    console.log('MerchTag filter:', MERCH_TAG_FILTER);
    
    const response = await fetch(url, {
      next: { revalidate: 120 },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return { products: [], total: 0, allTotal: 0 };
    }
    
    const payload = await response.json();
    
    let allProducts = [];
    
    // Handle the API response structure
    if (payload?.success && payload?.data && Array.isArray(payload.data)) {
      allProducts = payload.data;
    } else if (payload?.products && Array.isArray(payload.products)) {
      allProducts = payload.products;
    } else if (Array.isArray(payload)) {
      allProducts = payload;
    }
    
    console.log(`Total products from API: ${allProducts.length}`);
    
    // First filter by category
    const categoryProducts = allProducts.filter(product => {
      if (!product.category) return false;
      
      const productCategory = typeof product.category === 'string' 
        ? product.category 
        : product.category?.name || product.category?.id;
      
      return productCategory === categoryName || 
             productCategory?.toLowerCase() === categoryName?.toLowerCase();
    });
    
    console.log(`Products in category "${categoryName}": ${categoryProducts.length}`);
    
    // Then filter by merchTag if MERCH_TAG_FILTER is set
    let filteredProducts = categoryProducts;
    
    if (MERCH_TAG_FILTER) {
      filteredProducts = categoryProducts.filter(product => {
        if (!product.merchTags || !Array.isArray(product.merchTags)) {
          return false;
        }
        return product.merchTags.includes(MERCH_TAG_FILTER);
      });
      
      console.log(`Filtered products: ${filteredProducts.length} out of ${categoryProducts.length} (merchTag: ${MERCH_TAG_FILTER})`);
    }
    
    return {
      products: filteredProducts,
      total: filteredProducts.length,
      allTotal: categoryProducts.length
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, allTotal: 0 };
  }
}

/* ---------------------------------------------
   Generate Metadata
---------------------------------------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }
  
  const logoUrl = getOptimizedLogoUrl();
  const categoryName = category.name || 'Category';
  
  return generateSEOMetadata({
    title: `${categoryName} - Premium Fabric Collection`,
    description: category.description || `Explore our ${categoryName} fabric collection with high-quality textiles and materials.`,
    keywords: `${categoryName}, fabrics, textiles, ${categoryName} fabrics`,
    path: `/categories/${slug}`,
    ogImage: "/assets/img/logo/logo.svg",
    ogLogo: logoUrl,
    robots: "index, follow"
  });
}

/* ---------------------------------------------
   Category Page Component
---------------------------------------------- */
export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }
  
  const productData = await fetchProductsByCategory(category.name);
  
  console.log(`Category "${category.name}": ${productData.total} products (filtered from ${productData.allTotal} total)`);
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fabrics', href: '/fabric' },
    { label: category.name }
  ];
  
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'Fabrics', url: '/fabric' },
    { name: category.name, url: `/categories/${slug}` }
  ];
  
  return (
    <>
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      <Wrapper>
        <HeaderTwo style_2 />
        
        <h1
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          {category.name} - Premium Fabric Collection
        </h1>
        
        <CompactUniversalBreadcrumb items={breadcrumbItems} />
        
        {/* Category Header - Clean & Professional */}
        <section className="category-header-section">
          <div className="container">
            <div className="category-header-content">
              <h2 className="category-main-title">{category.name}</h2>
              <p className="category-subtitle">Premium Quality Textiles & Fabrics</p>
            </div>
          </div>
        </section>
        
        {/* Category About Section - Image + Content */}
        <section className="category-about-section">
          <div className="container">
            <div className="category-about-wrapper">
              <div className="category-about-image">
                <div className="about-image-placeholder">
                  <div className="placeholder-icon">🧵</div>
                </div>
              </div>
              <div className="category-about-content">
                <h3 className="about-title">About {category.name}</h3>
                <p className="about-description">
                  Discover our exquisite collection of {category.name.toLowerCase()} that combines 
                  traditional craftsmanship with modern design. Each fabric in our collection is 
                  carefully selected to ensure the highest quality standards.
                </p>
                <p className="about-description">
                  Our {category.name.toLowerCase()} are perfect for a wide range of applications, 
                  from fashion garments to home textiles. We source our materials from trusted 
                  suppliers and ensure every piece meets our rigorous quality control standards.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">Premium Quality Materials</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">Sustainable & Eco-Friendly</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">Wide Range of Colors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Grid */}
        <CategoryProductGrid 
          products={productData.products}
          categoryName={category.name}
        />
        
        <Footer primary_style />
      </Wrapper>
    </>
  );
}
