const https = require('https');

const API_BASE = 'https://espobackend.vercel.app/api';
const BLOG_PATH = '/blog';

async function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: res.statusCode === 200, json, status: res.statusCode });
        } catch (e) {
          resolve({ ok: false, json: null, status: res.statusCode });
        }
      });
    }).on('error', (e) => {
      resolve({ ok: false, json: null, error: e.message });
    });
  });
}

async function getBlog(slugOrId) {
  // First try to fetch by ID directly
  try {
    const idRes = await fetchJson(`${API_BASE}${BLOG_PATH}/${slugOrId}`);
    if (idRes.ok && idRes.json?.data) {
      return idRes.json.data;
    }
  } catch (error) {
    // Ignore ID fetch errors
  }

  // If ID fetch fails, try to find by slug from the list
  try {
    const listRes = await fetchJson(`${API_BASE}${BLOG_PATH}`);
    if (listRes.ok && listRes.json?.data && Array.isArray(listRes.json.data)) {
      const blogBySlug = listRes.json.data.find(blog => blog.slug === slugOrId);
      if (blogBySlug) return blogBySlug;
    }
  } catch (error) {
    // Ignore list fetch errors
  }

  return null;
}

async function testCompleteBlogFlow() {
  console.log('=== Testing Complete Blog Flow ===\n');
  
  // 1. Test blog list endpoint
  console.log('1. Testing blog list endpoint...');
  const listRes = await fetchJson(`${API_BASE}${BLOG_PATH}`);
  if (listRes.ok && listRes.json?.data) {
    console.log('✅ Blog list endpoint working');
    console.log(`   Found ${listRes.json.data.length} blogs`);
    
    if (listRes.json.data.length > 0) {
      const firstBlog = listRes.json.data[0];
      console.log(`   First blog: ${firstBlog.title} (ID: ${firstBlog.id}, Slug: ${firstBlog.slug})`);
      
      // 2. Test individual blog fetch by ID
      console.log('\n2. Testing individual blog fetch by ID...');
      const blogById = await getBlog(firstBlog.id);
      if (blogById) {
        console.log('✅ Blog fetch by ID working');
        console.log(`   Title: ${blogById.title}`);
        console.log(`   Has blogimage1: ${blogById.blogimage1 ? '✅' : '❌'}`);
        console.log(`   Has blogimage2: ${blogById.blogimage2 ? '✅' : '❌'}`);
        console.log(`   Has paragraph1: ${blogById.paragraph1 ? '✅' : '❌'}`);
        console.log(`   Has paragraph2: ${blogById.paragraph2 ? '✅' : '❌'}`);
        console.log(`   Has paragraph3: ${blogById.paragraph3 ? '✅' : '❌'}`);
      } else {
        console.log('❌ Blog fetch by ID failed');
      }
      
      // 3. Test individual blog fetch by slug
      if (firstBlog.slug) {
        console.log('\n3. Testing individual blog fetch by slug...');
        const blogBySlug = await getBlog(firstBlog.slug);
        if (blogBySlug) {
          console.log('✅ Blog fetch by slug working');
          console.log(`   Title: ${blogBySlug.title}`);
          console.log(`   Same as ID fetch: ${blogById?.id === blogBySlug.id ? '✅' : '❌'}`);
        } else {
          console.log('❌ Blog fetch by slug failed');
        }
      } else {
        console.log('\n3. ⚠️  First blog has no slug, skipping slug test');
      }
      
      // 4. Test image URLs
      console.log('\n4. Testing image URLs...');
      if (blogById?.blogimage1) {
        const img1Test = await fetchJson(blogById.blogimage1);
        console.log(`   blogimage1 accessible: ${img1Test.status === 200 ? '✅' : '❌'} (${img1Test.status})`);
      }
      if (blogById?.blogimage2) {
        const img2Test = await fetchJson(blogById.blogimage2);
        console.log(`   blogimage2 accessible: ${img2Test.status === 200 ? '✅' : '❌'} (${img2Test.status})`);
      }
      
    } else {
      console.log('❌ No blogs found in list');
    }
  } else {
    console.log('❌ Blog list endpoint failed');
    console.log(`   Status: ${listRes.status}`);
    console.log(`   Error: ${listRes.error || 'Unknown'}`);
  }
  
  console.log('\n=== Test Complete ===');
}

testCompleteBlogFlow().catch(console.error);