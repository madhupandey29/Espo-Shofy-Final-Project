'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import ShopFilterOffCanvas from '../common/shop-filter-offcanvas';
import ShopContent from './shop-content';
import ShopHiddenSidebarArea from './shop-hidden-sidebar-area';

const PROPERTY_MAP = Object.freeze({
  category: 'category',
  color: 'color',
  content: 'content',
  design: 'design',
  structure: 'structure',
  finish: 'finish',
  motif: 'motif',
  collectionId: 'collectionId',
  vendor: 'vendor',
  suitablefor: 'subsuitable',
  motifsize: 'motif',
  substructure: 'substructure',
  subfinish: 'subfinish',
  subsuitable: 'subsuitable',
});

export default function ShopArea({ 
  shop_right = false, 
  hidden_sidebar = false, 
  initialProducts = [], 
  totalProducts = 0
}) {
  console.log('🏪 ShopArea - Simple Mode:', { 
    initialProductsLength: initialProducts.length, 
    totalProducts,
    firstProduct: initialProducts[0]?.name || 'No products'
  });

  // ────── URL params ─────────────────────────
  const p = useSearchParams();
  const category = p.get('category');
  const minPrice = p.get('minPrice');
  const maxPrice = p.get('maxPrice');
  const filterColor = p.get('color');
  const filterStructure = p.get('structure');
  const filterContent = p.get('content');
  const filterFinish = p.get('finish');
  const searchQuery = p.get('q') || p.get('searchText');

  // ────── State & handlers ────────────────────
  const [priceValue, setPriceValue] = useState([0, 1000]);
  const [selectValue, setSelectValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(!!searchQuery);

  const handleFilterChange = (obj) => {
    setSelectedFilters(obj);
  };
  
  const handleSlider = (val) => {
    setPriceValue(val);
  };
  
  const handleSelect = (e) => {
    setSelectValue(e.value);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearchActive(!!results);
  };

  // Perform search when searchQuery from URL changes
  useEffect(() => {
    const performSearch = async (query) => {
      if (!query || !query.trim() || query.trim().length < 2) {
        setSearchResults(null);
        setIsSearchActive(false);
        return;
      }

      try {
        // Get all products first
        const response = await fetch(`https://espobackend.vercel.app/api/product?limit=1000`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && Array.isArray(data.data)) {
            // Client-side search filtering since backend search is not working
            const searchTerm = query.trim().toLowerCase();
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
            
            const searchResults = {
              success: true,
              data: filteredProducts,
              total: filteredProducts.length
            };
            
            setSearchResults(searchResults);
            setIsSearchActive(true);
          } else {
            setSearchResults({ data: [], total: 0, success: false });
            setIsSearchActive(true);
          }
        } else {
          console.error('Search API error:', response.status);
          setSearchResults({ data: [], total: 0, success: false });
          setIsSearchActive(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ data: [], total: 0, success: false });
        setIsSearchActive(true);
      }
    };

    performSearch(searchQuery);
  }, [searchQuery]);

  const otherProps = {
    priceFilterValues: { priceValue, handleChanges: handleSlider, setPriceValue },
    selectHandleFilter: handleSelect,
    selectedFilters, 
    handleFilterChange,
    totalProducts: isSearchActive ? (searchResults?.data?.length || 0) : totalProducts,
    isSearchActive,
    searchResults,
    handleSearchResults,
  };

  // ────── NO API CALLS - Use only server-side data ───────────────────────
  // Remove all Redux API calls - we have all data from server

  // Use all products - no pagination needed
  const products = useMemo(() => {
    // Use search results if search is active
    if (isSearchActive && searchResults) {
      return searchResults.data || [];
    }
    
    // Use all initial products (no pagination, no API calls)
    return Array.isArray(initialProducts) ? initialProducts : [];
  }, [isSearchActive, searchResults, initialProducts]);

  // auto-expand price slider max
  useEffect(() => {
    if (products.length) {
      const max = products.reduce((m, pr) => Math.max(m, +pr.salesPrice || 0), 0);
      if (max > priceValue[1]) setPriceValue(([lo]) => [lo, max]);
    }
  }, [products, priceValue]);

  // ────── Filtering & sorting ─────────────────
  const filteredProducts = useMemo(() => {
    let items = products;

    // 1) checkbox‐sidebar filters
    const active = Object.entries(selectedFilters).filter(([, arr]) => arr.length);
    if (active.length) {
      items = items.filter(pr =>
        active.every(([key, vals]) => {
          const prop = PROPERTY_MAP[key];
          if (!prop || !pr[prop]) return false;
          const field = pr[prop];
          
          // Handle array fields
          if (Array.isArray(field)) {
            return field.some(x => vals.includes(x._id ?? x));
          }
          
          // Handle comma-separated string fields (like finish)
          if (typeof field === 'string' && field.includes(',')) {
            const fieldValues = field.split(',').map(v => v.trim());
            return vals.some(val => fieldValues.includes(val));
          }
          
          // Handle regular fields
          return vals.includes(field._id ?? field);
        })
      );
    }

    // 2) sort
    if (selectValue === 'nameAsc') items = [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (selectValue === 'nameDesc') items = [...items].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    if (selectValue === 'new') items = [...items].sort((a, b) => new Date(b.createdAt || b.published_at || 0) - new Date(a.createdAt || a.published_at || 0));
    if (selectValue === 'old') items = [...items].sort((a, b) => new Date(a.createdAt || a.published_at || 0) - new Date(b.createdAt || b.published_at || 0));

    // 3) URL‐string filters
    const slugify = s => s?.toLowerCase().replace(/&/g, '').split(' ').join('-');
    if (category) items = items.filter(p => slugify(p.category?.name) === category);
    if (filterColor) items = items.filter(p => p.color?.some(c => slugify(c.name) === filterColor));
    if (filterStructure) items = items.filter(p => slugify(p.structure) === filterStructure);
    if (filterContent) items = items.filter(p => slugify(p.content?.name) === filterContent);
    if (filterFinish) items = items.filter(p => {
      if (p.finish && p.finish.includes(',')) {
        const finishValues = p.finish.split(',').map(v => v.trim());
        return finishValues.some(f => slugify(f) === filterFinish);
      }
      return slugify(p.finish) === filterFinish;
    });

    if (minPrice && maxPrice) {
      items = items.filter(p => +p.salesPrice >= +minPrice && +p.salesPrice <= +maxPrice);
    }

    return items;
  }, [
    products,
    selectedFilters, selectValue,
    category, filterColor, filterStructure, filterContent, filterFinish,
    minPrice, maxPrice,
  ]);

  // ────── Choose which main component to show ───
  let content;
  if (hidden_sidebar) {
    content = (
      <ShopHiddenSidebarArea
        all_products={products}
        products={filteredProducts}
        otherProps={otherProps}
      />
    );
  } else {
    content = (
      <ShopContent
        all_products={products}
        products={filteredProducts}
        otherProps={otherProps}
        shop_right={shop_right}
        hidden_sidebar={hidden_sidebar}
      />
    );
  }

  return (
    <>
      {content}

      {/* off-canvas filter */}
      <ShopFilterOffCanvas
        all_products={products}
        otherProps={otherProps}
        right_side={shop_right}
      />
    </>
  );
}