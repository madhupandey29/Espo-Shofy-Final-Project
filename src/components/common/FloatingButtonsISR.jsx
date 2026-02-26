'use client';

import React, { memo } from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './FloatingButtons.module.scss';

/**
 * ✅ ISR Floating Buttons - No loading delay, uses pre-fetched data
 * Data is fetched on the server and passed as props for instant rendering
 */
const FloatingButtonsISR = memo(({ office = null }) => {
  // Helper function to extract digits only
  const digitsOnly = (v) => String(v || "").replace(/[^\d]/g, "");

  // WhatsApp + Call numbers from pre-fetched office data (with fallbacks)
  const waDigits = digitsOnly(office?.whatsappNumber) || "919999999999";
  const phoneDigits = digitsOnly(office?.phone1) || digitsOnly(office?.phone2) || "919999999999";

  const message = "Hello I am interested in your fabrics";
  const whatsappHref = `https://api.whatsapp.com/send?phone=${waDigits}&text=${encodeURIComponent(message)}`;
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
});

FloatingButtonsISR.displayName = 'FloatingButtonsISR';

export default FloatingButtonsISR;
