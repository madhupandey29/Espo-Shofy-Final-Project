'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ProductItem from '../products/fashion/product-item';
import ShopTopLeft from './shop-top-left';
import EnhancedShopSidebarFilters from './EnhancedShopSidebarFilters';
import EmptyState from '@/components/common/empty-state';
import { handleFilterSidebarOpen } from '@/redux/features/shop-filter-slice';
import { Filter } from '@/svg';

const ShopContent = ({
  all_products = [],
  products = [],
  otherProps,
  shop_right,
  hidden_sidebar,
}) => {
  console.log('ShopContent Debug:', { 
    allProductsLength: all_products.length, 
    productsLength: products.length,
    totalProducts: otherProps?.totalProducts 
  });

  const {
    priceFilterValues,
    selectHandleFilter,
    setCurrPage,
    selectedFilters,
    handleFilterChange,
    loadMoreProducts,
    hasMorePages,
    isLoadingMore,
    totalProducts,
  } = otherProps || {};

  const { setPriceValue, priceValue } = priceFilterValues || {};
  const [filteredRows, setFilteredRows] = useState(products);
  const dispatch = useDispatch();

  // measure header + toolbar to center empty state
  const [centerOffset, setCenterOffset] = useState(140);
  useEffect(() => {
    const calc = () => {
      const header =
        document.querySelector('.tp-header-area') ||
        document.querySelector('.tp-header-style-primary');
      const toolbar = document.querySelector('.shop-toolbar-sticky');
      const h = header ? header.getBoundingClientRect().height : 0;
      const t = toolbar ? toolbar.getBoundingClientRect().height : 0;
      setCenterOffset(h + t);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    // Deduplicate products by ID to prevent showing the same product multiple times
    const uniqueProducts = products.reduce((acc, product) => {
      const id = product._id || product.id;
      if (id && !acc.find(p => (p._id || p.id) === id)) {
        acc.push(product);
      }
      return acc;
    }, []);
    
    console.log('ShopContent: Deduplicating products', {
      originalCount: products.length,
      uniqueCount: uniqueProducts.length,
      duplicatesRemoved: products.length - uniqueProducts.length
    });
    
    setFilteredRows(uniqueProducts);
    setCurrPage?.(1);
  }, [products, setCurrPage]);

  const maxPrice = useMemo(() => {
    return all_products.reduce(
      (m, p) => Math.max(m, +p.salesPrice || +p.price || 0),
      1000
    );
  }, [all_products]);

  const pv = Array.isArray(priceValue) ? priceValue : [0, maxPrice];
  const priceActive = pv[0] > 0 || pv[1] < maxPrice;

  const facetsActive =
    selectedFilters && Object.values(selectedFilters).some((v) =>
      Array.isArray(v) ? v.length > 0 : !!v
    );

  const anyActive = !!(priceActive || facetsActive);

  const resetAll = () => {
    setPriceValue?.([0, maxPrice]);
    handleFilterChange?.({});
    setCurrPage?.(1);
    
    // Clear search if active - this will be handled by the search component itself
    // We don't need to call handleSearchResults here as it might cause conflicts
  };

  // ✅ Build chips list
  const chips = useMemo(() => {
    const out = [];

    if (selectedFilters) {
      for (const [k, vals] of Object.entries(selectedFilters)) {
        if (!Array.isArray(vals)) continue;
        vals.forEach((v) => {
          out.push({
            id: `${k}:${v}`,
            key: k,
            value: String(v),
          });
        });
      }
    }

    if (priceActive) {
      out.push({
        id: `price:${pv[0]}-${pv[1]}`,
        key: 'price',
        value: `${pv[0]} - ${pv[1]}`,
      });
    }

    return out;
  }, [selectedFilters, priceActive, pv]);

  const removeChip = (chip) => {
    if (!chip) return;

    if (chip.key === 'price') {
      setPriceValue?.([0, maxPrice]);
      return;
    }

    const current = Array.isArray(selectedFilters?.[chip.key]) ? selectedFilters[chip.key] : [];
    const nextArr = current.filter((x) => String(x) !== String(chip.value));
    const next = { ...(selectedFilters || {}) };

    if (nextArr.length) next[chip.key] = nextArr;
    else delete next[chip.key];

    handleFilterChange?.(next);
  };

  return (
    <section className="tp-shop-area pb-120">
      <div className="container">
        <div className="row align-items-start">
          {/* sidebar */}
          {!shop_right && !hidden_sidebar && (
            <aside className="col-auto d-none d-lg-block shop-sidebar-col">
              <div className="sticky-filter">
                <EnhancedShopSidebarFilters
                  selected={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onResetAll={resetAll}
                />
              </div>
            </aside>
          )}

          {/* main */}
          <div className={hidden_sidebar ? 'col-12' : 'col shop-main-col'}>
            <div className="tp-shop-main-wrapper">
              <div className="shop-toolbar-sticky">
                <div className="tp-shop-top">
                  <div className="row align-items-start">
                    <div className="col-xl-7 mb-10">
                      <ShopTopLeft
                        total={totalProducts || all_products.length} // Show total products, not filtered
                        chips={chips}
                        onRemoveChip={removeChip}
                        onClearAll={resetAll}
                      />
                    </div>
                    <div className="col-xl-5">
                      <div className="shopTopRight" role="region" aria-label="Sort toolbar">
                        {/* Enhanced Sort Dropdown */}
                        {selectHandleFilter && (
                          <div className="shopSort d-none d-lg-block">
                            <div className="sort-dropdown-wrapper">
                              <select 
                                onChange={(e) => {
                                  if (selectHandleFilter) {
                                    selectHandleFilter({ value: e.target.value });
                                  }
                                }} 
                                aria-label="Sort products"
                                className="sort-select"
                              >
                                <option value="default">Sort: Recommended</option>
                                <option value="nameAsc">Name: A to Z</option>
                                <option value="nameDesc">Name: Z to A</option>
                                <option value="new">Recently Added</option>
                                <option value="old">First Added</option>
                              </select>
                              <div className="sort-dropdown-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Mobile Filter button */}
                        <div className="shopFilterBtn d-lg-none">
                          <button
                            type="button"
                            className="tp-filter-btn"
                            onClick={() => dispatch(handleFilterSidebarOpen())}
                            aria-label="Open filters"
                          >
                            <span className="tp-filter-icon"><Filter /></span>
                            <span className="tp-filter-label">Filter</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="tp-shop-items-wrapper tp-shop-item-primary">
                {filteredRows.length === 0 ? (
                  <div className="shop-empty" style={{ '--page-offset': `${centerOffset}px` }}>
                    <EmptyState
                      title="No products match your filters"
                      subtitle="Try adjusting your filters."
                      tips={['Clear some filters', 'Try a different category', 'Widen the price range']}
                      primaryAction={{ label: 'Reset all filters', onClick: resetAll }}
                      secondaryAction={{ label: 'Browse all products', href: '/fabric' }}
                    />
                  </div>
                ) : (
                  <>
                    {/* ✅ Grid only */}
                    <div className="products-grid">
                      {filteredRows.map((item, i) => {
                        const uniqueKey = item._id || item.id || `product-${i}`;
                        return (
                          <ProductItem 
                            key={uniqueKey} 
                            product={item} 
                            index={i} 
                          />
                        );
                      })}
                    </div>

                    {/* Enhanced Load More Button */}
                    {(products.length < (totalProducts || all_products.length)) && (
                      <div className="load-more-wrapper">
                        <div className="load-more-container">
                          <div className="load-more-info">
                            <span className="products-shown">
                              Showing {filteredRows.length} of {totalProducts || all_products.length} products
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`load-more-btn enhanced ${isLoadingMore ? 'loading' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (hasMorePages && loadMoreProducts && !isLoadingMore) {
                                loadMoreProducts();
                              }
                            }}
                            disabled={!hasMorePages || isLoadingMore}
                          >
                            <span className="load-more-text">
                              {isLoadingMore ? 'Loading...' : 'Load More'}
                            </span>
                            {!isLoadingMore && (
                              <span className="load-more-count">
                                ({Math.min(50, (totalProducts || all_products.length) - filteredRows.length)})
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {shop_right && <aside className="col-xl-3 col-lg-4 d-none d-lg-block" />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .tp-shop-main-wrapper { overflow: visible; }
        .tp-shop-top{ padding: 14px 0; border-bottom: 1px solid var(--tp-grey-2); }
        .shop-empty {
          min-height: calc(100vh - var(--page-offset, 140px));
          display: grid;
          place-items: center;
          padding: 8px 0;
        }
        .shop-main-col { min-width: 0; }
        .products-grid{
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap:18px;
          width:100%;
          margin-top: 18px;
        }
        @media (min-width: 1200px){
          .products-grid{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        .load-more-wrapper{ 
          display: flex; 
          justify-content: center; 
          margin-top: 40px;
          padding: 20px 0;
        }
        
        .load-more-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 400px;
          width: 100%;
        }
        
        .load-more-info {
          text-align: center;
        }
        
        .products-shown {
          font-size: 14px;
          color: var(--tp-text-2);
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        
        .load-more-btn.enhanced {
          background: white;
          color: var(--tp-theme-primary);
          border: 2px solid var(--tp-theme-primary);
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: auto;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(44, 76, 151, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .load-more-btn.enhanced:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--tp-theme-primary);
          transition: left 0.3s ease;
          z-index: 0;
        }
        
        .load-more-btn.enhanced:hover:before {
          left: 0;
        }
        
        .load-more-btn.enhanced:hover {
          color: white;
          border-color: var(--tp-theme-primary);
          box-shadow: 0 3px 12px rgba(44, 76, 151, 0.25);
          transform: translateY(-1px);
        }
        
        .load-more-text,
        .load-more-count {
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        
        .load-more-text {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        .load-more-count {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.8;
        }
        
        .load-more-btn.enhanced:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .load-more-btn.enhanced:disabled:hover {
          transform: none;
          box-shadow: 0 2px 6px rgba(44, 76, 151, 0.15);
          color: var(--tp-theme-primary);
        }
        
        .load-more-btn.enhanced:disabled:before {
          left: -100%;
        }
        
        .load-more-btn.enhanced.loading {
          pointer-events: none;
        }
        
        .load-more-btn.enhanced.loading .load-more-text {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @media (max-width: 640px) {
          .load-more-btn.enhanced {
            padding: 7px 16px;
            font-size: 13px;
            gap: 4px;
          }
          
          .load-more-text {
            font-size: 13px;
          }
          
          .load-more-count {
            font-size: 11px;
          }
        }
        @media (max-width: 991.98px){
          .shop-sidebar-col{ flex:1 1 auto; max-width:100%; }
        }
        .shopTopRight{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:12px;
        }
        .shopSort select{
          height:44px;
          border:1px solid var(--tp-grey-2);
          border-radius:10px;
          padding:0 12px;
          background:var(--tp-common-white);
          font: 600 13px/1 var(--tp-ff-roboto);
          color:var(--tp-text-1);
          cursor:pointer;
        }
        
        /* Enhanced Sort Dropdown Styling */
        .sort-dropdown-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .sort-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          height: 44px;
          min-width: 180px;
          border: 2px solid var(--tp-grey-2);
          border-radius: 12px;
          padding: 0 40px 0 16px;
          background: var(--tp-common-white);
          font: 600 13px/1 var(--tp-ff-roboto);
          color: var(--tp-text-1);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        
        .sort-select:hover {
          border-color: var(--tp-theme-primary);
          box-shadow: 0 4px 12px rgba(44, 76, 151, 0.15);
        }
        
        .sort-select:focus {
          outline: none;
          border-color: var(--tp-theme-primary);
          box-shadow: 0 0 0 3px rgba(44, 76, 151, 0.12);
        }
        
        .sort-dropdown-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--tp-text-2);
          transition: all 0.3s ease;
        }
        
        .sort-dropdown-wrapper:hover .sort-dropdown-icon {
          color: var(--tp-theme-primary);
        }
        
        .sort-select option {
          padding: 8px 16px;
          font-weight: 500;
          color: var(--tp-text-1);
          background: var(--tp-common-white);
        }
        
        .sort-select option:hover {
          background: var(--tp-grey-1);
        }
        @media (max-width: 640px){
          .shopTopRight{
            display:grid;
            grid-template-columns:minmax(0,1fr) 132px;
            gap:10px;
          }
        }
      `}} />
    </section>
  );
};

export default ShopContent;
