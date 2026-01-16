/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useMemo, useState } from "react";
import dynamic from 'next/dynamic';
import Wrapper from "@/layout/wrapper";
import HeaderTwo from '@/layout/headers/header-2';
import FashionBanner from '@/components/banner/fashion-banner';
import PopularProducts from '@/components/products/fashion/popular-products';

// ✅ Lazy load below-the-fold components (not immediately visible)
const WeeksFeatured = dynamic(() => import('@/components/products/fashion/weeks-featured'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const BestSellerProducts = dynamic(() => import('@/components/products/fashion/best-seller-products'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const FashionTestimonial = dynamic(() => import('@/components/testimonial/fashion-testimonial'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const BlogArea = dynamic(() => import('@/components/blog/fashion/blog-area'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const FeatureAreaTwo = dynamic(() => import('@/components/features/feature-area-2'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
});

import { FiShare2, FiPhoneCall } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Footer from '@/layout/footers/footer';

// ✅ RTK Query hook
import { useGetOfficeInformationQuery } from "@/redux/features/officeInformationApi";

export default function HomePageTwoClient() {
  const [socialOpen, setSocialOpen] = useState(false);

  // ✅ Fetch office info
  const { data: officeRes } = useGetOfficeInformationQuery();
  const office = officeRes?.data?.[0];

  // ✅ helpers
  const digitsOnly = (v) => String(v || "").replace(/[^\d]/g, "");

  // ✅ WhatsApp + Call from API (with fallbacks)
  const waDigits = digitsOnly(office?.whatsappNumber) || "919999999999";
  const phoneDigits =
    digitsOnly(office?.phone1) ||
    digitsOnly(office?.phone2) ||
    "919999999999";

  const whatsappHref = `https://wa.me/${waDigits}`;
  const callHref = `tel:+${phoneDigits}`;

  // Close on outside click / ESC
  useEffect(() => {
    if (!socialOpen) return;

    const onDocClick = (e) => {
      const root = document.getElementById('social-share-root');
      if (root && e?.target && !root.contains(e.target)) setSocialOpen(false);
    };

    const onEsc = (e) => {
      if (e.key === 'Escape') setSocialOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [socialOpen]);

  // ✅ Social links from API (fallbacks if empty)
  const socialLinks = useMemo(() => {
    const fb = office?.facebookUrl || 'https://facebook.com';
    const ig = office?.instagramUrl || 'https://instagram.com';
    const ln = office?.linkedinUrl || 'https://linkedin.com';
    const yt = office?.youtubeUrl || 'https://youtube.com';
    const tw = office?.xUrl || 'https://twitter.com';

    return [
      { id: 'fb', icon: <FaFacebookF />,  color: '#1877F2', href: fb },
      { id: 'ig', icon: <FaInstagram />,  color: '#E1306C', href: ig },
      { id: 'ln', icon: <FaLinkedinIn />, color: '#0A66C2', href: ln },
      { id: 'yt', icon: <FaYoutube />,    color: '#FF0000', href: yt },
      { id: 'tw', icon: <FaXTwitter />,   color: '#000000', href: tw },
    ];
  }, [office]);

  return (
    <Wrapper>
      <HeaderTwo />

      <FashionBanner />
      <PopularProducts />
      <WeeksFeatured />
             <FeatureAreaTwo />

      <FashionTestimonial />
      <BlogArea />
     
      {/* ✅ WhatsApp button (API number) - LEFT SIDE */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* ✅ Call button (API number) - RIGHT SIDE */}
      <a href={callHref} aria-label="Call us" className="call-float-btn">
        <FiPhoneCall size={24} />
      </a>

      {/* ===== Right-center sticky social — “C” pattern ===== */}
      <div id="social-share-root" className="social-root">
        <button
          id="social-toggle"
          className={`social-toggle ${socialOpen ? 'open' : ''}`}
          aria-label="Share"
          onClick={() => setSocialOpen((v) => !v)}
          title="Share"
          type="button"
        >
          <FiShare2 size={20} />
        </button>

        <ul className={`social-items ${socialOpen ? 'show' : ''}`} aria-hidden={!socialOpen}>
          {socialLinks.map((s) => (
            <li key={s.id} style={{ "--clr": s.color }}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.id} title={s.id}>
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Footer />

      <style jsx>{`
        /* ===== Floating Action Buttons - LEFT & RIGHT ALIGNED ===== */
        .whatsapp-float-btn{
          position: fixed;
          left: 18px;
          bottom: 18px;
          z-index: 1300;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #25D366;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 10px 22px rgba(37,211,102,.34);
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .whatsapp-float-btn:hover{ 
          transform: translateY(-2px); 
          background: #128C7E; 
          color: #fff;
          box-shadow: 0 12px 28px rgba(37,211,102,.4);
        }

        .call-float-btn{
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 1300;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #0ea5e9;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 10px 22px rgba(14,165,233,.34);
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .call-float-btn:hover{ 
          transform: translateY(-2px); 
          background: #0284c7; 
          color: #fff;
          box-shadow: 0 12px 28px rgba(14,165,233,.4);
        }

        /* ===== Social Share Buttons ===== */
        .social-root{
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1200;
          width: 260px;
          height: 260px;
          pointer-events: none;
        }

        .social-toggle{
          pointer-events: auto;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(0deg);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 0;
          background: #111827;
          color: #fff;
          box-shadow: 0 12px 26px rgba(0,0,0,0.24);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform .28s ease, background .18s ease, box-shadow .28s ease;
        }
        .social-toggle:hover{ transform: translateY(-50%) scale(1.04); }
        .social-toggle.open{
          background: #60a5fa;
          color: #0b1b2a;
          transform: translateY(-50%) rotate(45deg) scale(1.02);
        }

        .social-items{
          pointer-events: auto;
          list-style: none;
          padding: 0;
          margin: 0;
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
        }

        .social-items li{
          --size: 44px;
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #fff;
          color: #111827;
          border: 2px solid var(--clr, #60a5fa);
          box-shadow: 0 8px 18px rgba(0,0,0,0.16);
          opacity: 0;
          transform: translate(0,0) scale(.6);
          transition:
            transform 420ms cubic-bezier(.22,.8,.27,1),
            opacity 260ms ease,
            box-shadow .2s ease;
        }
        .social-items li a{
          width: 100%; height: 100%;
          display: grid; place-items: center;
          border-radius: 50%;
          color: #111827; text-decoration: none;
          line-height: 1;
          transition: transform .15s ease, color .15s ease;
        }
        .social-items li svg{ font-size: 18px; }
        .social-items li:hover{ box-shadow: 0 12px 26px rgba(0,0,0,0.22); }
        .social-items li:hover a{ transform: scale(1.06); color: var(--clr, #0ea5e9); }

        .social-items.show li{ opacity: 1; }
        .social-items.show li:nth-child(1){ transition-delay: 40ms; }
        .social-items.show li:nth-child(2){ transition-delay: 80ms; }
        .social-items.show li:nth-child(3){ transition-delay: 120ms; }
        .social-items.show li:nth-child(4){ transition-delay: 160ms; }
        .social-items.show li:nth-child(5){ transition-delay: 200ms; }

        .social-items.show li:nth-child(1){ transform: translate(-110px, -90px)  scale(1); }
        .social-items.show li:nth-child(2){ transform: translate(-150px, -45px)  scale(1); }
        .social-items.show li:nth-child(3){ transform: translate(-170px,   0px)  scale(1); }
        .social-items.show li:nth-child(4){ transform: translate(-150px,  45px)  scale(1); }
        .social-items.show li:nth-child(5){ transform: translate(-110px,  90px)  scale(1); }

        /* ===== Mobile Responsive Adjustments ===== */
        @media (max-width: 768px){
          .whatsapp-float-btn{
            width: 52px;
            height: 52px;
            left: 16px;
            bottom: 16px;
          }
          .call-float-btn{
            width: 52px;
            height: 52px;
            right: 16px;
            bottom: 16px;
          }
          
          .social-root{ right: 16px; width: 230px; height: 230px; }
          .social-toggle{ width: 44px; height: 44px; }
          .social-items li{ --size: 40px; }
          .social-items.show li:nth-child(1){ transform: translate(-95px, -78px)  scale(1); }
          .social-items.show li:nth-child(2){ transform: translate(-130px,-40px)  scale(1); }
          .social-items.show li:nth-child(3){ transform: translate(-145px,  0px)  scale(1); }
          .social-items.show li:nth-child(4){ transform: translate(-130px, 40px)  scale(1); }
          .social-items.show li:nth-child(5){ transform: translate(-95px,  78px)  scale(1); }
        }

        @media (max-width: 480px){
          .whatsapp-float-btn{
            width: 48px;
            height: 48px;
            left: 14px;
            bottom: 14px;
          }
          .call-float-btn{
            width: 48px;
            height: 48px;
            right: 14px;
            bottom: 14px;
          }
          
          .social-root{ right: 12px; width: 210px; height: 210px; }
          .social-toggle{ width: 42px; height: 42px; }
          .social-items li{ --size: 36px; }
          .social-items.show li:nth-child(1){ transform: translate(-86px, -70px) scale(1); }
          .social-items.show li:nth-child(2){ transform: translate(-116px,-36px) scale(1); }
          .social-items.show li:nth-child(3){ transform: translate(-130px,  0px) scale(1); }
          .social-items.show li:nth-child(4){ transform: translate(-116px, 36px) scale(1); }
          .social-items.show li:nth-child(5){ transform: translate(-86px,  70px) scale(1); }
        }
      `}</style>
    </Wrapper>
  );
}
