'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

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
const PAGE_SIZE = 20;

const selectUserIdFromStore = (state) =>
  state?.auth?.user?._id ||
  state?.auth?.user?.id ||
  state?.auth?.userInfo?._id ||
  state?.auth?.userInfo?.id ||
  state?.user?.user?._id ||
  null;

function normalizeProduct(p) {
  const id = p._id || p.id || p.fabricCode || p.productslug || p.slug || String(Date.now());
  const slug = p.productslug || p.slug || p.seoSlug || p.handle || '';
  const name = p.name || p.title || p.productname || p.productName || 'Untitled';

  const img =
    (p.image1CloudUrl && typeof p.image1CloudUrl === 'string' ? p.image1CloudUrl.replace(/#$/, '') : p.image1CloudUrl) ||
    (p.image2CloudUrl && typeof p.image2CloudUrl === 'string' ? p.image2CloudUrl.replace(/#$/, '') : p.image2CloudUrl) ||
    (p.image3CloudUrl && typeof p.image3CloudUrl === 'string' ? p.image3CloudUrl.replace(/#$/, '') : p.image3CloudUrl) ||
    p.image ||
    p.img ||
    p.thumbnail ||
    (Array.isArray(p.images) ? p.images[0] : null) ||
    p.mainImage ||
    p.picture ||
    '/assets/img/product/default-product-img.jpg';

  const price = p.salesPrice || p.price || p.mrp || p.minPrice || null;

  return { id, slug, name, img, price, ...p };
}

/** ✅ Your search API with client-side filtering */
async function searchProducts(q, limit = PAGE_SIZE, signal) {
  try {
    // Get all products since backend search is not working
    const res = await fetch(`https://espobackend.vercel.app/api/product?limit=1000`, { signal });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data?.data)) {
        // Client-side search filtering
        const searchTerm = q.toLowerCase();
        const filteredProducts = data.data.filter(product => {
          const searchableText = [
            product.productTitle,
            product.name,
            product.colors,
            product.color,
            product.design,
            product.content,
            product.finish,
            product.structure,
            product.motif,
            product.category?.name,
            product.brand?.name
          ].filter(Boolean).join(' ').toLowerCase();
          
          return searchableText.includes(searchTerm);
        });
        
        return filteredProducts.slice(0, limit).map(normalizeProduct);
      }
    }
  } catch (err) {}

  return [];
}

/** Avatar fetch (kept) */
const SHOPY_API_BASE = 'https://test.amrita-fashions.com/shopy';
async function fetchUserAvatarById(userId, signal) {
  if (!userId) return null;
  try {
    const res = await fetch(`${SHOPY_API_BASE}/users/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
      signal,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const url =
      json?.user?.userImage ||
      json?.userImage ||
      json?.data?.user?.userImage ||
      null;
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

  // ===== SIMPLIFIED SEARCH (Fixed typing issues) =====
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // New state for mobile search
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selIndex, setSelIndex] = useState(-1);

  // Simple debounce effect - increased delay to reduce backend load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 800); // Increased from 300ms to 800ms for better UX and less backend load
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchWrapRef = useRef(null);
  const dropRef = useRef(null);

  // Fetch search results when debounced query changes
  useEffect(() => {
    const controller = new AbortController();
    const q = debouncedQuery.trim();

    // Require minimum 3 characters to reduce backend load
    if (q.length < 3) {
      setResults([]);
      setSelIndex(-1);
      setLoading(false);
      return;
    }

    if (!searchOpen) {
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    searchProducts(q, PAGE_SIZE, controller.signal)
      .then((arr) => {
        setResults(arr);
        setSelIndex(-1);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery, searchOpen]);

  // close dropdown on outside click / Esc
  useEffect(() => {
    const onDoc = (e) => {
      const w = searchWrapRef.current;
      if (!w) return;
      if (!(e.target instanceof Node)) return;
      if (!w.contains(e.target)) setSearchOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };

    document.addEventListener('mousedown', onDoc, true);
    document.addEventListener('touchstart', onDoc, true);
    document.addEventListener('keydown', onEsc);

    return () => {
      document.removeEventListener('mousedown', onDoc, true);
      document.removeEventListener('touchstart', onDoc, true);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const closeSearchDropdown = () => {
    setSearchOpen(false);
    setResults([]);
    setSelIndex(-1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    closeSearchDropdown();
    setMobileSearchOpen(false);
    
    // Update URL to remove search parameters
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/shop') || currentPath.includes('/search')) {
        const url = new URL(window.location);
        url.searchParams.delete('q');
        url.searchParams.delete('searchText');
        const newUrl = url.pathname + (url.search ? url.search : '');
        
        // Use router.replace to update URL without page reload
        router.replace(newUrl, undefined, { shallow: true });
      }
    }
  };

  const goToPage = (href) => {
    closeSearchDropdown();
    try { window.scrollTo?.(0, 0); } catch (err) {}
    router.push(href);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (!q) {
      return;
    }

    // Don't close mobile search - keep it open so user can see how to clear
    // setMobileSearchOpen(false); // Removed this line
    closeSearchDropdown();

    // If user selected an item with arrow keys, go to that product
    if (selIndex >= 0 && results[selIndex]) {
      const p = results[selIndex];
      if (p?.slug) {
        goToPage(`/fabric/${p.slug}`);
        return;
      }
    }

    // Otherwise go to shop with search query
    const searchUrl = `/shop?q=${encodeURIComponent(q)}`;
    goToPage(searchUrl);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit(e);
      return;
    }
    
    if (!searchOpen || !results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelIndex((i) => Math.min(results.length - 1, i < 0 ? 0 : i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelIndex((i) => Math.max(-1, i - 1));
    }
  };

  // close dropdown when route changes
  useEffect(() => {
    closeSearchDropdown();
  }, [pathname]);

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
    return url.pathname + url.search;
  }, []);

  useEffect(() => {
    try {
      ['/shop', '/wishlist', '/cart', '/profile', '/login', '/register'].forEach((p) => {
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
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <div className="container" style={{ overflow: 'visible' }}>
              <div className="tp-mega-menu-wrapper p-relative" style={{ overflow: 'visible' }}>
                <div className="row align-items-center">
                  {/* Logo */}
                  <div className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
                    <div className="logo d-flex align-items-center" style={{ gap: '12px' }}>
                      <Link href="/" className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <img
                          src="/assets/img/logo/age.jpg"
                          alt="Company Logo"
                          width={140}
                          height={44}
                          style={{ height: 'auto', width: 'auto', maxWidth: '140px', maxHeight: '44px' }}
                          sizes="(max-width: 600px) 110px, 140px"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="d-none d-xl-block col-xl-5">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content"><Menus /></nav>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="col-6 col-sm-8 col-md-8 col-lg-9 col-xl-5">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end">

                      {/* ======= DESKTOP SEARCH ======= */}
                      <div className="tp-header-search-2 d-none d-md-block me-3 search-wrap" ref={searchWrapRef}>
                        <form onSubmit={onSearchSubmit} className="search-form">
                          <input
                            value={searchQuery}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSearchQuery(value);
                              setSelIndex(-1); // Reset selection when typing
                              // Show dropdown for helpful messages, but don't search until 3+ chars
                              if (value.trim().length >= 1) {
                                setSearchOpen(true);
                              } else {
                                closeSearchDropdown();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const q = searchQuery.trim();
                                if (q.length >= 3) {
                                  setSearchOpen(true);
                                }
                                onSearchSubmit(e);
                                return;
                              }
                              onSearchKeyDown(e);
                            }}
                            type="text"
                            placeholder="Search for Products... (min 3 chars)"
                            aria-label="Search products"
                            autoComplete="off"
                            spellCheck={false}
                            inputMode="search"
                            maxLength={200}
                            className="search-input"
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
                              ✕
                            </button>
                          )}

                          <button
                            type="submit"
                            className="search-submit"
                            aria-label="Search"
                            title="Search"
                            onClick={(e) => {
                              const q = searchQuery.trim();
                              if (q.length >= 3 && !searchOpen) {
                                e.preventDefault();
                                setSearchOpen(true);
                                return;
                              }
                              // Let form submission handle the rest
                            }}
                          >
                            <Search />
                          </button>
                        </form>

                        {/* dropdown results */}
                        {searchOpen && searchQuery.trim().length >= 1 && (
                          <div
                            ref={dropRef}
                            className="search-dropdown"
                            role="listbox"
                            aria-label="Search results"
                          >
                            {loading && <div className="search-item muted">Searching…</div>}
                            {!loading && searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
                              <div className="search-item muted">Type at least 3 characters to search</div>
                            )}
                            {!loading && searchQuery.trim().length >= 3 && results.length === 0 && (
                              <div className="search-item muted">No results found</div>
                            )}

                            {results.map((p, i) => {
                              const active = i === selIndex;
                              return (
                                <button
                                  key={`${p.id}-${i}`}
                                  type="button"
                                  className={`search-item ${active ? 'active' : ''}`}
                                  onMouseEnter={() => setSelIndex(i)}
                                  onClick={() => {
                                    if (p?.slug) {
                                      goToPage(`/fabric/${p.slug}`);
                                    } else {
                                      goToPage(`/shop?q=${encodeURIComponent(searchQuery)}`);
                                    }
                                  }}
                                >
                                  <span className="search-name">{p.name}</span>
                                  {p.price != null && <span className="search-price">₹{String(p.price)}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* ======= MOBILE SEARCH BAR (EXPANDABLE) ======= */}
                      <div className={`tp-header-search-mobile d-md-none ${mobileSearchOpen ? 'expanded' : ''}`} ref={searchWrapRef}>
                        {mobileSearchOpen && (
                          <form onSubmit={onSearchSubmit} className="mobile-search-form">
                            <input
                              value={searchQuery}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchQuery(value);
                                setSelIndex(-1);
                                // Show dropdown for helpful messages, but don't search until 3+ chars
                                if (value.trim().length >= 1) {
                                  setSearchOpen(true);
                                } else {
                                  closeSearchDropdown();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  onSearchSubmit(e);
                                  return;
                                }
                                onSearchKeyDown(e);
                              }}
                              type="text"
                              placeholder="Search products... (min 3 chars)"
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
                                // Clear search and update URL
                                clearSearch();
                                setMobileSearchOpen(false);
                                closeSearchDropdown();
                              }}
                              aria-label="Close search"
                            >
                              ✕
                            </button>
                          </form>
                        )}

                        {/* Mobile search dropdown */}
                        {mobileSearchOpen && searchOpen && searchQuery.trim().length >= 1 && (
                          <div className="mobile-search-dropdown">
                            {loading && <div className="search-item muted">Searching…</div>}
                            {!loading && searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
                              <div className="search-item muted">Type at least 3 characters to search</div>
                            )}
                            {!loading && searchQuery.trim().length >= 3 && results.length === 0 && (
                              <div className="search-item muted">No results found</div>
                            )}

                            {results.map((p, i) => {
                              const active = i === selIndex;
                              return (
                                <button
                                  key={`${p.id}-${i}`}
                                  type="button"
                                  className={`search-item ${active ? 'active' : ''}`}
                                  onClick={() => {
                                    if (p?.slug) {
                                      goToPage(`/fabric/${p.slug}`);
                                    } else {
                                      goToPage(`/shop?q=${encodeURIComponent(searchQuery)}`);
                                    }
                                    // Keep mobile search open so user can clear it
                                  }}
                                >
                                  <span className="search-name">{p.name}</span>
                                  {p.price != null && <span className="search-price">₹{String(p.price)}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="tp-header-action d-flex align-items-center">
                        
                        {/* ======= MOBILE SEARCH ICON ======= */}
                        <div className="tp-header-action-item d-md-none me-2">
                          <button
                            onClick={() => {
                              setMobileSearchOpen(!mobileSearchOpen);
                              if (!mobileSearchOpen) {
                                closeSearchDropdown();
                              }
                            }}
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
                                    <img
                                      src={userImage}
                                      alt="Profile"
                                      style={{
                                        width: '32px',
                                        height: '32px',
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
                              href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
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
                            <FaHeart /><span className="tp-header-action-badge">{wishlistCount}</span>
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
        .search-wrap { position: relative; }

        .search-form{
          position: relative;
          width: 480px;
          max-width: 52vw;
        }
        @media (max-width: 1199px){ .search-form{ width: 440px; } }
        @media (max-width: 991px){ .search-form{ width: 360px; max-width: 56vw; } }
        @media (max-width: 767px){ .search-form{ width: 320px; max-width: 60vw; } }

        .search-input{
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1px solid #cfd6df;
          background: #fff;
          color: #0f172a;
          font-size: 14px;
          padding: 0 78px 0 14px;
          outline: none;
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
          width: 30px;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          z-index: 2;
        }
        .search-clear:hover{ color: #111827; background: #f3f4f6; }

        .search-dropdown{
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          max-height: 420px;
          overflow: auto;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 18px 40px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.06);
          padding: 6px;
          z-index: 50;
        }

        .search-item{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #fff;
          color: #0f172a;
          border: 0;
          text-align: left;
          cursor: pointer;
        }
        .search-item:hover, .search-item.active{ background: #eef2ff; }
        .search-item.muted{ color:#6b7280; cursor: default; }

        .search-name{ font-weight: 600; }
        .search-price{ font-weight: 600; color: #0b1620; }

        /* Mobile Search Styles */
        .tp-header-search-mobile {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #fff;
          z-index: 9999;
          transform: translateY(-100%);
          transition: transform 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .tp-header-search-mobile.expanded {
          transform: translateY(0);
        }

        .mobile-search-form {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
          position: relative;
        }

        .mobile-search-input {
          flex: 1;
          height: 50px;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          padding: 0 70px 0 20px;
          font-size: 16px;
          color: #111827;
          background: #fff;
          outline: none;
        }

        .mobile-search-input:focus {
          border-color: var(--tp-theme-primary);
        }

        .mobile-search-close {
          width: 50px;
          height: 50px;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 24px;
          flex-shrink: 0;
        }

        .mobile-search-dropdown {
          position: absolute;
          top: 100%;
          left: 20px;
          right: 20px;
          max-height: 300px;
          overflow: auto;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          padding: 6px;
          z-index: 10000;
        }

        /* Dropdown (account) */
        .user-menu-dropdown{
          position:absolute;
          right:0;
          top:calc(100% + 12px);
          z-index:10000;
          min-width: 230px;
          background:#fff;
          border-radius:12px;
          box-shadow: 0 18px 40px rgba(0,0,0,.14), 0 2px 6px rgba(0,0,0,.06);
          overflow:hidden;
          animation:menuPop .14s ease-out both;
        }
        .user-menu-dropdown::before{
          content:"";
          position:absolute;
          right:18px;
          top:-7px;
          width:14px;height:14px;
          background:#fff;
          transform:rotate(45deg);
          box-shadow:-2px -2px 6px rgba(0,0,0,.05);
        }
        .user-menu-inner{ display:flex; flex-direction:column; gap:6px; padding:8px; }
        .user-item{
          display:block !important; width:100%; padding:10px 14px; border-radius:8px;
          font-size:14px; line-height:1.25; color:#111827; background:transparent; border:0; text-align:left;
          cursor:pointer;
        }
        .user-item:hover{ background:#f3f4f6; }
        .user-item.danger{ color:#b91c1c; }
        .user-item.danger:hover{ background:#fee2e2; }
        .user-divider{ height:1px; background:#e5e7eb; margin:2px 6px; border-radius:1px; }
        @keyframes menuPop{ from{ transform:translateY(-4px); opacity:0; } to{ transform:translateY(0); opacity:1; } }
      `}</style>
    </>
  );
};

export default HeaderTwo;
