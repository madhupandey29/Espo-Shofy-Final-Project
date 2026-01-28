import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen = () => {} }) => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menuId) => {
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };

  // Handle capability link click with same logic as desktop
  const handleCapabilityClick = (link, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close the mobile menu
    handleCloseCanvas();
    
    // Navigate with same logic as desktop mega menu
    setTimeout(() => {
      if (link.includes('#')) {
        const [, hash] = link.split('#');
        const currentPath = window.location.pathname;
        
        if (currentPath === '/capabilities') {
          // Update URL with hash
          const newUrl = `/capabilities#${hash}`;
          window.history.pushState(null, '', newUrl);
          
          // Trigger hashchange event
          const hashChangeEvent = new Event('hashchange');
          window.dispatchEvent(hashChangeEvent);
          
          // Scroll to section
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              const headerOffset = 120;
              const elementPosition = element.offsetTop;
              const offsetPosition = elementPosition - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }, 100);
        } else {
          router.push(link);
        }
      } else {
        router.push(link);
      }
    }, 100);
  };

  // Enhanced menu items with capabilities dropdown
  const mainMenuItems = [
    { title: "Home", link: "/" },
    { 
      title: "Capabilities", 
      link: "/capabilities",
      hasDropdown: true,
      id: "capabilities",
      subMenus: [
        { title: 'Product Range', link: '/capabilities#products' },
        { title: 'Manufacturing Process', link: '/capabilities#process' },
        { title: 'Machines & Technology', link: '/capabilities#machines' },
        { title: 'Quality & Testing', link: '/capabilities#quality' },
        { title: 'Certifications', link: '/capabilities#certifications' },
      ]
    },
    { title: "Products", link: "/fabric" },
    { title: "Blog", link: "/blog" },
    { title: "Contact", link: "/contact" },
    { title: "Wishlist", link: "/wishlist" }
  ];

  // Enhanced close icon
  const CloseIcon = () => (
    <svg 
      width="22" 
      height="22" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M18 6L6 18M6 6L18 18" 
        stroke="currentColor" 
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // CSS Styles - Enhanced mobile UI with higher specificity
  const styles = `
    /* Override theme off-canvas styles with higher specificity */
    .offcanvas__area.offcanvas__area {
      position: fixed !important;
      top: 0 !important;
      right: -100% !important;
      width: 320px !important;
      max-width: 85vw !important;
      height: 100vh !important;
      background: #ffffff !important;
      transition: right 0.3s ease !important;
      z-index: 999999 !important;
      box-shadow: -4px 0 20px rgba(15, 34, 53, 0.15) !important;
      border-left: 1px solid #E6ECF2 !important;
      transform: none !important;
    }
    .offcanvas__area.offcanvas__area.offcanvas-opened {
      right: 0 !important;
      transform: none !important;
    }
    .offcanvas__wrapper.offcanvas__wrapper {
      height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 0 !important;
      min-height: auto !important;
    }
    .offcanvas__content.offcanvas__content {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 0 !important;
    }
    .offcanvas__header.offcanvas__header {
      padding: 25px !important;
      border-bottom: 1px solid #F1F5F9 !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      background: #ffffff !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 10002 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      min-height: 80px !important;
    }
    .offcanvas__close-btn.offcanvas__close-btn {
      background: #F7F9FC !important;
      border: 2px solid #2C4C97 !important;
      cursor: pointer !important;
      padding: 12px !important;
      border-radius: 12px !important;
      color: #2C4C97 !important;
      width: 48px !important;
      height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 12px rgba(44, 76, 151, 0.2) !important;
    }
    .offcanvas__close-btn.offcanvas__close-btn:hover {
      background: #2C4C97 !important;
      color: #ffffff !important;
      transform: scale(1.05) !important;
    }
    .brand-text.brand-text {
      font-family: 'Poppins', 'Jost', system-ui, sans-serif !important;
      font-size: 32px !important;
      font-weight: 900 !important;
      color: #2C4C97 !important;
      text-shadow: 0 2px 4px rgba(44, 76, 151, 0.2) !important;
      letter-spacing: -0.8px !important;
      line-height: 1 !important;
    }
    .mobile-menu-list.mobile-menu-list {
      list-style: none !important;
      padding: 20px 0 !important;
      margin: 0 !important;
      background: #ffffff !important;
    }
    .mobile-menu-item.mobile-menu-item {
      margin: 0 !important;
    }
    .mobile-menu-link.mobile-menu-link {
      display: flex !important;
      align-items: center !important;
      padding: 18px 25px !important;
      color: #0F2235 !important;
      text-decoration: none !important;
      font-family: 'Hind', 'Jost', system-ui, sans-serif !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      background: #ffffff !important;
      border-left: 4px solid transparent !important;
      transition: all 0.3s ease !important;
      position: relative !important;
    }
    .mobile-menu-link.mobile-menu-link:hover {
      background: #F8FAFC !important;
      color: #2C4C97 !important;
      border-left-color: #2C4C97 !important;
    }
    .mobile-menu-item:not(:last-child) .mobile-menu-link {
      border-bottom: 1px solid #F7F9FC !important;
    }
    .body-overlay.body-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(15, 34, 53, 0.6) !important;
      z-index: 999998 !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all 0.3s ease !important;
      backdrop-filter: blur(2px) !important;
    }
    .body-overlay.body-overlay.opened {
      opacity: 1 !important;
      visibility: visible !important;
    }
    /* Enhanced scrollbar */
    .offcanvas__content::-webkit-scrollbar {
      width: 4px;
    }
    .offcanvas__content::-webkit-scrollbar-track {
      background: #F7F9FC;
    }
    .offcanvas__content::-webkit-scrollbar-thumb {
      background: #E6ECF2;
      border-radius: 2px;
    }
    .offcanvas__content::-webkit-scrollbar-thumb:hover {
      background: #D1D5DB;
    }
    /* Dropdown functionality styles with higher specificity */
    .dropdown-toggle.dropdown-toggle {
      justify-content: space-between !important;
      border: none !important;
      background: none !important;
      width: 100% !important;
      text-align: left !important;
      cursor: pointer !important;
      position: relative !important;
    }
    .dropdown-toggle.dropdown-toggle.active {
      background: #F8FAFC !important;
      color: #2C4C97 !important;
      border-left-color: #2C4C97 !important;
    }
    .dropdown-arrow.dropdown-arrow {
      transition: transform 0.3s ease !important;
      color: #64748B !important;
      margin-left: auto !important;
      flex-shrink: 0 !important;
    }
    .dropdown-arrow.dropdown-arrow.rotated {
      transform: rotate(180deg) !important;
      color: #2C4C97 !important;
    }
    .mobile-submenu.mobile-submenu {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #F8FAFC !important;
      max-height: 0 !important;
      overflow: hidden !important;
      transition: max-height 0.4s ease, padding 0.4s ease !important;
      border-left: 4px solid #2C4C97 !important;
    }
    .mobile-submenu.mobile-submenu.active {
      max-height: 500px !important;
      padding: 12px 0 !important;
    }
    .mobile-submenu-item.mobile-submenu-item {
      margin: 0 !important;
    }
    .mobile-submenu-link.mobile-submenu-link {
      display: block !important;
      padding: 14px 25px 14px 50px !important;
      color: #475569 !important;
      text-decoration: none !important;
      font-family: 'Hind', 'Jost', system-ui, sans-serif !important;
      font-weight: 400 !important;
      font-size: 15px !important;
      background: #F8FAFC !important;
      border-left: 3px solid transparent !important;
      transition: all 0.3s ease !important;
      position: relative !important;
    }
    .mobile-submenu-link.mobile-submenu-link::before {
      content: '•' !important;
      position: absolute !important;
      left: 35px !important;
      color: #2C4C97 !important;
      font-weight: bold !important;
    }
    .mobile-submenu-link.mobile-submenu-link:hover {
      background: #E2E8F0 !important;
      color: #2C4C97 !important;
      border-left-color: #2C4C97 !important;
      padding-left: 52px !important;
    }
    .mobile-submenu-item:not(:last-child) .mobile-submenu-link {
      border-bottom: 1px solid #E2E8F0 !important;
    }
    /* Mobile optimizations */
    @media (max-width: 576px) {
      .offcanvas__area {
        width: 280px;
      }
      .offcanvas__header {
        padding: 20px;
      }
      .mobile-menu-list {
        padding: 25px 0;
      }
      .mobile-menu-link {
        padding: 15px 20px;
      }
      .mobile-submenu-link {
        padding: 12px 20px 12px 40px;
        font-size: 14px;
      }
    }
    @media (max-width: 1024px) {
      .mobile-menu-link {
        min-height: 52px;
        display: flex;
        align-items: center;
      }
    }
  `;

  return (
    <>
      <style jsx>{styles}</style>
      
      <div className={`offcanvas__area ${isOffCanvasOpen ? 'offcanvas-opened' : ''}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            {/* Header */}
            <div className="offcanvas__header">
              <span className="brand-text">AGE</span>
              <button 
                onClick={handleCloseCanvas} 
                className="offcanvas__close-btn"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Navigation with dropdown support */}
            <nav className="mobile-menu-nav">
              <ul className="mobile-menu-list">
                {mainMenuItems.map((menu) => (
                  <li key={menu.link || menu.id} className="mobile-menu-item">
                    {menu.hasDropdown ? (
                      <>
                        <button
                          className={`mobile-menu-link dropdown-toggle ${activeDropdown === menu.id ? 'active' : ''}`}
                          onClick={() => toggleDropdown(menu.id)}
                        >
                          <span>{menu.title}</span>
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none"
                            className={`dropdown-arrow ${activeDropdown === menu.id ? 'rotated' : ''}`}
                          >
                            <path 
                              d="M6 9L12 15L18 9" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <ul className={`mobile-submenu ${activeDropdown === menu.id ? 'active' : ''}`}>
                          {menu.subMenus.map((subMenu) => (
                            <li key={subMenu.link} className="mobile-submenu-item">
                              <a 
                                href={subMenu.link} 
                                className="mobile-submenu-link"
                                onClick={(e) => handleCapabilityClick(subMenu.link, e)}
                              >
                                {subMenu.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link 
                        href={menu.link} 
                        className="mobile-menu-link"
                        onClick={handleCloseCanvas}
                      >
                        {menu.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Backdrop Overlay */}
      <div 
        onClick={handleCloseCanvas} 
        className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}
        aria-hidden="true"
      />
    </>
  );
};

export default OffCanvas;
