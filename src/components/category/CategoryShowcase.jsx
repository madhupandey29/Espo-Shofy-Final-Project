"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from /api/categories...');
        
        const response = await fetch('/api/categories', {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories response:', data);
        
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log('Setting categories:', data.data.length);
          setCategories(data.data);
        } else if (Array.isArray(data) && data.length > 0) {
          console.log('Setting categories (array):', data.length);
          setCategories(data);
        } else {
          console.warn('No categories found in response');
          setError('No categories available');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show loading skeleton
  if (loading) {
    return (
      <section className="category-showcase-area pt-70 pb-40">
        <div className="container">
          <div className="row mb-40">
            <div className="col-12 text-center">
              <div className="category-showcase-header">
                <h2 className="category-showcase-title">
                  SHOP BY <span className="text-gradient">CATEGORY</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row g-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="category-card-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If error or no categories, don't show the section
  if (error || !categories.length) {
    console.warn('Category showcase hidden:', error || 'No categories found');
    return null;
  }

  return (
    <section className="category-showcase-area pt-70 pb-40">
      <div className="container">
        {/* Section Header */}
        <div className="row mb-40">
          <div className="col-12 text-center">
            <div className="category-showcase-header">
              <h2 className="category-showcase-title">
                SHOP BY <span className="text-gradient">CATEGORY</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="row g-20">
          {categories.map((category) => {
            const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || '';
            const imageUrl = category.image || category.categoryImage || '/assets/img/category/default.jpg';
            
            return (
              <div key={category.id || category._id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <Link href={`/categories/${slug}`} className="category-card">
                  <div className="category-card-inner">
                    {/* Image Container */}
                    <div className="category-image-wrapper">
                      <Image
                        src={imageUrl}
                        alt={category.name || 'Category'}
                        width={300}
                        height={400}
                        className="category-image"
                        loading="lazy"
                      />
                      <div className="category-overlay"></div>
                    </div>

                    {/* Content */}
                    <div className="category-content">
                      <h3 className="category-name">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
