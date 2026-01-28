'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetAuthorsQuery } from '@/redux/api/apiSlice';
import { useGetOfficeInformationQuery } from '@/redux/features/officeInformationApi';
import styles from './About.module.scss';

const AboutClient = () => {
  // Get current year for dynamic display
  const currentYear = new Date().getFullYear();

  // Fetch author data from API
  const { data: apiResponse, isLoading: authorLoading, error: authorError } = useGetAuthorsQuery();
  
  // Fetch office information for contact details
  const { data: officeRes } = useGetOfficeInformationQuery();
  const office = officeRes?.data?.[0];

  // Helper function to extract digits only
  const digitsOnly = (v) => String(v || "").replace(/[^\d]/g, "");

  // WhatsApp + Call numbers from API (with fallbacks)
  const waDigits = digitsOnly(office?.whatsappNumber) || "919999999999";
  const phoneDigits = digitsOnly(office?.phone1) || digitsOnly(office?.phone2) || "919999999999";

  const whatsappHref = `https://wa.me/${waDigits}`;
  const callHref = `tel:+${phoneDigits}`;
  
  // Extract authors from API response - Fix the data extraction
  const authors = Array.isArray(apiResponse) ? apiResponse : (apiResponse?.data || []);
  const author = authors?.[0]; // Get the first author

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>Crafting Excellence in Every Thread</h1>
            <p>For over three decades, AGE Fabrics has been at the forefront of fabric innovation, blending timeless craftsmanship with sustainable practices to create textiles that inspire.</p>
            <Link href="/fabric" className={styles.heroBtn}>
              Discover Our Fabrics
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Story Section */}
        <section id="story" className="container">
          <div className={styles.storySection}>
            <div className={styles.storyContent}>
              <h3>Our Fabric Legacy</h3>
              <p>Founded in 1990 by master weaver Eleanor Sterling, AGE Fabrics began as a small atelier dedicated to preserving traditional textile arts. What started as a passion for reviving forgotten weaving techniques has blossomed into a globally recognized fabric house.</p>
              <p>Today, we collaborate with over 200 artisans across three continents, preserving traditional craftsmanship while innovating with sustainable materials and techniques. Our fabrics grace the collections of leading fashion houses and interior designers worldwide.</p>
              <p>Every fabric tells a story – from the silkworms nurtured in sustainable farms to the hands that weave intricate patterns. We believe in fabrics that don't just cover surfaces but transform spaces and experiences.</p>
            </div>
            <div className={styles.storyImage}>
              <Image 
                src="/assets/img/about/about3.jpg" 
                alt="Fabric craftsmanship"
                width={450}
                height={350}
                className={styles.storyImg}
              />
            </div>
          </div>
        </section>

        {/* Success Journey Timeline Section */}
        <section className={styles.journeySection}>
          <div className="container">
            <div className={styles.journeyHeader}>
              <h3>Our Success Journey</h3>
              <p>Key milestones that shaped our fabric legacy</p>
            </div>
            
            <div className={styles.journeyGrid}>
              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>1990</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-seedling"></i>
                </div>
                <h4>The Beginning</h4>
                <p>Started with a small team focused on traditional craftsmanship and quality textiles.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>1995</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-rocket"></i>
                </div>
                <h4>First Breakthrough</h4>
                <p>Launched innovative fabric solutions that revolutionized local textile industry.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>2000</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-cogs"></i>
                </div>
                <h4>Technology Integration</h4>
                <p>Integrated advanced weaving technology while maintaining traditional craftsmanship values.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>2005</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-trophy"></i>
                </div>
                <h4>Industry Recognition</h4>
                <p>Received prestigious awards and expanded to international markets successfully.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>2010</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-leaf"></i>
                </div>
                <h4>Sustainability Focus</h4>
                <p>Pioneered eco-friendly fabric production and sustainable manufacturing processes.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>2015</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-globe"></i>
                </div>
                <h4>Global Expansion</h4>
                <p>Opened offices worldwide and launched sustainability initiatives across operations.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>2020</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-digital-tachograph"></i>
                </div>
                <h4>Digital Innovation</h4>
                <p>Embraced digital transformation with AI-powered design tools and smart manufacturing.</p>
              </div>

              <div className={styles.journeyCard}>
                <div className={styles.cardYear}>{currentYear}</div>
                <div className={styles.cardIcon}>
                  <i className="fas fa-star"></i>
                </div>
                <h4>Present Day</h4>
                <p>Leading the industry with 500+ employees and commitment to excellence and innovation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Director Section */}
        <section className={styles.directorSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.headerLine}></div>
              <h3>Leadership</h3>
              <div className={styles.headerLine}></div>
            </div>
            
            <div className={styles.directorCard}>
              <div className={styles.cardBackground}>
                <div className={styles.patternOverlay}></div>
              </div>
              
              <div className={styles.directorProfile}>
                <div className={styles.imageSection}>
                  <div className={styles.imageContainer}>
                    {authorLoading ? (
                      <div className={styles.imageSkeleton}></div>
                    ) : (
                      <Image 
                        src={author?.authorimage || "/assets/img/blog/founder1.jpg"} 
                        alt={author?.altimage || author?.name || "Director"}
                        width={280}
                        height={320}
                        className={styles.profileImage}
                      />
                    )}
                    <div className={styles.imageFrame}></div>
                  </div>
                  
                  {/* LinkedIn Link - Under image */}
                  {author?.authorLinkedinURL && (
                    <div className={styles.socialLink}>
                      <a 
                        href={author.authorLinkedinURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.linkedinBtn}
                      >
                        <i className="fab fa-linkedin-in"></i>
                        Connect on LinkedIn
                      </a>
                    </div>
                  )}
                </div>
                
                <div className={styles.contentSection}>
                  <div className={styles.profileHeader}>
                    {authorLoading ? (
                      <>
                        <div className={styles.nameSkeleton}></div>
                        <div className={styles.positionSkeleton}></div>
                      </>
                    ) : (
                      <>
                        <h4>{author?.name || 'Rajesh Goyal'}</h4>
                        <p className={styles.position}>{author?.designation || 'Director'} & Founder</p>
                      </>
                    )}
                    <div className={styles.experience}>
                      <span className={styles.years}>25+</span>
                      <span className={styles.label}>Years Experience</span>
                    </div>
                  </div>
                  
                  <div className={styles.profileContent}>
                    <blockquote className={styles.quote}>
                      "Excellence in textiles comes from passion, precision, and unwavering commitment to quality. At AGE Fabrics, we don't just create products—we craft legacies."
                    </blockquote>
                    
                    {authorLoading ? (
                      <div className={styles.descriptionSkeleton}></div>
                    ) : (
                      <p className={styles.description}>
                        {author?.description || 
                        `Leading AGE Fabrics with a vision rooted in traditional craftsmanship and modern innovation. ${author?.name || 'Rajesh Goyal'} has transformed the company into a trusted name in premium textiles, serving clients worldwide with uncompromising quality and sustainable practices.`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="container">
          <div className={styles.sectionTitle}>
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do at AGE Fabrics</p>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-leaf"></i>
              </div>
              <h4>Sustainable Craft</h4>
              <p>We source eco-friendly materials and implement zero-waste production methods to minimize our environmental footprint.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-award"></i>
              </div>
              <h4>Artisan Excellence</h4>
              <p>Each fabric is crafted by skilled artisans who bring generations of knowledge to every weave, stitch, and pattern.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-handshake"></i>
              </div>
              <h4>Ethical Partnership</h4>
              <p>We maintain fair-trade practices, ensuring our artisans receive fair compensation and work in safe environments.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <i className="fas fa-lightbulb"></i>
              </div>
              <h4>Timeless Innovation</h4>
              <p>While honoring tradition, we continuously innovate with new techniques and sustainable fabric technologies.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h3>Experience Our Fabric Collections</h3>
              <p>Discover the perfect fabric for your next project. Request a sample kit or schedule a consultation with our fabric experts.</p>
              <div className={styles.buttonGroup}>
                <a 
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  Request Samples
                </a>
                <a 
                  href={callHref}
                  className={styles.btn}
                >
                  Talk to Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutClient;