/**
 * Sitemap Management Utilities
 * Provides functions for dynamic sitemap generation and management
 */

export class SitemapManager {
  constructor(baseUrl, apiBaseUrl) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL;
    this.apiBaseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  /**
   * Get all static routes from the app directory
   */
  getStaticRoutes() {
    const staticRoutes = [
      { path: '/', priority: 1.0, changeFreq: 'daily' },
      { path: '/shop', priority: 0.9, changeFreq: 'daily' },
      { path: '/shop-category', priority: 0.8, changeFreq: 'daily' },
      { path: '/shop-right-sidebar', priority: 0.7, changeFreq: 'daily' },
      { path: '/shop-hidden-sidebar', priority: 0.7, changeFreq: 'daily' },
      { path: '/blog', priority: 0.8, changeFreq: 'weekly' },
      { path: '/blog-grid', priority: 0.7, changeFreq: 'weekly' },
      { path: '/blog-list', priority: 0.7, changeFreq: 'weekly' },
      { path: '/cart', priority: 0.6, changeFreq: 'daily' },
      { path: '/wishlist', priority: 0.6, changeFreq: 'daily' },
      { path: '/compare', priority: 0.6, changeFreq: 'daily' },
      { path: '/checkout', priority: 0.6, changeFreq: 'daily' },
      { path: '/contact', priority: 0.7, changeFreq: 'monthly' },
      { path: '/search', priority: 0.6, changeFreq: 'daily' },
      { path: '/login', priority: 0.5, changeFreq: 'monthly' },
      { path: '/register', priority: 0.5, changeFreq: 'monthly' },
      { path: '/forgot', priority: 0.4, changeFreq: 'monthly' },
      { path: '/profile', priority: 0.5, changeFreq: 'weekly' },
      { path: '/coupon', priority: 0.5, changeFreq: 'weekly' },
    ];

    return staticRoutes.map(route => ({
      url: `${this.baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFreq,
      priority: route.priority,
    }));
  }

  /**
   * Fetch dynamic product pages
   */
  async getProductPages() {
    try {
      let apiUrl = this.apiBaseUrl;
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl.replace(/\/$/, '') + '/api';
      }
      
      const response = await fetch(`${apiUrl}/product/?limit=200`, {
        next: { revalidate: 300 },
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.warn('Failed to fetch products for sitemap');
        return [];
      }

      const data = await response.json();
      
      if (!data.success || !data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data
        .filter(product => product.productslug || product.slug)
        .map(product => ({
          url: `${this.baseUrl}/fabric/${product.productslug || product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));

    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
      return [];
    }
  }

  /**
   * Fetch dynamic blog pages
   */
  async getBlogPages() {
    try {
      // Import blog data dynamically
      const blogData = await import('@/data/blog-data');
      const blogs = blogData.default || [];

      const blogPages = blogs.map(blog => ({
        url: `${this.baseUrl}/blog-details/${blog.id}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

      const blogPages2 = blogs.map(blog => ({
        url: `${this.baseUrl}/blog-details-2/${blog.id}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

      return [...blogPages, ...blogPages2];

    } catch (error) {
      console.error('Error fetching blog data for sitemap:', error);
      return [];
    }
  }

  /**
   * Fetch category pages
   */
  async getCategoryPages() {
    try {
      let apiUrl = this.apiBaseUrl;
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl.replace(/\/$/, '') + '/api';
      }
      
      const response = await fetch(`${apiUrl}/category/view`, {
        next: { revalidate: 300 },
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data
        .filter(category => category.slug || category.name)
        .map(category => ({
          url: `${this.baseUrl}/shop-category?category=${encodeURIComponent(category.slug || category.name)}`,
          lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));

    } catch (error) {
      console.warn('Categories API not available for sitemap');
      return [];
    }
  }

  /**
   * Generate complete sitemap
   */
  async generateSitemap() {
    const [staticPages, productPages, blogPages, categoryPages] = await Promise.all([
      this.getStaticRoutes(),
      this.getProductPages(),
      this.getBlogPages(),
      this.getCategoryPages(),
    ]);

    const allPages = [
      ...staticPages,
      ...productPages,
      ...blogPages,
      ...categoryPages,
    ];

    // Remove duplicates
    const uniquePages = this.removeDuplicates(allPages);

    // Sort by priority and date
    uniquePages.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.lastModified) - new Date(a.lastModified);
    });

    return uniquePages;
  }

  /**
   * Remove duplicate URLs
   */
  removeDuplicates(pages) {
    const seen = new Set();
    return pages.filter(page => {
      if (seen.has(page.url)) {
        return false;
      }
      seen.add(page.url);
      return true;
    });
  }

  /**
   * Get sitemap statistics
   */
  getStats(pages) {
    return {
      total: pages.length,
      static: pages.filter(p => this.isStaticPage(p.url)).length,
      products: pages.filter(p => p.url.includes('/fabric/')).length,
      blogs: pages.filter(p => p.url.includes('/blog-details')).length,
      categories: pages.filter(p => p.url.includes('category=')).length,
    };
  }

  /**
   * Check if a URL is a static page
   */
  isStaticPage(url) {
    const path = url.replace(this.baseUrl, '');
    const staticPaths = ['/', '/shop', '/blog', '/cart', '/wishlist', '/login', '/contact', '/register', '/checkout', '/compare', '/search', '/profile', '/coupon', '/forgot'];
    
    return staticPaths.includes(path) || 
           path.startsWith('/shop-') || 
           path.includes('/blog-grid') || 
           path.includes('/blog-list');
  }
}

export default SitemapManager;