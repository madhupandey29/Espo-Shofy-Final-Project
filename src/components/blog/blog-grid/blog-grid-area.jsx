'use client';
import React, { useEffect, useMemo, useState } from 'react';
import ModernBlogCard from './modern-blog-card';
import Pagination from '@/ui/Pagination';
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
  const [filteredRows, setFilteredRows] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(3); // Show 3 blogs per page
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
        setFilteredRows(data);
      } catch (e) {
        if (alive) setErr(e?.message || 'Error loading blogs');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  const pageSlice = useMemo(
    () => filteredRows.slice(pageStart, pageStart + countOfPage),
    [filteredRows, pageStart, countOfPage]
  );

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
      <div className="container"> {/* Changed from container-fluid to container */}
        {/* Modern Blog Grid - Show only 3 blogs */}
        <div className={styles.modernBlogGrid}>
          {pageSlice.slice(0, 3).map((blog, idx) => (
            <ModernBlogCard 
              key={blog._id || blog.id || idx} 
              blog={blog} 
              index={idx}
            />
          ))}
        </div>

        {/* Pagination - Only show if more than 3 blogs */}
        {filteredRows.length > 3 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <Pagination
                  items={allBlogs}
                  countOfPage={3} // Show 3 per page
                  paginatedData={paginatedData}
                  currPage={currPage}
                  setCurrPage={setCurrPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGridArea;
