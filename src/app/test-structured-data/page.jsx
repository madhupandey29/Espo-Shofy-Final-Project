// Test page to verify structured data generation
import { generateBlogStructuredData, generateBlogBreadcrumbStructuredData } from '@/utils/blogStructuredData';
import TestStructuredDataClient from './TestStructuredDataClient';
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Structured Data Test - Debug JSON-LD Implementation",
    description: "Test page to verify Corporation JSON-LD structured data implementation",
    path: "/test-structured-data",
    robots: "noindex, nofollow" // Don't index test pages
  });
}

// Sample data for testing
const sampleBlog = {
  id: "697a03d42bfdf49cf",
  title: "Why Is the Textile Industry in West Bengal Ideal for Denim Fabric Manufacturing?",
  slug: "denim-manufacturers-in-west-bengal-for-garment-bran",
  publishedAt: "2026-01-31 18:30:00",
  modifiedAt: "2026-02-02 12:05:52",
  excerpt: "West Bengal is rapidly becoming a preferred destination for garment brands and exporters seeking reliable denim manufacturers in India.",
  blogimage1: "https://res.cloudinary.com/age-fabric/image/upload/v1770115088/sample-blog-image.jpg",
  assignedUserId: "696f4de23ba8bdb6c",
  assignedUserName: "Bhavin Sheth"
};

const sampleAuthor = {
  id: "696639a2946f38f04",
  name: "Rajesh Goyal",
  authorLinkedinURL: "https://www.linkedin.com/in/rajesh-m-goyal/"
};

export default function TestStructuredData() {
  const baseUrl = "https://www.amrita-fashions.com";
  const blogStructuredData = generateBlogStructuredData(sampleBlog, sampleAuthor, baseUrl);
  const breadcrumbStructuredData = generateBlogBreadcrumbStructuredData(sampleBlog, baseUrl);

  return (
    <div style={{ padding: '2rem' }}>
      {/* New Corporation JSON-LD Test */}
      <TestStructuredDataClient />
      
      <hr style={{ margin: '2rem 0' }} />
      
      {/* Existing Blog JSON-LD Test */}
      <div style={{ fontFamily: 'monospace' }}>
        <h1>Blog Structured Data Test</h1>
        
        <h2>BlogPosting JSON-LD:</h2>
        <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(blogStructuredData, null, 2)}
        </pre>
        
        <h2>BreadcrumbList JSON-LD:</h2>
        <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(breadcrumbStructuredData, null, 2)}
        </pre>
        
        <h2>Testing Instructions:</h2>
        <ol>
          <li>Copy the JSON above</li>
          <li>Go to <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a></li>
          <li>Click "Test Code" and paste the JSON</li>
          <li>Should show "BlogPosting" as valid</li>
        </ol>
      </div>
    </div>
  );
}