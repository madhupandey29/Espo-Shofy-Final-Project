'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaBriefcase,
  FaLeaf,
  FaAward,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaGraduationCap
} from 'react-icons/fa';
import { useGetOfficeInformationQuery } from '@/redux/features/officeInformationApi';
import styles from './Careers.module.scss';

const CareersClient = () => {
  const { data: officeRes } = useGetOfficeInformationQuery();
  const office = officeRes?.data?.[0];

  const digitsOnly = (v) => String(v || "").replace(/[^\d]/g, "");
  const waDigits = digitsOnly(office?.whatsappNumber) || "919999999999";
  const phoneDigits = digitsOnly(office?.phone1) || digitsOnly(office?.phone2) || "919999999999";

  const whatsappHref = `https://wa.me/${waDigits}`;
  const callHref = `tel:+${phoneDigits}`;

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Textile Designer",
      department: "Design",
      location: "Ahmedabad, India",
      type: "Full-time",
      description: "Create innovative fabric designs and patterns for our premium textile collections.",
    },
    {
      id: 2,
      title: "Quality Control Manager",
      department: "Production",
      location: "Ahmedabad, India",
      type: "Full-time",
      description: "Ensure the highest quality standards across all manufacturing processes.",
    },
    {
      id: 3,
      title: "Export Sales Executive",
      department: "Sales",
      location: "Ahmedabad, India",
      type: "Full-time",
      description: "Drive international sales and build relationships with global clients.",
    },
    {
      id: 4,
      title: "Sustainability Coordinator",
      department: "Operations",
      location: "Ahmedabad, India",
      type: "Full-time",
      description: "Lead our sustainability initiatives and eco-friendly manufacturing practices.",
    },
  ];

  const benefits = [
    {
      icon: <FaBriefcase />,
      title: "Competitive Salary",
      description: "Industry-leading compensation packages",
    },
    {
      icon: <FaUsers />,
      title: "Health Benefits",
      description: "Comprehensive health insurance for you and your family",
    },
    {
      icon: <FaGraduationCap />,
      title: "Learning & Development",
      description: "Continuous training and skill development programs",
    },
    {
      icon: <FaLeaf />,
      title: "Work-Life Balance",
      description: "Flexible working hours and paid time off",
    },
    {
      icon: <FaAward />,
      title: "Career Growth",
      description: "Clear career progression paths and opportunities",
    },
    {
      icon: <FaHandshake />,
      title: "Global Exposure",
      description: "Work with international clients and teams",
    },
  ];

  return (
    <div className={styles.careersPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>Join Our Team</h1>
            <p>Build your career with a leading textile manufacturer committed to innovation, sustainability, and excellence.</p>
            <a href="#openings" className={styles.heroBtn}>
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Why Join Us Section */}
        <section className="container">
          <div className={styles.sectionTitle}>
            <h2>Why Work With Us?</h2>
            <p>We believe in empowering our team members to reach their full potential</p>
          </div>
          <div className={styles.valuesGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  {benefit.icon}
                </div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Openings Section */}
        <section id="openings" className={styles.jobsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.headerLine}></div>
              <h3>Current Openings</h3>
              <div className={styles.headerLine}></div>
            </div>
            
            <div className={styles.jobsList}>
              {jobOpenings.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <h4>{job.title}</h4>
                    <span className={styles.jobDepartment}>{job.department}</span>
                  </div>
                  <p className={styles.jobDescription}>{job.description}</p>
                  <div className={styles.jobMeta}>
                    <span className={styles.jobMetaItem}>
                      <FaMapMarkerAlt />
                      {job.location}
                    </span>
                    <span className={styles.jobMetaItem}>
                      <FaClock />
                      {job.type}
                    </span>
                  </div>
                  <Link href="/contact" className={styles.jobApplyBtn}>
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h3>Don't See the Right Role?</h3>
              <p>We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.</p>
              <div className={styles.buttonGroup}>
                <a 
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  Contact Us
                </a>
                <a 
                  href={callHref}
                  className={styles.btn}
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareersClient;
