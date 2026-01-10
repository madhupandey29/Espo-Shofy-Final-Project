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

const getFirst = (...xs) => xs.find((x) => x !== undefined && x !== null);

/* ----- Stars ----- */
const Stars = ({ value }) => {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const iconStyle = { marginRight: 4, color: '#f59e0b' };

  return (
    <span aria-label={`Rating ${v} out of 5`}>
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
    vendorFabricCode
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

  const seoDoc = null; // Removed SEO API call

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

  // ✅ IMPORTANT: better Fabric Code fallback (productItem + productFull + alternate keys)
  const fabricCodeDisplay = pick(
    fabricCode,
    productItem?.fabricCode,
    productItem?.fabriccode,
    productFull?.fabricCode,
    productFull?.fabricCode,
    productFull?.fabriccode,
    vendorFabricCode,
    productItem?.vendorFabricCode,
    productFull?.vendorFabricCode
  );

  // ✅ Keep unit only for MOQ formatting (but DO NOT show UNIT row)
  const unitDisplay = pick(uM, productFull?.uM, productItem?.unit, productItem?.unitOfMeasure);

  const moqNum = asNumber(pick(salesMOQ, productFull?.salesMOQ, productItem?.moq, productItem?.minOrderQty));
  const moqDisplay = moqNum != null ? `${moqNum}${unitDisplay ? ` ${unitDisplay}` : ''}` : 'N/A';

  const categoryBadge = useMemo(() => {
    const c = pick(category?.name, newCategoryId?.name, category);
    return nonEmpty(c) ? String(c) : 'N/A';
  }, [category, newCategoryId, category]);

  return (
    <div className="product-details-modern-wrapper">
      {/* Header */}
      <div className="product-header">
        <div className="product-category">
          <span className="category-badge">{categoryBadge}</span>
          <span className="stock-badge">{supplyModelDisplay}</span>
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
            <span className="fact-label">Finish</span>
            <span className="fact-value fact-value-wrap">
              {Array.isArray(finish) ? finish.join(', ') : finish || 'N/A'}
            </span>
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

          {/* ✅ Removed UNIT row */}

          <div className="fact-item">
            <span className="fact-label">Fabric Code</span>
            <span className="fact-value">{fabricCodeDisplay}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Sales MOQ</span>
            <span className="fact-value">{moqDisplay}</span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Rating</span>
            <span className="fact-value">
              <span className="rating-inline">
                <Stars value={ratingValue} />
                {nonEmpty(ratingCount) ? <span className="rating-count">({ratingCount})</span> : null}
              </span>
            </span>
          </div>

          <div className="fact-item">
            <span className="fact-label">Supply Model</span>
            <span className="fact-value">{supplyModelDisplay}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="action-section">
        <div className="action-buttons">
          <button className="action-btn primary">
            <i className="fa-regular fa-file-lines"></i>
            <span className="btn-text">Request Sample</span>
          </button>

          <button className="action-btn secondary">
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
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 999px;
          font-family: var(--tp-ff-jost);
        }

        .stock-badge {
          display: inline-block;
          padding: 6px 12px;
          background: var(--tp-theme-green);
          color: var(--tp-common-white);
          font-size: 11px;
          font-weight: 700;
          text-transform: lowercase;
          border-radius: 999px;
          font-family: var(--tp-ff-jost);
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

        /* ✅ Cleaner spec “table” UI */
        .quick-facts-section {
          background: var(--tp-common-white);
          border-radius: 12px;
          margin-top: 16px;
          border: 1px solid var(--tp-grey-2);
          overflow: hidden;
        }

        .facts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .fact-item {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 10px;
          padding: 14px 14px;
          border-bottom: 1px solid var(--tp-grey-2);
          align-items: start;
        }

        /* right column divider on desktop */
        .fact-item:nth-child(odd) {
          border-right: 1px solid var(--tp-grey-2);
        }

        .fact-item:last-child,
        .fact-item:nth-last-child(2) {
          border-bottom: none;
        }

        .fact-label {
          font-family: var(--tp-ff-jost);
          font-size: 12px;
          font-weight: 800;
          color: var(--tp-text-2);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          line-height: 1.2;
          padding-top: 2px;
        }

        .fact-value {
          font-family: var(--tp-ff-roboto);
          font-size: 13px;
          font-weight: 600;
          color: var(--tp-text-1);
          text-align: right;
          line-height: 1.35;
          word-break: break-word;
        }

        .fact-value-wrap {
          white-space: normal;
        }

        .rating-inline {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          width: 100%;
        }

        .rating-count {
          font-size: 12px;
          color: var(--tp-text-2);
          font-weight: 700;
        }

        /* Actions */
        .action-section {
          margin-top: 18px;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 10px;
          border: none;
          border-radius: 12px;
          font-family: var(--tp-ff-jost);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          transition: all 0.2s ease;
          cursor: pointer;
          min-height: 50px;
        }

        .action-btn.primary {
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
        }

        .action-btn.primary:hover {
          transform: translateY(-1px);
        }

        .action-btn.secondary {
          background: var(--tp-theme-secondary);
          color: var(--tp-theme-primary);
          border: 1px solid var(--tp-theme-primary);
        }

        .action-btn.secondary:hover {
          transform: translateY(-1px);
        }

        .wishlist-btn {
          width: 50px;
          min-width: 50px;
          height: 50px;
          background: var(--tp-common-white);
          border: 2px solid var(--tp-grey-3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: var(--tp-text-2);
          transition: all 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .wishlist-btn.active {
          background: var(--tp-theme-primary);
          border-color: var(--tp-theme-primary);
          color: var(--tp-common-white);
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 20px;
          }

          .facts-grid {
            grid-template-columns: 1fr;
          }

          .fact-item {
            border-right: none !important;
          }

          .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 8px;
            align-items: stretch;
          }

          .action-btn {
            min-height: 44px;
            padding: 10px 8px;
            font-size: 11px;
          }

          .wishlist-btn {
            width: 44px;
            min-width: 44px;
            height: 44px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .action-buttons {
            grid-template-columns: 1fr 1fr auto;
            gap: 6px;
          }

          .action-btn {
            min-height: 40px;
            padding: 8px 6px;
            font-size: 10px;
          }

          .wishlist-btn {
            width: 40px;
            min-width: 40px;
            height: 40px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailsWrapper;
