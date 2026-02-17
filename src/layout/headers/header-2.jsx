'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';

import { fetch_cart_products } from '@/redux/features/cartSlice';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import OffCanvas from '@/components/common/off-canvas';
import Menus from './header-com/menus';

import { CartTwo, Search } from '@/svg';
import { FaHeart, FaUser } from 'react-icons/fa';
import { useGetSessionInfoQuery } from '@/redux/features/auth/authApi';
import { FiMenu } from 'react-icons/fi';

/* =========================
   Helpers
========================= */

const selectUserIdFromStore = (state) =>
  state?.auth?.user?._id ||
  state?.auth?.user?.id ||
  state?.auth?.userInfo?._id ||
  state?.auth?.userInfo?.id ||
  state?.user?.user?._id ||
  null;

/** ✅ SECURE: Avatar fetch - fetches ONLY the specific user by ID */
const SHOPY_API_BASE = 'https://espobackend.vercel.app/api';
async function fetchUserAvatarById(userId, signal) {
  if (!userId) return null;
  try {
    // Fetch ONLY this specific user by ID
    const res = await fetch(`${SHOPY_API_BASE}/customeraccount/${userId}`, {
      method: 'GET',
      credentials: 'include',
      signal,
    });
    if (!res.ok) return null;
    
    const json = await res.json();
    const currentUser = json.data || json;
    
    if (!currentUser) return null;
    
    // Return user image from EspoCRM user object
    const url = currentUser.userImage || currentUser.avatarUrl || currentUser.avatar || null;
    return typeof url === 'string' && url.trim() ? url.trim() : null;
  } catch {
    return null;
  }
}

const HeaderTwo = ({ style_2 = false }) => {
  const dispatch = useDispatch();
  const { sticky } = useSticky();
  const router = useRouter();
  const pathname = usePathname();

  // ===== user / wishlist =====
  const reduxUserId = useSelector(selectUserIdFromStore);
  const [fallbackUserId, setFallbackUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = window.localStorage.getItem('userId');
      if (uid) setFallbackUserId(uid);
    }
  }, []);

  const userId = reduxUserId || fallbackUserId || null;

  const { wishlist } = useSelector((s) => s.wishlist || { wishlist: [] });
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  // ===== cart count =====
  const { quantity: cartCount } = useCartInfo();
  const distinctCount = cartCount ?? 0;

  useEffect(() => {
    if (userId) dispatch(fetch_cart_products({ userId }));
  }, [dispatch, userId]);

  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);

  // ===== SEARCH =====
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const desktopSearchWrapRef = useRef(null);
  const mobileSearchWrapRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchParams = useSearchParams();

  // Sync search input with URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q') || searchParams.get('searchText') || '';
    if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const clearSearch = () => {
    setSearchQuery('');
    setMobileSearchOpen(false);
    router.push('/fabric');
  };

  const goToPage = (href) => {
    try { window.scrollTo?.(0, 0); } catch {}
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

  // ===== Session & user dropdown =====
  const [hasSession, setHasSession] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const userBtnRef = useRef(null);
  const userMenuRef = useRef(null);

  const { data: userData } = useGetSessionInfoQuery(
    { userId },
    { skip: !userId, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (userData?.user?.userImage) setUserImage(userData.user.userImage);
    else if (userData?.user?.avatar) setUserImage(userData.user.avatar);
  }, [userData]);

  useEffect(() => {
    if (!userId) return;
    if (userImage && typeof userImage === 'string' && userImage.trim()) return;

    const controller = new AbortController();
    fetchUserAvatarById(userId, controller.signal).then((url) => {
      if (url) setUserImage(url);
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const check = () => {
      const lsHasSessionId = typeof window !== 'undefined' && !!window.localStorage.getItem('sessionId');
      const lsHasUserId = typeof window !== 'undefined' && !!window.localStorage.getItem('userId');
      setHasSession(lsHasSessionId || lsHasUserId);
    };
    check();
    const onStorage = (e) => {
      if (e.key === 'sessionId' || e.key === 'userId') check();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const close = () => setUserOpen(false);
    const onPointer = (e) => {
      const btn = userBtnRef.current;
      const menu = userMenuRef.current;
      const t = e.target;
      if (!t) return;
      if (btn?.contains(t) || menu?.contains(t)) return;
      close();
    };
    const onEsc = (e) => { if (e.key === 'Escape') close(); };
    const onScroll = () => close();
    const onResize = () => close();
    const onVisibility = () => { if (document.visibilityState === 'hidden') close(); };

    if (userOpen) {
      document.addEventListener('mousedown', onPointer, true);
      document.addEventListener('touchstart', onPointer, true);
      document.addEventListener('keydown', onEsc);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVisibility);
    }
    return () => {
      document.removeEventListener('mousedown', onPointer, true);
      document.removeEventListener('touchstart', onPointer, true);
      document.removeEventListener('keydown', onEsc);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [userOpen]);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionId');
        try {
          import('js-cookie')
            .then((Cookies) => Cookies.default.remove('userInfo'))
            .catch(() => {});
        } catch {}
      }
    } finally {
      setHasSession(false);
      setUserOpen(false);
      router.push('/');
    }
  };

  const onOpenCart = () => router.push('/cart');

  const currentUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const url = new URL(window.location.href);
    return url.pathname;
  }, []);

  useEffect(() => {
    try {
      ['/fabric', '/wishlist', '/cart', '/profile', '/login', '/register'].forEach((p) => {
        if (router.prefetch) router.prefetch(p);
      });
    } catch {}
  }, [router]);

  return (
    <>
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`} style={{ overflow: 'visible' }}>
          <div
            id="header-sticky"
            className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}
            style={{ overflow: 'visible' }}
          >
            <div className="container" style={{ overflow: 'visible' }}>
              <div className="tp-mega-menu-wrapper p-relative" style={{ overflow: 'visible' }}>
                <div className="row align-items-center">
                  {/* Logo */}
                  <div className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
                    <div className="logo d-flex align-items-center" style={{ gap: '12px' }}>
                      <Link href="/" className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <Image
                          src="/assets/img/logo/age.jpg"
                          alt="Company Logo"
                          width={140}
                          height={44}
                          priority
                          quality={90}
                          sizes="(max-width: 600px) 110px, 140px"
                          style={{ height: 'auto', width: 'auto', maxWidth: '140px', maxHeight: '44px' }}
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="d-none d-xl-block col-xl-4">

                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content"><Menus /></nav>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="col-6 col-sm-8 col-md-8 col-lg-9 col-xl-6">

                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end header-right">

                      {/* ======= DESKTOP SEARCH ======= */}
                      <div className="tp-header-search-2 d-none d-md-block me-3 search-wrap" ref={desktopSearchWrapRef}>
                        <form onSubmit={onSearchSubmit} className="search-form">
                          <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={onSearchKeyDown}
                            type="text"
                            placeholder="Search for Products..."
                            aria-label="Search products"
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
                              title="Clear search"
                            >
                              Clear Search
                            </button>
                          )}

                          <button
                            type="submit"
                            className="search-submit"
                            aria-label="Search"
                            title="Search"
                          >
                            <Search />
                          </button>
                        </form>
                      </div>

                      {/* ======= MOBILE SEARCH BAR (EXPANDABLE) ======= */}
                      <div className={`tp-header-search-mobile d-md-none ${mobileSearchOpen ? 'expanded' : ''}`} ref={mobileSearchWrapRef}>
                        {mobileSearchOpen && (
                          <form onSubmit={onSearchSubmit} className="mobile-search-form">
                            <input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={onSearchKeyDown}
                              type="text"
                              placeholder="Search products..."
                              aria-label="Search products"
                              autoComplete="off"
                              spellCheck={false}
                              inputMode="search"
                              maxLength={200}
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

                        {/* ======= MOBILE SEARCH ICON ======= */}
                        <div className="tp-header-action-item d-md-none me-2">
                          <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="tp-header-action-btn"
                            aria-label="Toggle search"
                            type="button"
                          >
                            <Search />
                          </button>
                        </div>

                        {/* User / Auth */}
                        <div className="tp-header-action-item me-2 position-relative" style={{ overflow: 'visible' }}>
                          {hasSession ? (
                            <>
                              <button
                                ref={userBtnRef}
                                onClick={() => setUserOpen((v) => !v)}
                                className="tp-header-action-btn"
                                aria-haspopup="menu"
                                aria-expanded={userOpen}
                                aria-label="Account menu"
                                type="button"
                                style={userImage ? { padding: 0, overflow: 'hidden', borderRadius: '50%' } : {}}
                              >
                                {userImage ? (
                                  <>
                                    <Image
                                      src={userImage}
                                      alt="Profile"
                                      width={36}
                                      height={36}
                                      quality={85}
                                      style={{
                                        width: '36px',
                                        height: '36px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const sib = e.currentTarget.nextElementSibling;
                                        if (sib && sib.style) sib.style.display = 'inline-flex';
                                      }}
                                    />
                                    <FaUser style={{ display: 'none' }} />
                                  </>
                                ) : (
                                  <FaUser />
                                )}
                              </button>

                              {userOpen && (
                                <div ref={userMenuRef} role="menu" className="user-menu-dropdown">
                                  <div className="user-menu-inner">
                                    <button className="user-item" type="button" role="menuitem" onClick={() => { setUserOpen(false); router.push('/profile'); }}>
                                      My Profile
                                    </button>
                                    <div className="user-divider" />
                                    <button className="user-item danger" type="button" role="menuitem" onClick={handleLogout}>
                                      Logout
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={pathname === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(currentUrl)}`}
                              className="tp-header-action-btn"
                              aria-label="Login or Sign Up"
                              prefetch
                            >
                              <FaUser />
                            </Link>
                          )}
                        </div>

                        {/* Wishlist */}
                        <div className="tp-header-action-item d-none d-lg-block me-2">
                          <Link href="/wishlist" className="tp-header-action-btn" aria-label="Wishlist" prefetch>
                            <FaHeart />
                            <span className="tp-header-action-badge">{wishlistCount}</span>
                          </Link>
                        </div>

                        {/* Cart */}
                        {hasSession && (
                          <div className="tp-header-action-item me-2">
                            <button onClick={onOpenCart} className="tp-header-action-btn cartmini-open-btn" aria-label="Open cart" type="button">
                              <CartTwo />
                              <span className="tp-header-action-badge" key={`cart-${distinctCount}`}>{distinctCount}</span>
                            </button>
                          </div>
                        )}

                        {/* Mobile hamburger */}
                        <div className="tp-header-action-item tp-header-hamburger d-xl-none">
                          <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn" aria-label="Open menu">
                            <FiMenu />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/* end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartMiniSidebar />
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />

      <style jsx>{`
        /* ---------------------------
           Header layout responsiveness
        ---------------------------- */
        #header-sticky{
          z-index: 1020; /* above page content, below typical modal */
        }

        /* Make header sticky on scroll */
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
@media (max-width: 1199px){
  #header-sticky{
    position: fixed !important;
    top: 0 !important;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 2000;      /* keep above page */
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  /* prevent content hidden behind fixed header */
  :global(body){
    padding-top: 72px; /* adjust if your header height differs */
  }
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

        .header-right{
          gap: 10px;
          flex-wrap: nowrap;
        }

        .header-actions{
          gap: 8px;
          flex: 0 0 auto;
          align-items: center;
        }

        /* If your modal library adds body.modal-open (Bootstrap),
           keep header under modal/backdrop and disable clicks behind modal */
        :global(body.modal-open) #header-sticky{
          z-index: 1 !important;
          pointer-events: none;
        }
        :global(body.modal-open) .tp-header-search-mobile{
          z-index: 1 !important;
          pointer-events: none;
        }
        :global(body.modal-open) .user-menu-dropdown{
          z-index: 1 !important;
          pointer-events: none;
        }

        /* ---------------------------
           Action icon sizing (desktop)
        ---------------------------- */
     .tp-header-action-btn{
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* IMPORTANT: fixes SVG baseline / vertical misalignment */
  line-height: 0;
  padding: 0;
}

        /* keep template hover styles, only improve feel */
        .tp-header-action-btn:active{ transform: translateY(1px); }

       .tp-header-action-btn :global(svg){
  width: 20px;
  height: 20px;
  display: block;     /* IMPORTANT */
  flex: 0 0 auto;
}

        @media (max-width: 575px){
         .tp-header-action-btn{
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .tp-header-action-btn :global(svg){
    width: 18px;
    height: 18px;
    display: block;
  }
        }

        /* Badge fix (0 / counts) */
        .tp-header-action-badge{
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          background: #ef4444;
          color: #fff;
          pointer-events: none;
        }
        @media (max-width: 575px){
          .tp-header-action-badge{
            top: -5px;
            right: -5px;
            min-width: 16px;
            height: 16px;
            font-size: 10px;
          }
        }

        /* ---------------------------
           Desktop search (responsive)
        ---------------------------- */
        .search-wrap{
          position: relative;
          z-index: 10;
          flex: 1 1 auto;
          min-width: 220px;
        }

        .search-form{
          position: relative;
          width: clamp(240px, 36vw, 560px);
          max-width: 100%;
          z-index: 10;
        }

.search-input{
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #cfd6df;
  background: #fff;
  color: #0f172a;
  font-size: 14px;
  padding: 0 52px 0 14px; /* only space for search icon by default */
  outline: none;
  cursor: text;
  position: relative;
}
.search-input.has-clear{
  padding-right: 120px; /* when Clear button is visible */
}

        .search-input:focus{
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.12);
        }
        .search-input::placeholder{ color: #6b7280; }

        .search-submit{
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 34px;
          width: 34px;
          border: 0;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          z-index: 2;
        }

        .search-clear{
          position: absolute;
          right: 46px;
          top: 50%;
          transform: translateY(-50%);
          height: 30px;
          padding: 0 8px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          z-index: 2;
          white-space: nowrap;
          transition: all .2s ease;
        }
        .search-clear:hover{
          color: #111827;
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        /* On smaller screens, keep search usable */
        @media (max-width: 991px){
          .search-form{ width: clamp(220px, 44vw, 520px); }
        }
        @media (max-width: 767px){
          .search-form{ width: 100%; }
        }

        /* ---------------------------
           Mobile search bar (z-index fixed)
        ---------------------------- */
        .tp-header-search-mobile{
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #fff;
          z-index: 1030; /* BELOW typical modal (1050+) */
          transform: translateY(-100%);
          transition: transform .3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,.1);
        }
        .tp-header-search-mobile.expanded{
          transform: translateY(0);
        }

        .mobile-search-form{
          display: flex;
          align-items: center;
          padding: 15px 16px;
          gap: 10px;
        }

        .mobile-search-input{
          flex: 1;
          height: 50px;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          padding: 0 18px;
          font-size: 16px;
          color: #111827;
          background: #fff;
          outline: none;
        }
        .mobile-search-input:focus{
          border-color: var(--tp-theme-primary);
        }

        .mobile-search-close{
          min-width: 72px;
          height: 50px;
          border: 2px solid #e5e7eb;
          background: #f8fafc;
          color: #6b7280;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
          transition: all .2s ease;
        }
        .mobile-search-close:hover{
          background: #e5e7eb;
          border-color: #d1d5db;
          color: #111827;
        }

        /* ---------------------------
           Dropdown (account) - z-index fixed
        ---------------------------- */
        .user-menu-dropdown{
          position: absolute;
          right: 0;
          top: calc(100% + 12px);
          z-index: 1035; /* below typical modal, above page */
          min-width: 230px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 18px 40px rgba(0,0,0,.14), 0 2px 6px rgba(0,0,0,.06);
          overflow: hidden;
          animation: menuPop .14s ease-out both;
        }
        .user-menu-dropdown::before{
          content:"";
          position:absolute;
          right:18px;
          top:-7px;
          width:14px;
          height:14px;
          background:#fff;
          transform:rotate(45deg);
          box-shadow:-2px -2px 6px rgba(0,0,0,.05);
        }
        .user-menu-inner{
          display:flex;
          flex-direction:column;
          gap:6px;
          padding:8px;
        }
        .user-item{
          display:block !important;
          width:100%;
          padding:10px 14px;
          border-radius:8px;
          font-size:14px;
          line-height:1.25;
          color:#111827;
          background:transparent;
          border:0;
          text-align:left;
          cursor:pointer;
        }
        .user-item:hover{ background:#f3f4f6; }
        .user-item.danger{ color:#b91c1c; }
        .user-item.danger:hover{ background:#fee2e2; }
        .user-divider{
          height:1px;
          background:#e5e7eb;
          margin:2px 6px;
          border-radius:1px;
        }
        @keyframes menuPop{
          from{ transform:translateY(-4px); opacity:0; }
          to{ transform:translateY(0); opacity:1; }
        }
        /* LAPTOP widths: shrink search so menu + icons fit better */
@media (min-width: 1200px) and (max-width: 1440px){
  .search-form{
    width: clamp(220px, 26vw, 420px);
  }
  .header-right{
    gap: 8px;
  }
  .header-actions{
    gap: 6px;
  }
}

/* ===== RESPONSIVE FIXES ===== */

/* Tablet landscape (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px){
  .logo img{
    max-width: 120px !important;
  }
  .search-form{
    width: clamp(180px, 24vw, 320px);
  }
  .header-right{
    gap: 6px;
  }
  .header-actions{
    gap: 4px;
  }
  .tp-header-action-btn{
    width: 40px;
    height: 40px;
  }
  .tp-header-action-btn :global(svg){
    width: 18px;
    height: 18px;
  }
}

/* Tablet portrait (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px){
  .logo img{
    max-width: 110px !important;
  }
  .search-form{
    width: 100%;
    max-width: 280px;
  }
  .search-input{
    height: 40px;
    font-size: 13px;
    padding: 0 48px 0 12px;
  }
  .search-input.has-clear{
    padding-right: 110px;
  }
  .search-submit{
    width: 32px;
    height: 32px;
  }
  .search-clear{
    right: 42px;
    height: 28px;
    font-size: 11px;
  }
  .header-right{
    gap: 4px;
  }
  .header-actions{
    gap: 3px;
  }
  .tp-header-action-btn{
    width: 38px;
    height: 38px;
  }
  .tp-header-action-btn :global(svg){
    width: 17px;
    height: 17px;
  }
}

/* Mobile landscape (576px - 767px) */
@media (min-width: 576px) and (max-width: 767px){
  .logo img{
    max-width: 100px !important;
  }
  .header-right{
    gap: 4px;
  }
  .header-actions{
    gap: 2px;
  }
  .tp-header-action-btn{
    width: 38px;
    height: 38px;
  }
  .tp-header-action-btn :global(svg){
    width: 17px;
    height: 17px;
  }
  .tp-header-action-badge{
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    font-size: 10px;
  }
}

/* Mobile portrait (< 576px) */
@media (max-width: 575px){
  .logo img{
    max-width: 90px !important;
  }
  .header-right{
    gap: 2px;
  }
  .header-actions{
    gap: 2px;
  }
  .tp-header-action-item{
    margin-right: 0 !important;
  }
  .tp-header-action-item.me-2{
    margin-right: 4px !important;
  }
  .tp-header-action-item.me-3{
    margin-right: 6px !important;
  }
}

/* Extra small devices (< 400px) */
@media (max-width: 399px){
  .logo img{
    max-width: 80px !important;
  }
  .tp-header-action-btn{
    width: 36px;
    height: 36px;
  }
  .tp-header-action-btn :global(svg){
    width: 16px;
    height: 16px;
  }
  .header-actions{
    gap: 1px;
  }
}

/* Fix container padding on small screens */
@media (max-width: 767px){
  .container{
    padding-left: 12px;
    padding-right: 12px;
  }
}

/* Ensure row doesn't overflow */
.row{
  margin-left: -8px;
  margin-right: -8px;
}
.row > [class*="col-"]{
  padding-left: 8px;
  padding-right: 8px;
}

@media (max-width: 575px){
  .row{
    margin-left: -4px;
    margin-right: -4px;
  }
  .row > [class*="col-"]{
    padding-left: 4px;
    padding-right: 4px;
  }
}

      `}</style>
    </>
  );
};

export default HeaderTwo;
