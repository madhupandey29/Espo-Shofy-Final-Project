/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import WrapperISR from "@/layout/wrapper-isr";
import HeaderTwoISR from "@/layout/headers/header-2-isr";
import FashionBanner from "@/components/banner/fashion-banner";
import PopularProducts from "@/components/products/fashion/popular-products";
import WeeksFeatured from "@/components/products/fashion/weeks-featured";
import FashionTestimonial from "@/components/testimonial/fashion-testimonial";
import BlogArea from "@/components/blog/fashion/blog-area";
import FeatureAreaTwo from "@/components/features/feature-area-2";
import Footer from "@/layout/footers/footer-isr";

import { FiShare2 } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FloatingButtonsISR from "@/components/common/FloatingButtonsISR";

export default function HomePageTwoClient({ office = null, popularProducts = [], featuredProducts = [] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // close on outside click / ESC
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e) => {
      const root = document.getElementById("age-social-share-root");
      if (root && e?.target && !root.contains(e.target)) setOpen(false);
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const links = useMemo(() => {
    const fb = office?.facebookUrl || "https://facebook.com";
    const ig = office?.instagramUrl || "https://instagram.com";
    const ln = office?.linkedinUrl || "https://linkedin.com";
    const yt = office?.youtubeUrl || "https://youtube.com";
    const tw = office?.xUrl || "https://twitter.com";

    return [
      { id: "fb", icon: <FaFacebookF />, color: "#1877F2", href: fb },
      { id: "ig", icon: <FaInstagram />, color: "#E1306C", href: ig },
      { id: "ln", icon: <FaLinkedinIn />, color: "#0A66C2", href: ln },
      { id: "yt", icon: <FaYoutube />, color: "#FF0000", href: yt },
      { id: "tw", icon: <FaXTwitter />, color: "#000000", href: tw },
    ];
  }, [office]);

  return (
    <WrapperISR>
      <HeaderTwoISR />

      <FashionBanner />
      
      <PopularProducts products={popularProducts} />
      <WeeksFeatured products={featuredProducts} />
      
      <FeatureAreaTwo />
      <FashionTestimonial />
      <BlogArea />

      {/* ✅ ISR Floating Buttons with pre-fetched office data */}
      <FloatingButtonsISR office={office} />

      {/* ✅ Social Share (Portal + unique class names) */}
      {mounted &&
        createPortal(
          <div id="age-social-share-root" className="age-social-root">
            <button
              type="button"
              className={`age-social-toggle ${open ? "is-open" : ""}`}
              aria-label="Share"
              title="Share"
              onClick={() => setOpen((v) => !v)}
            >
              <FiShare2 size={20} />
            </button>

            <ul className={`age-social-items ${open ? "show" : ""}`} aria-hidden={!open}>
              {links.map((s, i) => (
                <li
                  key={s.id}
                  className="age-social-item"
                  style={{
                    background: s.color,
                    "--d": `${i * 70}ms`, // ✅ stagger delay (reliable)
                  }}
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.id}
                    title={s.id}
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}

      <Footer office={office} />
    </WrapperISR>
  );
}
