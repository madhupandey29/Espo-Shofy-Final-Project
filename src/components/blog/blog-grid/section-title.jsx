import React from 'react';
import styles from './ModernBlog.module.scss';

const SectionTitle = () => {
  return (
    <section className={styles.modernBlogHero}>
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
  );
};

export default SectionTitle;
