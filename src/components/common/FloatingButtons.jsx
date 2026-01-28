'use client';

import React, { useState, useEffect } from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './FloatingButtons.module.scss';

const FloatingButtons = () => {
  const [office, setOffice] = useState(null);

  // Fetch office info for contact numbers
  useEffect(() => {
    const fetchOfficeInfo = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE}/companyinformation`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            // Get filter value from environment variable
            const companyFilter = process.env.NEXT_PUBLIC_COMPANY_FILTER;
            
            if (companyFilter) {
              // Find exact match
              const targetCompany = data.data.find(company => company.name === companyFilter);
              setOffice(targetCompany || data.data[0]);
            } else {
              setOffice(data.data[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching office info:', error);
      }
    };

    fetchOfficeInfo();
  }, []);

  // Helper function to extract digits only
  const digitsOnly = (v) => String(v || "").replace(/[^\d]/g, "");

  // WhatsApp + Call numbers from API (with fallbacks)
  const waDigits = digitsOnly(office?.whatsappNumber) || "919999999999";
  const phoneDigits = digitsOnly(office?.phone1) || digitsOnly(office?.phone2) || "919999999999";

  const whatsappHref = `https://wa.me/${waDigits}`;
  const callHref = `tel:+${phoneDigits}`;

  return (
    <>
      {/* WhatsApp button (left side) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* Call button (right side) */}
      <a 
        href={callHref} 
        aria-label="Call us" 
        className={styles.callBtn}
      >
        <FiPhoneCall size={24} />
      </a>
    </>
  );
};

export default FloatingButtons;