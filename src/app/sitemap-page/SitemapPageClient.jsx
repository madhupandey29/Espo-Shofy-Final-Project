'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiHome, FiFileText, FiTrendingUp
} from 'react-icons/fi';
import { 
  FaSitemap
} from 'react-icons/fa';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import styles from './sitemap.module.scss';

const SitemapPageClient = () => {
  const [sitemapData, setSitemapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    fetchSitemapData();
  }, []);

  const fetchSitemapData = async () => {
    try {
      setLoading(true);
      
      // Fetch sitemap data from your sitemap manager
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Import the SitemapManager dynamically
      const { SitemapManager } = await import('@/utils/sitemap-manager');
      const sitemapManager = new SitemapManager(baseUrl, apiBaseUrl);
      
      const data = await sitemapManager.generateSitemap();
      
      setSitemapData(data);
    } catch (error) {
      console.error('Error fetching sitemap data:', error);
      // Enhanced fallback data with more realistic examples
      const fallbackData = [
        { 
          url: window.location.origin + '/', 
          priority: 1.0, 
          changeFrequency: 'daily', 
          lastModified: new Date(),
          title: 'Home Page',
          description: 'Main landing page showcasing our textile products and services'
        },
        { 
          url: window.location.origin + '/fabric', 
          priority: 0.9, 
          changeFrequency: 'daily', 
          lastModified: new Date(),
          title: 'Fabric Collection',
          description: 'Browse our complete collection of textile products'
        },
        { 
          url: window.location.origin + '/about', 
          priority: 0.8, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'About Us',
          description: 'Learn about our company history and values'
        },
        { 
          url: window.location.origin + '/capabilities', 
          priority: 0.8, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Our Capabilities',
          description: 'Discover our manufacturing capabilities and processes'
        },
        { 
          url: window.location.origin + '/blog-grid', 
          priority: 0.7, 
          changeFrequency: 'weekly', 
          lastModified: new Date(),
          title: 'Blog',
          description: 'Latest news and insights from the textile industry'
        },
        { 
          url: window.location.origin + '/contact', 
          priority: 0.7, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Contact Us',
          description: 'Get in touch with our team'
        },
        { 
          url: window.location.origin + '/fabric/cotton-fabric', 
          priority: 0.8, 
          changeFrequency: 'weekly', 
          lastModified: new Date(),
          title: 'Cotton Fabric',
          description: 'Premium cotton fabric collection'
        },
        { 
          url: window.location.origin + '/fabric/silk-fabric', 
          priority: 0.8, 
          changeFrequency: 'weekly', 
          lastModified: new Date(),
          title: 'Silk Fabric',
          description: 'Luxurious silk fabric varieties'
        },
        { 
          url: window.location.origin + '/fabric/polyester-fabric', 
          priority: 0.8, 
          changeFrequency: 'weekly', 
          lastModified: new Date(),
          title: 'Polyester Fabric',
          description: 'Durable polyester fabric options'
        },
        { 
          url: window.location.origin + '/blog-details/textile-trends-2024', 
          priority: 0.6, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Textile Trends 2024',
          description: 'Latest trends in the textile industry'
        },
        { 
          url: window.location.origin + '/blog-details/sustainable-manufacturing', 
          priority: 0.6, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Sustainable Manufacturing',
          description: 'Our commitment to sustainable practices'
        },
        { 
          url: window.location.origin + '/shop-category', 
          priority: 0.7, 
          changeFrequency: 'daily', 
          lastModified: new Date(),
          title: 'Shop by Category',
          description: 'Browse products by category'
        },
        { 
          url: window.location.origin + '/cart', 
          priority: 0.5, 
          changeFrequency: 'daily', 
          lastModified: new Date(),
          title: 'Shopping Cart',
          description: 'Review your selected items'
        },
        { 
          url: window.location.origin + '/wishlist', 
          priority: 0.5, 
          changeFrequency: 'daily', 
          lastModified: new Date(),
          title: 'Wishlist',
          description: 'Save your favorite products'
        },
        { 
          url: window.location.origin + '/login', 
          priority: 0.4, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Login',
          description: 'Access your account'
        },
        { 
          url: window.location.origin + '/register', 
          priority: 0.4, 
          changeFrequency: 'monthly', 
          lastModified: new Date(),
          title: 'Register',
          description: 'Create a new account'
        }
      ];
      
      setSitemapData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getPageCategory = (url) => {
    if (url === '/' || url.endsWith('/')) return 'home';
    if (url.includes('/about')) return 'about';
    if (url.includes('/contact')) return 'contact';
    if (url.includes('/fabric/') || url.includes('/product/')) return 'products';
    if (url.includes('/blog')) return 'blog';
    if (url.includes('/fabric')) return 'fabric';
    if (url.includes('/cart') || url.includes('/wishlist') || url.includes('/checkout')) return 'fabric';
    if (url.includes('/login') || url.includes('/register') || url.includes('/profile')) return 'account';
    return 'fabric';
  };

  const organizePagesBySection = (pages) => {
    const sections = {
      home: {
        title: 'Home',
        pages: []
      },
      about: {
        title: 'About',
        pages: []
      },
      contact: {
        title: 'Contact',
        pages: []
      },
      fabric: {
        title: 'Fabric Collection',
        pages: []
      },
      blog: {
        title: 'Blog',
        pages: []
      },
      products: {
        title: 'Products',
        pages: []
      },
      account: {
        title: 'Account',
        pages: []
      }
    };

    pages.forEach(page => {
      const category = getPageCategory(page.url);
      if (sections[category]) {
        sections[category].pages.push(page);
      }
    });

    return sections;
  };

  const getSectionMainUrl = (sectionKey) => {
    const sectionUrls = {
      home: '/',
      about: '/about',
      contact: '/contact',
      fabric: '/fabric',
      products: '/fabric',
      blog: '/blog-grid',
      account: '/login'
    };
    return sectionUrls[sectionKey] || '/';
  };

  const copyToClipboard = async (text, buttonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = buttonElement.textContent;
      buttonElement.textContent = '✓';
      buttonElement.style.background = '#34a853';
      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.style.background = '';
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getPageTitle = (url) => {
    const path = url.replace(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin, '');
    
    if (path.includes('/fabric/')) {
      const slug = path.split('/fabric/')[1];
      return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    if (path.includes('/blog-details/')) {
      const slug = path.split('/blog-details/')[1];
      return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Home';
  };

  const getFileSize = (pages) => {
    const baseSize = pages.length * 2.5;
    return baseSize > 1000 ? `${(baseSize / 1000).toFixed(1)} MB` : `${baseSize} KB`;
  };

  const filteredData = sitemapData;
  const organizedSections = organizePagesBySection(filteredData);

  if (loading) {
    return (
      <Wrapper>
        <HeaderTwo style_2 />
        <div className={styles.sitemapContainer}>
          <div className="container mx-auto px-4">
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading sitemap data...</p>
            </div>
          </div>
        </div>
        <Footer primary_style />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      
      <div className={styles.sitemapContainer}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <FaSitemap className={styles.badgeIcon} />
                Interactive Site Map
              </div>
              <h1 className={styles.heroTitle}>
                Website <span className={styles.gradientText}>Sitemap</span>
              </h1>
              <p className={styles.heroDesc}>
                Complete overview of all pages and sections on our website.
              </p>
            </div>
          </div>
        </div>

        <div className="container-fluid px-4">
          {/* Simple Column Layout like Shopify */}
          <div className={styles.sitemapGrid}>
            {Object.entries(organizedSections).map(([sectionKey, section]) => {
              const filteredPages = section.pages || [];
              
              if (filteredPages.length === 0) return null;
              
              return (
                <div key={sectionKey} className={styles.sitemapColumn}>
                  <Link 
                    href={getSectionMainUrl(sectionKey)} 
                    className={styles.columnTitleLink}
                  >
                    <h3 className={styles.columnTitle}>{section.title}</h3>
                  </Link>
                  <ul className={styles.linksList}>
                    {sectionKey === 'products' ? (
                      <>
                        {filteredPages.slice(0, showAllProducts ? filteredPages.length : 5).map((page, index) => (
                          <li key={index} className={styles.linkItem}>
                            <Link
                              href={page.url.replace(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin, '') || '/'}
                              className={styles.sitemapLink}
                            >
                              {page.title || getPageTitle(page.url)}
                            </Link>
                          </li>
                        ))}
                        {filteredPages.length > 5 && (
                          <li className={styles.linkItem}>
                            <button 
                              onClick={() => setShowAllProducts(!showAllProducts)}
                              className={styles.showMoreBtn}
                            >
                              {showAllProducts ? 'Show Less' : `Show More (${filteredPages.length - 5} more)`}
                            </button>
                          </li>
                        )}
                      </>
                    ) : (
                      // Show all links for all other sections including Blog
                      filteredPages.map((page, index) => (
                        <li key={index} className={styles.linkItem}>
                          <Link
                            href={page.url.replace(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin, '') || '/'}
                            className={styles.sitemapLink}
                          >
                            {page.title || getPageTitle(page.url)}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className={styles.footerActions}>
            <div className={styles.actionGroup}>
              <Link
                href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/sitemap.xml`}
                target="_blank"
                className={styles.actionButton}
              >
                <FiFileText />
                XML Sitemap
              </Link>
              
              <button
                onClick={fetchSitemapData}
                className={styles.actionButton}
              >
                <FiTrendingUp />
                Refresh Data
              </button>

              <Link
                href="/"
                className={styles.actionButton}
              >
                <FiHome />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer primary_style />
    </Wrapper>
  );
};

export default SitemapPageClient;