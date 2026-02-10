/**
 * Test Blog JSON-LD Page
 * Visit this page to see the actual structured data being generated
 */

import { fetchTopicPageByName, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";
import { generateBlogPageStructuredData } from "@/utils/blogPageStructuredData";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/,'');
const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || '/blog';

async function fetchBlogs() {
  try {
    const response = await fetch(`${API_BASE}${BLOG_PATH}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await response.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function TestBlogJsonLdPage() {
  // Fetch data
  const blogs = await fetchBlogs();
  const topicPageData = await fetchTopicPageByName(PAGE_NAMES.BLOG);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amrita-fashions.com';
  
  // Generate structured data
  const blogStructuredData = generateBlogPageStructuredData(topicPageData, blogs, baseUrl);
  
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Blog JSON-LD Test Page</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '15px', color: '#2c4c97' }}>1. Topic Page Data (Raw API)</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px', 
          overflow: 'auto',
          border: '1px solid #ddd'
        }}>
          {JSON.stringify(topicPageData, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '15px', color: '#2c4c97' }}>2. Blogs Data</h2>
        <p style={{ marginBottom: '10px' }}>Total blogs: {blogs?.length || 0}</p>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px', 
          overflow: 'auto',
          border: '1px solid #ddd',
          maxHeight: '400px'
        }}>
          {JSON.stringify(blogs, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '15px', color: '#2c4c97' }}>3. Generated Blog Structured Data</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px', 
          overflow: 'auto',
          border: '1px solid #ddd'
        }}>
          {JSON.stringify(blogStructuredData, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '15px', color: '#2c4c97' }}>4. HTML Output (Copy this for Google Rich Results Test)</h2>
        <textarea 
          readOnly
          value={`<script type="application/ld+json">\n${JSON.stringify(blogStructuredData, null, 2)}\n</script>`}
          style={{ 
            width: '100%', 
            height: '300px', 
            fontFamily: 'monospace', 
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#f5f5f5'
          }}
        />
      </div>
      
      <div style={{ 
        background: '#e8f4f8', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #b3d9e8'
      }}>
        <h3 style={{ marginTop: 0, color: '#2c4c97' }}>✅ Checklist</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>{topicPageData ? '✓' : '✗'} Topic Page Data loaded</li>
          <li>{topicPageData?.metaTitle ? '✓' : '✗'} metaTitle present</li>
          <li>{topicPageData?.description ? '✓' : '✗'} description present</li>
          <li>{topicPageData?.canonicalUrl ? '✓' : '✗'} canonicalUrl present</li>
          <li>{blogs?.length > 0 ? '✓' : '✗'} Blogs loaded ({blogs?.length || 0} posts)</li>
          <li>{blogStructuredData?.['@type'] === 'Blog' ? '✓' : '✗'} Blog schema generated</li>
          <li>{blogStructuredData?.blogPost ? '✓' : '✗'} blogPost ItemList present</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <h3 style={{ marginTop: 0 }}>📝 Next Steps</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Copy the HTML output from section 4 above</li>
          <li>Go to <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a></li>
          <li>Paste the HTML code</li>
          <li>Click "Test Code"</li>
          <li>Check if Blog schema is detected</li>
        </ol>
      </div>
    </div>
  );
}
