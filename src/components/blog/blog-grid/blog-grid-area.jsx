'use client';
import React, { useEffect, useState } from 'react';
import ModernBlogCard from './modern-blog-card';
import styles from './ModernBlog.module.scss';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/,'');
const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || '/blog';

const fetchBlogs = async () => {
  const res = await fetch(`${API_BASE}${BLOG_PATH}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load blogs');
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

const BlogGridArea = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await fetchBlogs();
        if (!alive) return;
        setAllBlogs(data);
      } catch (e) {
        if (alive) setErr(e?.message || 'Error loading blogs');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <section className={`${styles.modernBlogArea} py-5`}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className={`mt-3 ${styles.loadingText}`}>Loading latest articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className={`${styles.modernBlogArea} py-5`}>
        <div className="container">
          <div className="text-center py-5">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Oops! Something went wrong</h4>
              <p>{err}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.modernBlogArea} py-5`}>
      <div className="container">
        {/* Modern Blog Grid - Show all blogs */}
        <div className={styles.modernBlogGrid}>
          {allBlogs.map((blog, idx) => (
            <ModernBlogCard 
              key={blog._id || blog.id || idx} 
              blog={blog} 
              index={idx}
            />
          ))}
        </div>

        {/* Show message if no blogs found */}
        {allBlogs.length === 0 && !loading && !err && (
          <div className="text-center py-5">
            <p className="text-muted">No blog posts found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGridArea;
