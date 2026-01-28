/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useMemo, useState } from "react";
import dynamic from 'next/dynamic';
import Wrapper from "@/layout/wrapper";
import HeaderTwo from '@/layout/headers/header-2';
import FashionBanner from '@/components/banner/fashion-banner';

// ✅ Lazy load ALL below-the-fold components for mobile performance
const PopularProducts = dynamic(() => import('@/components/products/fashion/popular-products'), {
  loading: () => <div style={{ minHeight: '500px' }} />,
});
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
const Footer = dynamic(() => import('@/layout/footers/footer'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

import { FiShare2 } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// ✅ RTK Query hook
import { useGetOfficeInformationQuery } from "@/redux/features/officeInformationApi";

// ✅ Floating Chatbot
const FloatingChatbot = dynamic(() => import('@/components/chatbot/FloatingChatbot'), {
  ssr: false,
  loading: () => null,
});

export default function HomePageTwoClient() {
  const [socialOpen, setSocialOpen] = useState(false);

  // Check if it's mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Fetch office info
  const { data: officeRes } = useGetOfficeInformationQuery();
  const office = officeRes?.data?.[0];

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

      {/* ===== Share Button - Center Right ===== */}
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
          {socialLinks.map((s, index) => {
            const iconSize = isMobile ? (window.innerWidth <= 480 ? '38px' : '42px') : '48px';
            const borderWidth = isMobile ? '2px' : '3px';
            const fontSize = isMobile ? (window.innerWidth <= 480 ? '16px' : '18px') : '22px';
            
            // Desktop positioning
            const desktopPositions = [
              'translate(-120px, -100px) scale(1)',
              'translate(-160px, -50px) scale(1)', 
              'translate(-180px, 0px) scale(1)',
              'translate(-160px, 50px) scale(1)',
              'translate(-120px, 100px) scale(1)'
            ];
            
            // Mobile positioning
            const mobilePositions = window.innerWidth <= 480 ? [
              'translate(-90px, -75px) scale(1)',
              'translate(-120px, -38px) scale(1)',
              'translate(-135px, 0px) scale(1)', 
              'translate(-120px, 38px) scale(1)',
              'translate(-90px, 75px) scale(1)'
            ] : [
              'translate(-100px, -85px) scale(1)',
              'translate(-135px, -42px) scale(1)',
              'translate(-150px, 0px) scale(1)',
              'translate(-135px, 42px) scale(1)', 
              'translate(-100px, 85px) scale(1)'
            ];
            
            const positions = isMobile ? mobilePositions : desktopPositions;
            
            return (
              <li 
                key={s.id} 
                style={{ 
                  "--clr": s.color,
                  position: 'absolute',
                  width: iconSize,
                  height: iconSize,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: s.color,
                  color: '#fff',
                  border: `${borderWidth} solid #fff`,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                  opacity: socialOpen ? 1 : 0,
                  visibility: socialOpen ? 'visible' : 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transitionDelay: `${(index + 1) * 40}ms`,
                  transform: socialOpen ? positions[index] : 'translate(0,0) scale(0.6)',
                  cursor: 'pointer',
                  zIndex: 1600
                }}
                onMouseEnter={(e) => {
                  if (socialOpen) {
                    e.target.style.transform = positions[index].replace('scale(1)', 'scale(1.15)');
                  }
                }}
                onMouseLeave={(e) => {
                  if (socialOpen) {
                    e.target.style.transform = positions[index];
                  }
                }}
              >
                <a 
                  href={s.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={s.id} 
                  title={s.id}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: fontSize
                  }}
                >
                  {s.icon}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
     
      <Footer />

      {/* ✅ Floating Chatbot */}
      <FloatingChatbot />

      <style jsx>{`
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
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--clr, #60a5fa);
          color: #fff;
          border: 2px solid #fff;
          box-shadow: 0 8px 18px rgba(0,0,0,0.16);
          opacity: 0;
          transform: translate(0,0) scale(.6);
          transition:
            transform 420ms cubic-bezier(.22,.8,.27,1),
            opacity 260ms ease,
            box-shadow .2s ease;
        }
        .social-items li a{
          width: 100%; 
          height: 100%;
          display: flex; 
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #fff; 
          text-decoration: none;
          line-height: 1;
          transition: transform .15s ease, color .15s ease;
        }
        .social-items li svg{ 
          font-size: 20px; 
          width: 20px;
          height: 20px;
          color: #fff;
          fill: currentColor;
        }
        .social-items li:hover{ 
          box-shadow: 0 12px 26px rgba(0,0,0,0.22); 
          transform: scale(1.1);
        }
        .social-items li:hover a{ 
          transform: scale(1.06); 
          color: #fff;
        }

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

        /* ===== Desktop Specific Improvements ===== */
        @media (min-width: 769px) {
          .social-root{ 
            right: 24px; 
            width: 280px; 
            height: 280px; 
            z-index: 1500;
          }
          .social-toggle{ 
            width: 52px; 
            height: 52px; 
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          }
          .social-toggle:hover{ 
            transform: translateY(-50%) scale(1.08); 
            box-shadow: 0 12px 28px rgba(0,0,0,0.4);
          }
          .social-items li{ 
            --size: 48px; 
            border: 3px solid #fff;
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            background: var(--clr) !important;
            color: #fff !important;
          }
          .social-items li a{
            color: #fff !important;
          }
          .social-items li svg{ 
            font-size: 22px !important; 
            width: 22px !important;
            height: 22px !important;
            color: #fff !important;
            fill: #fff !important;
          }
          .social-items li:hover{
            transform: scale(1.15) !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.35) !important;
          }
          .social-items li:hover a{
            color: #fff !important;
          }
          .social-items.show li:nth-child(1){ transform: translate(-120px, -100px) scale(1) !important; }
          .social-items.show li:nth-child(2){ transform: translate(-160px, -50px)  scale(1) !important; }
          .social-items.show li:nth-child(3){ transform: translate(-180px,   0px)  scale(1) !important; }
          .social-items.show li:nth-child(4){ transform: translate(-160px,  50px)  scale(1) !important; }
          .social-items.show li:nth-child(5){ transform: translate(-120px, 100px)  scale(1) !important; }
          
          .social-items.show li:hover:nth-child(1){ transform: translate(-120px, -100px) scale(1.15) !important; }
          .social-items.show li:hover:nth-child(2){ transform: translate(-160px, -50px)  scale(1.15) !important; }
          .social-items.show li:hover:nth-child(3){ transform: translate(-180px,   0px)  scale(1.15) !important; }
          .social-items.show li:hover:nth-child(4){ transform: translate(-160px,  50px)  scale(1.15) !important; }
          .social-items.show li:hover:nth-child(5){ transform: translate(-120px, 100px)  scale(1.15) !important; }
        }

        /* ===== Mobile Responsive Adjustments ===== */
        @media (max-width: 768px){
          .social-root{ right: 16px; width: 240px; height: 240px; }
          .social-toggle{ width: 46px; height: 46px; }
          .social-items li{ 
            --size: 42px; 
            border: 2px solid #fff;
          }
          .social-items li svg{ 
            font-size: 18px; 
            width: 18px;
            height: 18px;
          }
          .social-items.show li:nth-child(1){ transform: translate(-100px, -85px)  scale(1); }
          .social-items.show li:nth-child(2){ transform: translate(-135px, -42px)  scale(1); }
          .social-items.show li:nth-child(3){ transform: translate(-150px,   0px)  scale(1); }
          .social-items.show li:nth-child(4){ transform: translate(-135px,  42px)  scale(1); }
          .social-items.show li:nth-child(5){ transform: translate(-100px,  85px)  scale(1); }
        }

        @media (max-width: 480px){
          .social-root{ right: 12px; width: 220px; height: 220px; }
          .social-toggle{ width: 44px; height: 44px; }
          .social-items li{ 
            --size: 38px; 
            border: 2px solid #fff;
          }
          .social-items li svg{ 
            font-size: 16px; 
            width: 16px;
            height: 16px;
          }
          .social-items.show li:nth-child(1){ transform: translate(-90px, -75px) scale(1); }
          .social-items.show li:nth-child(2){ transform: translate(-120px, -38px) scale(1); }
          .social-items.show li:nth-child(3){ transform: translate(-135px,   0px) scale(1); }
          .social-items.show li:nth-child(4){ transform: translate(-120px,  38px) scale(1); }
          .social-items.show li:nth-child(5){ transform: translate(-90px,   75px) scale(1); }
        }
      `}</style>
    </Wrapper>
  );
}