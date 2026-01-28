'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthorProfile from '../author/AuthorProfile';
import PostboxDetailsNav from './postbox-details-nav';
import styles from './BlogDetails.module.scss';

const fmt = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

// Calculate reading time based on content
const calculateReadingTime = (content) => {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// convenience: render raw HTML or empty
const html = (s) => ({ __html: s || '' });

const BlogDetailsArea = ({ blog }) => {
  const sidebarRef = useRef(null);

  // No sticky behavior - sidebar scrolls normally with content

  // Handle case when blog is null or undefined
  if (!blog) {
    return (
      <section className={styles.blogDetailsArea}>
        <div className={styles.container}>
          <div className="text-center">
            <h2>Blog not found</h2>
            <p>The requested blog post could not be found.</p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate total reading time
  const totalContent = (blog?.paragraph1 || '') + (blog?.paragraph2 || '') + (blog?.paragraph3 || '');
  const readingTime = blog?.readingTimeMin || calculateReadingTime(totalContent);
  
  // Format published date
  const publishedDate = fmt(blog?.publishedAt || blog?.createdAt);
  const author = blog?.assignedUserName || blog?.author || 'Admin';

  // Handle images
  const heroImage = blog?.blogimage1;
  const inlineImage = blog?.blogimage2;

  // Split content for proper flow: title → some content → image → rest of content
  const paragraph1Content = blog?.paragraph1 || '';
  const paragraph2Content = blog?.paragraph2 || '';
  const paragraph3Content = blog?.paragraph3 || '';

  return (
    <section className={styles.blogDetailsArea}>
      <div className={styles.container}>
        {/* Hero Section with "Explore our blogs" - Same as Blog Page */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>Explore our blogs</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <Link href="/blog" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Main Content */}
          <div className={styles.blogContent}>
            {/* Main Title */}
            <h1 className={styles.blogTitle}>
              {blog?.title?.replace(/<[^>]*>/g, '') || 'Blog Post'}
            </h1>

            {/* Meta Information - Simple with Share */}
            <div className={styles.blogMeta}>
              <span>{publishedDate} • By {author} • {readingTime} min read • {blog?.category || 'Blog'}</span>
              <button 
                className={styles.shareIcon}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: blog?.title?.replace(/<[^>]*>/g, '') || 'Blog Post',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                title="Share this article"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
            </div>

            {/* CONTENT FLOW: Image1 → Introduction → Image2 → Content → Conclusion */}
            
            {/* First Image - Before Introduction */}
            {heroImage ? (
              <div className={styles.heroImageContainer}>
                <Image
                  src={heroImage}
                  alt={blog?.title?.replace(/<[^>]*>/g, '') || 'Blog image'}
                  width={800}
                  height={450}
                  className={styles.heroImage}
                  priority
                />
              </div>
            ) : (
              <div className={styles.heroImageContainer}>
                <Image
                  src="/assets/img/blog/blog-big-2.jpg"
                  alt="Sample blog image 1"
                  width={800}
                  height={450}
                  className={styles.heroImage}
                  priority
                />
                <div className={styles.imagePlaceholderOverlay}>
                  <span>Placeholder for blogimage1 (first image)</span>
                </div>
              </div>
            )}

            {/* First part of content (Introduction) */}
            {paragraph1Content && (
              <div dangerouslySetInnerHTML={html(paragraph1Content)} />
            )}

            {/* Second Image - Before paragraph2 */}
            {inlineImage ? (
              <div className={styles.inlineImageContainer}>
                <Image
                  src={inlineImage}
                  alt="Article illustration"
                  width={800}
                  height={400}
                  className={styles.inlineImage}
                />
              </div>
            ) : paragraph2Content && (
              <div className={styles.inlineImageContainer}>
                <Image
                  src="/assets/img/blog/blog-big-3.jpg"
                  alt="Sample blog image 2"
                  width={800}
                  height={400}
                  className={styles.inlineImage}
                />
                <div className={styles.imagePlaceholderOverlay}>
                  <span>Placeholder for blogimage2 (second image)</span>
                </div>
              </div>
            )}

            {/* Second part of content */}
            {paragraph2Content && (
              <div dangerouslySetInnerHTML={html(paragraph2Content)} />
            )}

            {/* Third part of content */}
            {paragraph3Content && (
              <div dangerouslySetInnerHTML={html(paragraph3Content)} />
            )}

            {/* Quote Block - Simple */}
            <div className={styles.quoteBlock}>
              "Quality is not an act, it is a habit. Excellence in textile manufacturing 
              comes from consistent dedication to superior materials and processes."
              <br />— {author}
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
              <PostboxDetailsNav currentId={blog?.id || blog?._id} />
            </div>
          </div>

          {/* Clean Sidebar */}
          <div className={styles.sidebar} ref={sidebarRef}>
            {/* Author Section - First in Sidebar */}
            <div className={styles.authorSidebarSection}>
              <AuthorProfile 
                authorId={blog?.assignedUserId} 
                showSignature={true}
                className={styles.authorProfile}
              />
            </div>

            {/* Popular Tags - Simple */}
            <div className={styles.popularTagsCard}>
              <h3 className={styles.cardTitle}>Popular Tags</h3>
              <div className={styles.tagsList}>
                {['Textiles', 'Sustainability', 'Fabric Trends', 'Design', 'Innovation', 'AmritaGlobal', 'Manufacturing', 'Quality'].map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/blog?tag=${tag.toLowerCase()}`} 
                    className={styles.tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;