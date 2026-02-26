'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import useSticky from '@/hooks/use-sticky';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Menus from '@/layout/headers/header-com/menus';
import OffCanvas from '@/components/common/off-canvas';
import { Search } from '@/svg';

// Search component that uses useSearchParams
function SearchSync({ searchQuery, setSearchQuery }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQuery = searchParams.get('q') || searchParams.get('searchText') || '';
    if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

// ISR-compatible Header (no Redux, no cart, no wishlist)
// Used for public pages that need ISR
const HeaderTwoISR = ({ style_2 = false }) => {
  const { sticky } = useSticky();
  const router = useRouter();

  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchInputRef = useRef(null);

  const clearSearch = () => {
    setSearchQuery('');
    setMobileSearchOpen(false);
    router.push('/fabric');
  };

  const goToPage = (href) => {
    try {
      window.scrollTo?.(0, 0);
    } catch (error) {
      console.error('Failed to scroll:', error);
    }
    router.push(href);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    goToPage(`/fabric?q=${encodeURIComponent(q)}`);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit(e);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchSync searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </Suspense>
      
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
          <div
            id="header-sticky"
            className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}
          >
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center mobile-header-row">
                  
                  {/* Mobile: Hamburger + Logo */}
                  <div className="col-xl-2 col-lg-2 col-md-3 col-6 d-xl-none mobile-left-section">
                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                      <button
                        onClick={() => setIsCanvasOpen(true)}
                        type="button"
                        className="tp-offcanvas-open-btn mobile-menu-btn"
                        aria-label="Open menu"
                      >
                        <FiMenu />
                      </button>
                      
                      <Link href="/" className="d-flex align-items-center mobile-logo-link">
                        <Image
                          src="/assets/img/logo/age.jpg"
                          alt="Company Logo"
                          width={180}
                          height={56}
                          priority
                          quality={90}
                          sizes="(max-width: 600px) 130px, (max-width: 768px) 150px, 180px"
                          style={{ height: 'auto', width: 'auto' }}
                          className="header-logo mobile-logo"
                        />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Desktop: Logo */}
                  <div className="col-xl-2 col-lg-2 col-md-3 d-none d-xl-block">
                    <div className="logo d-flex align-items-center">
                      <Link href="/" className="d-flex align-items-center">
                        <Image
                          src="/assets/img/logo/age.jpg"
                          alt="Company Logo"
                          width={180}
                          height={56}
                          priority
                          quality={90}
                          sizes="180px"
                          style={{ height: 'auto', width: 'auto', maxWidth: '180px', maxHeight: '56px' }}
                          className="header-logo"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Centered Menu - Desktop Only */}
                  <div className="d-none d-xl-block col-xl-6">
                    <div className="main-menu menu-style-2 text-center">
                      <nav className="tp-main-menu-content d-flex justify-content-center">
                        <Menus />
                      </nav>
                    </div>
                  </div>

                  {/* Right side - Search + Sign In */}
                  <div className="col-xl-4 col-lg-10 col-md-9 col-6">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end header-right">

                      {/* Desktop Search */}
                      <div className="tp-header-search-2 d-none d-lg-block me-3 search-wrap">
                        <form onSubmit={onSearchSubmit} className="search-form">
                          <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={onSearchKeyDown}
                            type="text"
                            placeholder="Search for Fabric..."
                            aria-label="Search fabric"
                            autoComplete="off"
                            spellCheck={false}
                            inputMode="search"
                            maxLength={200}
                            className={`search-input ${searchQuery.trim() ? 'has-clear' : ''}`}
                          />

                          {searchQuery.trim() && (
                            <button
                              type="button"
                              className="search-clear"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearSearch();
                              }}
                              aria-label="Clear search"
                            >
                              Clear Search
                            </button>
                          )}

                          <button type="submit" className="search-submit" aria-label="Search">
                            <Search />
                          </button>
                        </form>
                      </div>

                      {/* Mobile Search */}
                      <div className={`tp-header-search-mobile d-lg-none ${mobileSearchOpen ? 'expanded' : ''}`}>
                        {mobileSearchOpen && (
                          <form onSubmit={onSearchSubmit} className="mobile-search-form">
                            <input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={onSearchKeyDown}
                              type="text"
                              placeholder="Search fabric..."
                              aria-label="Search fabric"
                              autoComplete="off"
                              className="mobile-search-input"
                              autoFocus
                            />
                            <button
                              type="button"
                              className="mobile-search-close"
                              onClick={() => {
                                clearSearch();
                                setMobileSearchOpen(false);
                              }}
                              aria-label="Close search"
                            >
                              Clear
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="tp-header-action d-flex align-items-center header-actions">
                        {/* Mobile Search Icon */}
                        <div className="tp-header-action-item d-lg-none">
                          <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="tp-header-action-btn"
                            aria-label="Toggle search"
                            type="button"
                          >
                            <Search />
                          </button>
                        </div>

                        {/* Sign In Button */}
                        <div className="tp-header-action-item">
                          <button
                            type="button"
                            className="tp-header-action-btn signin-btn"
                            aria-label="Sign in"
                            onClick={() => router.push('/login')}
                          >
                            <FaUser className="signin-icon" />
                            <span className="signin-text">Sign in</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />

      <style jsx>{`
        /* Reuse same styles as header-2 */
        #header-sticky {
          z-index: 1020;
        }

        #header-sticky.header-sticky {
          position: fixed !important;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 1020;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .header-right {
          gap: 10px;
        }

        .header-actions {
          gap: 8px;
        }

        .tp-header-action-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
          padding: 0;
          transition: all 0.2s ease;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }

        .tp-header-action-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        :global(.signin-btn.signin-btn) {
          width: auto !important;
          min-width: 44px;
          height: 40px !important;
          padding: 0 18px !important;
          gap: 8px;
          background: #ffffff !important;
          border: 1px solid #2C4C97 !important;
          color: #2C4C97 !important;
          transition: all 0.3s ease;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 8px !important;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(44, 76, 151, 0.1);
          margin-left: 4px;
        }

        :global(.signin-btn.signin-btn:hover) {
          background: #f8fafc !important;
          border-color: #1e3a7a !important;
          color: #1e3a7a !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 76, 151, 0.2);
        }

        :global(.signin-icon) {
          width: 16px !important;
          height: 16px !important;
          flex-shrink: 0;
          color: #2C4C97 !important;
        }

        :global(.signin-text) {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #2C4C97 !important;
          white-space: nowrap;
          line-height: 1.4;
        }

        .search-wrap {
          position: relative;
          z-index: 10;
          flex: 0 1 auto;
          min-width: 180px;
          max-width: 280px;
        }

        .search-form {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #0f172a;
          font-size: 13px;
          padding: 0 42px 0 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input.has-clear {
          padding-right: 110px;
        }

        .search-input:focus {
          border-color: #2C4C97;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(44, 76, 151, 0.1);
        }

        .search-submit {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          height: 30px;
          width: 30px;
          border: 0;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          z-index: 2;
          color: #6b7280;
        }

        .search-submit:hover {
          color: #2C4C97;
        }

        .search-clear {
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          height: 26px;
          padding: 0 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          z-index: 2;
        }

        .search-clear:hover {
          color: #111827;
          background: #f3f4f6;
        }

        .mobile-menu-btn {
          width: 36px !important;
          height: 36px !important;
          border: 1px solid #e5e7eb;
          background: #f3f4f6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          color: #0f172a;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: #e5e7eb;
        }

        @media (max-width: 575px) {
          .tp-header-action-btn {
            width: 36px !important;
            height: 36px !important;
          }

          :global(.signin-btn) {
            width: auto !important;
            min-width: 80px !important;
            height: 36px !important;
            padding: 0 12px !important;
          }

          :global(.signin-text) {
            font-size: 13px !important;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderTwoISR;
