/* ----------------------------------------------------------------------
   components/product-details/details-wrapper.jsx
---------------------------------------------------------------------- */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { useGetDesignByIdQuery } from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery } from '@/redux/features/motifSizeApi';

import { add_to_wishlist } from '@/redux/features/wishlist-slice';

/* ---------------- small helpers ---------------- */
const nonEmpty = (v) =>
  v !== undefined && v !== null && (typeof v === 'number' || String(v).trim() !== '');

const pick = (...xs) => xs.find(nonEmpty);

const asNumber = (value) => {
  if (value === undefined || value === null) return undefined;
  const n = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

const isObjId = (s) => typeof s === 'string' && /^[a-f\d]{24}$/i.test(s);

/* ---------------- API helpers ---------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_KEY_HEADER = process.env.NEXT_PUBLIC_API_KEY_HEADER || 'x-api-key';

const fetchJson = async (url) => {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers[API_KEY_HEADER] = API_KEY;

  const res = await fetch(url, { headers, credentials: 'include' });
  if (!res.ok) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
};

/* ----- Stars (only stars; no rating number text) ----- */
const Stars = ({ value }) => {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const iconStyle = { marginRight: 4, color: '#f59e0b' };

  return (
    <span aria-label={`Rating ${v} out of 5`} className="stars-only">
      {Array.from({ length: full }).map((_, i) => (
        <i key={`f${i}`} className="fa-solid fa-star" style={iconStyle} />
      ))}
      {half === 1 && <i className="fa-solid fa-star-half-stroke" style={iconStyle} />}
      {Array.from({ length: empty }).map((_, i) => (
        <i key={`e${i}`} className="fa-regular fa-star" style={iconStyle} />
      ))}
    </span>
  );
};

/* ---------------- Specific resolvers ---------------- */
const useDesignName = (design, designId) => {
  const direct = useMemo(() => {
    if (typeof design === 'object') return design?.name;
    if (typeof design === 'string' && !isObjId(design)) return design;
    return undefined;
  }, [design]);

  const id = useMemo(() => {
    if (typeof design === 'object') return design?._id;
    if (typeof design === 'string' && isObjId(design)) return design;
    if (typeof designId === 'string' && isObjId(designId)) return designId;
    return undefined;
  }, [design, designId]);

  const { data: dQ } = useGetDesignByIdQuery(id, { skip: !id });
  const fromRtk = dQ?.data?.name;

  return pick(direct, fromRtk);
};

const useMotifName = (motif, motifId) => {
  const direct = useMemo(() => {
    if (typeof motif === 'object') return motif?.name || motif?.size;
    if (typeof motif === 'string' && !isObjId(motif)) return motif;
    return undefined;
  }, [motif]);

  const id = useMemo(() => {
    if (typeof motif === 'object') return motif?._id;
    if (typeof motif === 'string' && isObjId(motif)) return motif;
    if (typeof motifId === 'string' && isObjId(motifId)) return motifId;
    return undefined;
  }, [motif, motifId]);

  const { data: mQ } = useGetMotifSizeByIdQuery(id, { skip: !id });
  const fromRtk = mQ?.data?.name || mQ?.data?.size;

  return pick(direct, fromRtk);
};

const useColorNames = (colors) => {
  const arr = useMemo(() => {
    if (!colors) return [];
    if (Array.isArray(colors)) return colors;
    if (typeof colors === 'string') return colors.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  }, [colors]);

  const givenNames = useMemo(
    () =>
      arr
        .map((x) => (typeof x === 'string' ? (!isObjId(x) ? x : null) : x?.name))
        .filter(Boolean),
    [arr]
  );

  return givenNames;
};

/* ---------------- Main component ---------------- */
const DetailsWrapper = ({ productItem = {} }) => {
  const params = useSearchParams();
  const q = (params?.get('searchText') || '').trim();
  const query = q.toLowerCase();

  const highlight = (text) => {
    const s = String(text || '');
    if (!query) return s;
    try {
      const re = new RegExp(`(${q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'ig');
      return s.replace(re, '<mark style="background:#fff3bf">$1</mark>');
    } catch {
      return s;
    }
  };

  const {
    id,
    _id,

    name,
    productTitle,

    category,
    newCategoryId,

    description,
    shortProductDescription,
    shortDescription,

    slug,
    productslug,

    leadtime,
    status,
    supplyModel,

    structure,
    content,
    finish,

    design,
    designId,

    motif,
    motifId,

    color,
    colors,

    gsm,
    oz,
    cm,
    inch,
    width,

    // fields from API
    uM,
    salesMOQ,
    fabricCode,
    vendorFabricCode,
  } = productItem;

  const productId = pick(_id, id);
  const slugValue = pick(slug, productslug);
  const titleValue = pick(productTitle, name);

  /* Fetch full product (slug) for reliable fields */
  const [productFull, setProductFull] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!API_BASE || !slugValue) {
        if (live) setProductFull(null);
        return;
      }
      const json = await fetchJson(`${API_BASE}/product/${slugValue}`);
      const data = json?.data || null;
      if (live) setProductFull(data);
    })();
    return () => {
      live = false;
    };
  }, [slugValue]);

  const supplyModelDisplay = pick(
    supplyModel,
    productFull?.supplyModel,
    Array.isArray(leadtime) && leadtime.length > 0 ? leadtime[0] : null,
    status,
    'In Stock'
  );

  const shortDescHtml = pick(
    shortProductDescription,
    productFull?.shortProductDescription,
    shortDescription
  );

  const seoDoc = null;

  const ratingValue = pick(productItem?.ratingValue, productFull?.ratingValue, seoDoc?.rating_value);
  const ratingCount = pick(productItem?.ratingCount, productFull?.ratingCount, seoDoc?.rating_count);

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist?.some((prd) => pick(prd?._id, prd?.id) === productId);
  const toggleWishlist = () => dispatch(add_to_wishlist(productItem));

  /* Computed displays */
  const weightParts = [];
  if (nonEmpty(gsm)) weightParts.push(`${gsm} gsm`);
  if (nonEmpty(oz)) weightParts.push(`${Number(oz).toFixed(1)} oz`);
  const weightDisplay = weightParts.join(' / ') || 'N/A';

  const cmNum = asNumber(cm ?? width);
  const inchNum = asNumber(inch);
  const widthDisplay =
    [cmNum != null ? `${cmNum} cm` : undefined, inchNum != null ? `${Math.round(inchNum)} inch` : undefined]
      .filter(Boolean)
      .join(' / ') || 'N/A';

  const designName = useDesignName(design, designId);
  const motifName = useMotifName(motif || productItem?.motifsize, motifId);
  const colorNames = useColorNames(Array.isArray(color) ? color : Array.isArray(colors) ? colors : []);

  const fabricCodeDisplay = pick(
    fabricCode,
    productItem?.fabricCode,
    productItem?.fabriccode,
    productFull?.fabricCode,
    productFull?.fabriccode,
    vendorFabricCode,
    productItem?.vendorFabricCode,
    productFull?.vendorFabricCode
  );

  const unitDisplay = pick(uM, productFull?.uM, productItem?.unit, productItem?.unitOfMeasure);

  const moqNum = asNumber(pick(salesMOQ, productFull?.salesMOQ, productItem?.moq, productItem?.minOrderQty));
  const moqDisplay = moqNum != null ? `${moqNum}${unitDisplay ? ` ${unitDisplay}` : ''}` : 'N/A';

  const categoryBadge = useMemo(() => {
    const c = pick(category?.name, newCategoryId?.name, category);
    return nonEmpty(c) ? String(c) : 'N/A';
  }, [category, newCategoryId, category]);

  // ✅ Finish display: compact tags/chips format
  const finishDisplay = useMemo(() => {
    const raw = pick(finish, productFull?.finish);
    if (!raw) return null;
    
    // Split by common separators and clean up
    let finishArray = [];
    if (Array.isArray(raw)) {
      finishArray = raw.filter(Boolean);
    } else {
      const str = String(raw);
      // Split by bullet, comma, semicolon, or " - "
      finishArray = str
        .split(/[•,;]|\s-\s/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    
    return finishArray;
  }, [finish, productFull?.finish]);

  return (
    <div className="product-details-modern-wrapper">
      {/* Header */}
      <div className="product-header">
        <div className="product-category">
          <span className="category-badge">{categoryBadge}</span>
          <span className="stock-badge">{supplyModelDisplay}</span>
          {nonEmpty(fabricCodeDisplay) && fabricCodeDisplay !== 'N/A' && (
            <span className="fabric-code-badge">{fabricCodeDisplay}</span>
          )}
          <span className="rating-badge">
            <Stars value={ratingValue} />
          </span>
        </div>

        <h1 className="product-title" dangerouslySetInnerHTML={{ __html: highlight(titleValue) }} />

        {nonEmpty(shortDescHtml) ? (
          <div className="product-description" dangerouslySetInnerHTML={{ __html: shortDescHtml }} />
        ) : (
          <p className="product-description" dangerouslySetInnerHTML={{ __html: highlight(description) }} />
        )}
      </div>

      {/* Specs */}
      <div className="quick-facts-section">
        <div className="facts-grid">
          <div className="fact-item">
            <span className="fact-label">Content</span>
            <span className="fact-value">{Array.isArray(content) ? content.join(', ') : content || 'N/A'}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Width</span>
            <span className="fact-value">{widthDisplay}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Weight</span>
            <span className="fact-value">{weightDisplay}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Design</span>
            <span className="fact-value">{design || designName || 'N/A'}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Structure</span>
            <span className="fact-value">{structure || 'N/A'}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Colors</span>
            <span className="fact-value">{colorNames?.length ? colorNames.join(', ') : 'N/A'}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Motif</span>
            <span className="fact-value">{motif || motifName || 'N/A'}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Sales MOQ</span>
            <span className="fact-value">{moqDisplay}</span>
          </div>

          <div className="fact-item fact-item-finish">
            <span className="fact-label">Finish</span>
            <span className="fact-value">
              {finishDisplay && finishDisplay.length > 0 ? finishDisplay.join(', ') : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="action-section">
        <div className="action-buttons">
          <button className="action-btn primary" type="button">
            <i className="fa-regular fa-file-lines"></i>
            <span className="btn-text">Request Sample</span>
          </button>

          <button className="action-btn secondary" type="button">
            <i className="fa-regular fa-comment-dots"></i>
            <span className="btn-text">Request Quote</span>
          </button>

          <button
            type="button"
            onClick={toggleWishlist}
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            aria-label="Add to Wishlist"
          >
            <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-details-modern-wrapper {
          padding: 0 0 20px 0;
          height: fit-content;
        }

        .product-header {
          margin-bottom: 18px;
        }

        .product-category {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 999px;
          font-family: var(--tp-ff-jost);
          letter-spacing: 0.3px;
        }

        .stock-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--tp-theme-green);
          color: var(--tp-common-white);
          font-size: 11px;
          font-weight: 700;
          text-transform: lowercase;
          border-radius: 999px;
          font-family: var(--tp-ff-jost);
        }
        
        .fabric-code-badge {
          display: inline-block;
          padding: 6px 14px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: var(--tp-common-white);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 999px;
          font-family: var(--tp-ff-jost);
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }
        
        .rating-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1.5px solid #f59e0b;
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
        }
        
        .rating-badge .stars-only {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .rating-badge .stars-only i {
          font-size: 12px !important;
          margin-right: 0 !important;
        }

        .product-title {
          font-family: var(--tp-ff-jost);
          font-size: 28px;
          font-weight: 800;
          color: var(--tp-text-1);
          margin: 0 0 10px 0;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }

        .product-description {
          font-family: var(--tp-ff-roboto);
          font-size: 15px;
          line-height: 1.6;
          color: var(--tp-text-2);
          margin: 0;
        }

        /* ✅ Specs table */
        .quick-facts-section {
          --spec-accent: #2C4C97;
          --spec-mint: rgba(44, 76, 151, 0.08);
          --spec-border: rgba(20, 46, 46, 0.12);
          --spec-text-dim: rgba(20, 46, 46, 0.72);

          background: var(--tp-common-white);
          border-radius: 15px;
          margin-top: 18px;
          border: 1px solid var(--spec-border);
          overflow: hidden;

          border-top: 3px solid var(--spec-accent);
          box-shadow: 0 10px 24px rgba(16, 24, 40, 0.06);
        }

        .facts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ✅ KEY FIX: value column uses minmax(0, 1fr) so it never collapses */
        .fact-item {
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr);
          gap: 12px;
          padding: 15px 18px;
          border-bottom: 1px solid var(--spec-border);
          align-items: start;
        }

        .fact-item:nth-child(odd) {
          border-right: 1px solid var(--spec-border);
        }

        .fact-item:nth-child(4n + 1),
        .fact-item:nth-child(4n + 2) {
          background: var(--spec-mint);
        }

        .fact-item:last-child,
        .fact-item:nth-last-child(2) {
          border-bottom: none;
        }

        .fact-label {
          font-family: var(--tp-ff-jost);
          font-size: 12.5px;
          font-weight: 900;
          color: var(--spec-accent);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.25;
          padding-top: 2px;
        }

        /* ✅ KEY FIX: min-width:0 + remove "anywhere" prevents vertical letters */
        .fact-value {
          min-width: 0;
          font-family: var(--tp-ff-roboto);
          font-size: 14.5px;
          font-weight: 700;
          color: var(--tp-text-1);
          text-align: right;
          line-height: 1.4;
          word-break: normal;
          overflow-wrap: break-word;
        }

        /* ✅ Finish: simple comma-separated text */
        .fact-item-finish {
          grid-column: 1 / -1; /* Span full width */
        }

        .rating-inline {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          width: 100%;
          min-width: 0;
        }

        .rating-count {
          font-size: 12px;
          color: var(--spec-text-dim);
          font-weight: 800;
          white-space: nowrap;
        }

        /* ✅ Buttons: slightly smaller, still beautiful */
        .action-section {
          margin-top: 20px;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 13px 20px;
          border: none;
          border-radius: 14px;
          font-family: var(--tp-ff-jost);
          font-size: 12.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          min-height: 50px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .action-btn:hover::before {
          opacity: 1;
        }

        .action-btn i {
          font-size: 16px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .action-btn:hover i {
          transform: scale(1.15) rotate(5deg);
        }

        /* Primary Button - Deep Blue (Theme Primary) */
        .action-btn.primary {
          background: linear-gradient(135deg, #2C4C97 0%, #1e3a7a 100%);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(44, 76, 151, 0.35);
        }
        
        .action-btn.primary:hover {
          background: linear-gradient(135deg, #3558b0 0%, #2442a0 100%);
          box-shadow: 0 10px 28px rgba(44, 76, 151, 0.45);
          transform: translateY(-2px);
        }

        /* Secondary Button - Yellow/Gold (Theme Secondary) */
        .action-btn.secondary {
          background: linear-gradient(135deg, #d6854b99 0%, #b8903f 100%);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(214, 167, 75, 0.35);
        }
        
        .action-btn.secondary:hover {
          background: linear-gradient(135deg, #e0b55f 0%, #c89535 100%);
          box-shadow: 0 10px 28px rgba(214, 167, 75, 0.45);
          transform: translateY(-2px);
        }

        .action-btn:active {
          transform: translateY(-1px);
        }
        
        .btn-text {
          font-weight: 800;
        }

        /* ✅ Wishlist: slightly smaller */
        .wishlist-btn {
          width: 50px;
          min-width: 50px;
          height: 50px;
          background: #ffffff;
          border: 2px solid rgba(16, 24, 40, 0.15);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: rgba(16, 24, 40, 0.45);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(16, 24, 40, 0.08);
          position: relative;
          overflow: hidden;
        }
        
        .wishlist-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(44, 76, 151, 0.08);
          transform: translate(-50%, -50%);
          transition: width 0.5s ease, height 0.5s ease;
        }
        
        .wishlist-btn:hover::before {
          width: 120%;
          height: 120%;
        }
        
        .wishlist-btn i {
          position: relative;
          z-index: 1;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wishlist-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 24, 40, 0.15);
          border-color: rgba(44, 76, 151, 0.35);
          color: rgba(44, 76, 151, 0.85);
        }
        
        .wishlist-btn:hover i {
          transform: scale(1.15);
        }

        .wishlist-btn.active {
          background: linear-gradient(135deg, #ff5a7a 0%, #e11d48 100%);
          border-color: rgba(225, 29, 72, 0.4);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(225, 29, 72, 0.35);
        }
        
        .wishlist-btn.active::before {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .wishlist-btn.active:hover {
          background: linear-gradient(135deg, #ff6b8a 0%, #e92d58 100%);
          box-shadow: 0 10px 28px rgba(225, 29, 72, 0.45);
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 20px;
          }
          
          .product-category {
            gap: 7px;
          }
          
          .category-badge,
          .stock-badge,
          .fabric-code-badge {
            font-size: 10px;
            padding: 5px 11px;
          }
          
          .rating-badge {
            padding: 4px 10px;
          }
          
          .rating-badge .stars-only i {
            font-size: 11px !important;
          }

          .facts-grid {
            grid-template-columns: 1fr;
          }

          .fact-item {
            border-right: none !important;
            grid-template-columns: 120px minmax(0, 1fr);
            padding: 11px 13px;
          }
          
          .fact-item-finish {
            grid-template-columns: 120px minmax(0, 1fr);
          }

          .fact-item:nth-child(even) {
            background: rgba(25, 163, 138, 0.08);
          }
          .fact-item:nth-child(odd) {
            background: var(--tp-common-white);
          }

          .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 9px;
            align-items: stretch;
          }

          .action-btn {
            min-height: 46px;
            padding: 11px 14px;
            font-size: 11.5px;
            border-radius: 12px;
            gap: 7px;
          }
          
          .action-btn i {
            font-size: 14px;
          }

          .wishlist-btn {
            width: 46px;
            min-width: 46px;
            height: 46px;
            border-radius: 12px;
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .action-buttons {
            grid-template-columns: 1fr 1fr auto;
            gap: 8px;
          }

          .action-btn {
            min-height: 42px;
            padding: 9px 8px;
            font-size: 10px;
          }

          .wishlist-btn {
            width: 42px;
            min-width: 42px;
            height: 42px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailsWrapper;
