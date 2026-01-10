const https = require('https');

const API_BASE = 'https://espobackend.vercel.app/api';
const BLOG_PATH = '/blog';

async function getBlog(slugOrId) {
  // First try to fetch by ID directly
  try {
    const idRes = await new Promise((resolve, reject) => {
      const url = `${API_BASE}${BLOG_PATH}/${slugOrId}`;
      console.log('Trying ID fetch:', url);
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ ok: res.statusCode === 200, json });
          } catch (e) {
            resolve({ ok: false, json: null });
          }
        });
      }).on('error', () => resolve({ ok: false, json: null }));
    });
    
    if (idRes.ok && idRes.json?.data) {
      console.log('✅ Found by ID');
      return idRes.json.data;
    }
  } catch (error) {
    console.log('ID fetch failed:', error.message);
  }

  // If ID fetch fails, try to find by slug from the list
  try {
    const listRes = await new Promise((resolve, reject) => {
      const url = `${API_BASE}${BLOG_PATH}`;
      console.log('Trying list fetch:', url);
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ ok: res.statusCode === 200, json });
          } catch (e) {
            resolve({ ok: false, json: null });
          }
        });
      }).on('error', () => resolve({ ok: false, json: null }));
    });
    
    if (listRes.ok && listRes.json?.data && Array.isArray(listRes.json.data)) {
      console.log('Got blog list, searching for slug:', slugOrId);
      const blogBySlug = listRes.json.data.find(blog => blog.slug === slugOrId);
      if (blogBySlug) {
        console.log('✅ Found by slug');
        return blogBySlug;
      } else {
        console.log('❌ Slug not found in list');
        console.log('Available slugs:', listRes.json.data.map(b => b.slug).filter(Boolean));
      }
    }
  } catch (error) {
    console.log('List fetch failed:', error.message);
  }

  return null;
}

async function testBlogSlugFetch() {
  console.log('=== Testing Blog Slug Fetch ===\n');
  
  // Test with ID
  console.log('1. Testing with ID:');
  const blogById = await getBlog('69623a8289858912e');
  console.log('Result:', blogById ? '✅ Success' : '❌ Failed');
  console.log('');
  
  // Test with slug
  console.log('2. Testing with slug:');
  const blogBySlug = await getBlog('blog-slug');
  console.log('Result:', blogBySlug ? '✅ Success' : '❌ Failed');
  console.log('');
  
  if (blogBySlug) {
    console.log('Blog found by slug:');
    console.log('- ID:', blogBySlug.id);
    console.log('- Title:', blogBySlug.title);
    console.log('- Slug:', blogBySlug.slug);
  }
}

testBlogSlugFetch().catch(console.error);