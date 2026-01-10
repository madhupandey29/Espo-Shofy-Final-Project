const https = require('https');

const API_BASE = 'https://espobackend.vercel.app/api';
const BLOG_PATH = '/blog';

async function getBlog(blogId) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${BLOG_PATH}/${blogId}`;
    console.log('Fetching blog from:', url);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('API Response Status:', res.statusCode);
          console.log('API Response Success:', json.success);
          resolve(json?.data ?? null);
        } catch (e) {
          console.error('Parse error:', e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error('Request error:', e.message);
      resolve(null);
    });
  });
}

async function testBlogDetails() {
  const blogId = '69623a8289858912e';
  console.log('Testing blog details for ID:', blogId);
  
  const blog = await getBlog(blogId);
  
  if (!blog) {
    console.log('❌ Blog not found');
    return;
  }
  
  console.log('✅ Blog found');
  console.log('Title:', blog.title);
  console.log('Slug:', blog.slug);
  console.log('');
  
  console.log('Images:');
  console.log('- blogimage1:', blog.blogimage1 ? '✅ Present' : '❌ Missing');
  console.log('- blogimage2:', blog.blogimage2 ? '✅ Present' : '❌ Missing');
  console.log('');
  
  console.log('Content:');
  console.log('- paragraph1:', blog.paragraph1 ? '✅ Present' : '❌ Missing');
  console.log('- paragraph2:', blog.paragraph2 ? '✅ Present' : '❌ Missing');
  console.log('- paragraph3:', blog.paragraph3 ? '✅ Present' : '❌ Missing');
  console.log('');
  
  console.log('Content Preview:');
  if (blog.paragraph1) console.log('paragraph1:', blog.paragraph1.substring(0, 50) + '...');
  if (blog.paragraph2) console.log('paragraph2:', blog.paragraph2.substring(0, 50) + '...');
  if (blog.paragraph3) console.log('paragraph3:', blog.paragraph3.substring(0, 50) + '...');
  
  console.log('');
  console.log('Image URLs:');
  if (blog.blogimage1) console.log('blogimage1:', blog.blogimage1);
  if (blog.blogimage2) console.log('blogimage2:', blog.blogimage2);
}

testBlogDetails().catch(console.error);