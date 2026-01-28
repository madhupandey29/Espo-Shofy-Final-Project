'use client';

import React, { useState, useEffect, useMemo } from 'react';

import DetailsThumbWrapper from './details-thumb-wrapper';
import DetailsWrapper from './details-wrapper';
import DetailsTabNav from './details-tab-nav';
import RelatedProducts from './related-products';
import DetailsSuitableKeywords from './details-desc-suitable';
import AltTextDebugger from '../debug/AltTextDebugger';

export default function ProductDetailsContent({ productItem }) {
  // ✅ IMPORTANT: normalize productItem (handles {data:[{...}]} / [{...}] / {...})
  const p = useMemo(() => {
    if (!productItem) return {};
    
    // 🔍 Debug: Log the raw productItem received
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 ProductDetailsContent - Raw productItem received:', {
        type: typeof productItem,
        isArray: Array.isArray(productItem),
        hasData: !!productItem?.data,
        dataIsArray: Array.isArray(productItem?.data),
        altTextFields: {
          direct: {
            altTextImage1: productItem?.altTextImage1,
            altTextImage2: productItem?.altTextImage2,
            altTextImage3: productItem?.altTextImage3,
            altTextVideo: productItem?.altTextVideo
          },
          inData: productItem?.data ? {
            altTextImage1: productItem.data.altTextImage1,
            altTextImage2: productItem.data.altTextImage2,
            altTextImage3: productItem.data.altTextImage3,
            altTextVideo: productItem.data.altTextVideo
          } : 'No data property',
          inDataArray: (Array.isArray(productItem?.data) && productItem.data[0]) ? {
            altTextImage1: productItem.data[0].altTextImage1,
            altTextImage2: productItem.data[0].altTextImage2,
            altTextImage3: productItem.data[0].altTextImage3,
            altTextVideo: productItem.data[0].altTextVideo
          } : 'No data array or empty'
        }
      });
    }
    
    let normalizedProduct = {};
    
    if (Array.isArray(productItem)) {
      normalizedProduct = productItem[0] || {};
    } else if (Array.isArray(productItem?.data)) {
      normalizedProduct = productItem.data[0] || {};
    } else if (productItem?.data && typeof productItem.data === 'object') {
      normalizedProduct = productItem.data;
    } else {
      normalizedProduct = productItem;
    }
    
    // ✅ CRITICAL: Ensure collection data is preserved
    if (!normalizedProduct.collection && productItem?.data?.[0]?.collection) {
      normalizedProduct.collection = productItem.data[0].collection;
    }
    
    // ✅ CRITICAL: Preserve productTitle and other mapped fields from ProductDetailsClient
    if (productItem?.productTitle && !normalizedProduct.productTitle) {
      normalizedProduct.productTitle = productItem.productTitle;
    }
    if (productItem?.productTagline && !normalizedProduct.productTagline) {
      normalizedProduct.productTagline = productItem.productTagline;
    }
    if (productItem?.fabricCode && !normalizedProduct.fabricCode) {
      normalizedProduct.fabricCode = productItem.fabricCode;
    }
    if (productItem?.shortProductDescription && !normalizedProduct.shortProductDescription) {
      normalizedProduct.shortProductDescription = productItem.shortProductDescription;
    }
    if (productItem?.fullProductDescription && !normalizedProduct.fullProductDescription) {
      normalizedProduct.fullProductDescription = productItem.fullProductDescription;
    }
    
    // ✅ CRITICAL: Preserve alt text fields from ProductDetailsClient - Enhanced mapping
    if (productItem?.altTextImage1) {
      normalizedProduct.altTextImage1 = productItem.altTextImage1;
    }
    if (productItem?.altTextImage2) {
      normalizedProduct.altTextImage2 = productItem.altTextImage2;
    }
    if (productItem?.altTextImage3) {
      normalizedProduct.altTextImage3 = productItem.altTextImage3;
    }
    if (productItem?.altTextVideo) {
      normalizedProduct.altTextVideo = productItem.altTextVideo;
    }
    
    // ✅ Also check nested data structures for alt text
    if (Array.isArray(productItem?.data) && productItem.data[0]) {
      const firstItem = productItem.data[0];
      if (firstItem.altTextImage1 && !normalizedProduct.altTextImage1) {
        normalizedProduct.altTextImage1 = firstItem.altTextImage1;
      }
      if (firstItem.altTextImage2 && !normalizedProduct.altTextImage2) {
        normalizedProduct.altTextImage2 = firstItem.altTextImage2;
      }
      if (firstItem.altTextImage3 && !normalizedProduct.altTextImage3) {
        normalizedProduct.altTextImage3 = firstItem.altTextImage3;
      }
      if (firstItem.altTextVideo && !normalizedProduct.altTextVideo) {
        normalizedProduct.altTextVideo = firstItem.altTextVideo;
      }
    }
    
    // 🔍 Debug: Log the normalized product
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 ProductDetailsContent - Normalized Product Alt Text:', {
        productName: normalizedProduct.name,
        altTextImage1: normalizedProduct.altTextImage1,
        altTextImage2: normalizedProduct.altTextImage2,
        altTextImage3: normalizedProduct.altTextImage3,
        altTextVideo: normalizedProduct.altTextVideo,
        hasAnyAltText: !!(normalizedProduct.altTextImage1 || normalizedProduct.altTextImage2 || normalizedProduct.altTextImage3)
      });
    }
    
    return normalizedProduct;
  }, [productItem]);

  const _id = p?._id;

  // ✅ Extract alt text from the normalized product data with fallbacks
  const altTextImage1 = p?.altTextImage1 || 
                        (Array.isArray(productItem?.data) ? productItem.data[0]?.altTextImage1 : null) ||
                        (productItem?.data?.altTextImage1) ||
                        (productItem?.altTextImage1) ||
                        null;
                        
  const altTextImage2 = p?.altTextImage2 || 
                        (Array.isArray(productItem?.data) ? productItem.data[0]?.altTextImage2 : null) ||
                        (productItem?.data?.altTextImage2) ||
                        (productItem?.altTextImage2) ||
                        null;
                        
  const altTextImage3 = p?.altTextImage3 || 
                        (Array.isArray(productItem?.data) ? productItem.data[0]?.altTextImage3 : null) ||
                        (productItem?.data?.altTextImage3) ||
                        (productItem?.altTextImage3) ||
                        null;
                        
  const altTextVideo = p?.altTextVideo || 
                       (Array.isArray(productItem?.data) ? productItem.data[0]?.altTextVideo : null) ||
                       (productItem?.data?.altTextVideo) ||
                       (productItem?.altTextVideo) ||
                       null;

  // 🔍 Debug: Log alt text extraction in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ProductDetailsContent Alt Text Debug:', {
      productName: p?.name || p?.productTitle,
      altTextImage1,
      altTextImage2,
      altTextImage3,
      altTextVideo,
      rawProductKeys: Object.keys(p || {}),
      rawProductAltFields: {
        altTextImage1: p?.altTextImage1,
        altTextImage2: p?.altTextImage2,
        altTextImage3: p?.altTextImage3,
        altTextVideo: p?.altTextVideo
      },
      originalProductItem: productItem
    });
  }

  // ✅ normalize product media (your API uses image1,image2,image3 + videourl)
  const img = p?.img || p?.image || p?.image0 || p?.image1 || null;
  const image1 = p?.image1 || null;
  const image2 = p?.image2 || null;
  
  // Try to get image3 from multiple sources including raw productItem
  const image3 = p?.image3 || 
                 (Array.isArray(productItem?.data) ? productItem.data[0]?.image3 : null) ||
                 (productItem?.data?.image3) ||
                 (productItem?.image3) ||
                 null;

  // Try to get videourl from multiple sources including raw productItem  
  const videourl = p?.videourl || 
                   p?.videoUrl || 
                   (Array.isArray(productItem?.data) ? productItem.data[0]?.videourl : null) ||
                   (productItem?.data?.videourl) ||
                   (productItem?.videourl) ||
                   (p?.video && p.video !== "" ? p.video : null) || 
                   null;
                   
  const videoThumbnail = p?.videoThumbnail || null;
  
  const status = p?.status;
  
  // First, try the normal collection ID extraction
  const rawCollectionId = p?.collectionId || p?.collection?.id || p?.collection?._id || p?.collection || null;
  // FALLBACK STRATEGY: If the product name suggests it should be a different collection,
  // override the stored collection ID (this fixes data inconsistency issues)
  let collectionId = rawCollectionId;
  
  if (p?.name) {
    const productName = p.name.toLowerCase();
    const isNokiaProduct = productName.includes('nokia');
    const isMajesticaProduct = productName.includes('majestica');
    
    // Override collection ID based on product name if there's a mismatch
    if (isNokiaProduct && rawCollectionId !== '690a0e676132664ee') {
      collectionId = '690a0e676132664ee';
    } else if (isMajesticaProduct && rawCollectionId !== '695f9b0b956eb958b') {
      collectionId = '695f9b0b956eb958b';
    }
  }
  
  // Note: Group code functionality has been replaced with collection-based approach
  // const { groupCodeData, loading: groupCodeLoading, error: groupCodeError } = useGroupCodeData(collectionId);
  
  const collectionData = p?.collection || null;
  
  // ✅ active image (start from image1 for best UX)
  const [activeImg, setActiveImg] = useState(image1 || img || null);
  useEffect(() => {
    setActiveImg(image1 || img || null);
  }, [image1, img]);

  const handleImageActive = (item) => setActiveImg(item?.img ?? (image1 || img || null));

  // ✅ SEO data (removed API call)
  const seoData = null;

  // ✅ if product missing after normalize
  if (!_id) {
    return (
      <section className="tp-product-details-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div style={{ padding: 24, background: '#fff', borderRadius: 12, border: '1px solid #eee' }}>
                No product found!
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tp-product-details-area">
      <div className="tp-product-details-top pb-25">
        <div className="container">
          <div className="row">
            {/* Left: gallery */}
            <div className="col-xl-7 col-lg-6 col-md-12">
              <DetailsThumbWrapper
                key={_id}

                // ✅ PASS REAL product object (not wrapper)
                apiImages={p}
                
                // ✅ PASS collection data as groupCodeData for compatibility
                groupCodeData={collectionData}

                // ✅ PASS alt text data from API - Enhanced debugging
                altTextImage1={(() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Passing altTextImage1 to DetailsThumbWrapper:', altTextImage1);
                  }
                  return altTextImage1;
                })()}
                altTextImage2={(() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Passing altTextImage2 to DetailsThumbWrapper:', altTextImage2);
                  }
                  return altTextImage2;
                })()}
                altTextImage3={(() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Passing altTextImage3 to DetailsThumbWrapper:', altTextImage3);
                  }
                  return altTextImage3;
                })()}
                altTextVideo={(() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Passing altTextVideo to DetailsThumbWrapper:', altTextVideo);
                  }
                  return altTextVideo;
                })()}

                // ✅ control main image properly
                activeImg={activeImg}
                handleImageActive={handleImageActive}

                // ✅ keep legacy props too (safe)
                img={img}
                image1={image1}
                image2={image2}
                image3={image3}
                videourl={videourl}
                videoThumbnail={videoThumbnail}

                // ✅ Responsive image dimensions
                imgWidth={600}
                imgHeight={600}
                zoomPaneWidth={600}
                zoomPaneHeight={600}
                objectFitMode="contain"
                lensSize={150}
                extraZoom={2.0}
                status={status}
              />
            </div>

            {/* Right: details */}
            <div className="col-xl-5 col-lg-6 col-md-12">
              <div className="product-details-sticky-wrapper">
                <DetailsWrapper
                  productItem={p} // ✅ pass normalized product
                  handleImageActive={handleImageActive}
                  activeImg={activeImg || img}
                  detailsBottom
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tp-product-details-bottom pb-10">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <DetailsTabNav product={p} seoData={seoData} /> {/* ✅ pass normalized product */}
            </div>
          </div>
        </div>
      </div>

      {/* Suitable For & Keywords Section */}
      <DetailsSuitableKeywords product={p} />

      {/* Related */}
      <section className="tp-related-product pt-95 pb-50">
        <div className="container">
          <div className="row">
            <div className="tp-section-title-wrapper-6 text-center mb-40">
              <span className="tp-section-title-pre-6">Style It With</span>
              <h3 className="tp-section-title-6">Mix &amp; Match</h3>
            </div>
          </div>
          <div className="row">
            <RelatedProducts key={collectionId} id={_id} collectionId={collectionId} />
          </div>
        </div>
      </section>

      {/* Alt Text Debugger - only shows in development with ?debug=alt */}
      <AltTextDebugger 
        productItem={productItem} 
        show={typeof window !== 'undefined' && window.location.search.includes('debug=alt')} 
      />

      <style jsx>{`
        .tp-product-details-area {
          padding: 40px 0;
        }

        .product-details-sticky-wrapper {
          padding: 0;
        }

        @media (max-width: 1199px) {
          .tp-product-details-area {
            padding: 35px 0;
          }
        }

        @media (max-width: 991px) {
          .tp-product-details-area {
            padding: 25px 0;
          }
          
          .product-details-sticky-wrapper {
            margin-top: 35px;
            padding: 25px 20px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
        }

        @media (max-width: 768px) {
          .tp-product-details-area {
            padding: 20px 0;
          }
          
          .product-details-sticky-wrapper {
            margin-top: 30px;
            padding: 20px 15px;
            border-radius: 14px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          }
        }

        @media (max-width: 480px) {
          .tp-product-details-area {
            padding: 15px 0;
          }
          
          .product-details-sticky-wrapper {
            padding: 18px 12px;
            margin-top: 25px;
            border-radius: 12px;
          }
        }

        @media (max-width: 360px) {
          .tp-product-details-area {
            padding: 12px 0;
          }
          
          .product-details-sticky-wrapper {
            padding: 15px 10px;
            margin-top: 20px;
          }
        }
      `}</style>
    </section>
  );
}