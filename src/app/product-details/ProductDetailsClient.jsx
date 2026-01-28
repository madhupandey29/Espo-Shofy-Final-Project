'use client';

import React from 'react';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import ProductDetailsLoader from '@/components/loader/prd-details-loader';
import ErrorMsg from '@/components/common/error-msg';
import { useGetSingleNewProductByIdQuery } from '@/redux/features/newProductApi';

function mapBackendProductToFrontend(p) {
  // 🔍 Debug: Log the raw product data from API
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 mapBackendProductToFrontend - Raw API Product:', {
      id: p?.id,
      name: p?.name,
      altTextImage1: p?.altTextImage1,
      altTextImage2: p?.altTextImage2,
      altTextImage3: p?.altTextImage3,
      altTextVideo: p?.altTextVideo,
      image1CloudUrl: p?.image1CloudUrl,
      image2CloudUrl: p?.image2CloudUrl,
      image3CloudUrl: p?.image3CloudUrl,
      hasAltTextFields: !!(p?.altTextImage1 || p?.altTextImage2 || p?.altTextImage3),
      allKeys: Object.keys(p || {})
    });
  }

  // Handle Cloudinary image URLs - use correct API field names and remove trailing hash
  let mainImg = (p.image1CloudUrl && typeof p.image1CloudUrl === 'string' ? p.image1CloudUrl.replace(/#$/, '') : p.image1CloudUrl) || p.img || p.image || '';
  let img1 = (p.image1CloudUrl && typeof p.image1CloudUrl === 'string' ? p.image1CloudUrl.replace(/#$/, '') : p.image1CloudUrl) || p.image1 || '';
  let img2 = (p.image2CloudUrl && typeof p.image2CloudUrl === 'string' ? p.image2CloudUrl.replace(/#$/, '') : p.image2CloudUrl) || p.image2 || '';
  let img3 = (p.image3CloudUrl && typeof p.image3CloudUrl === 'string' ? p.image3CloudUrl.replace(/#$/, '') : p.image3CloudUrl) || p.image3 || '';
  const videoUrl = p.videoURL || p.videourl || p.video || '';
  const poster = p.videoThumbnail || '';

  // 🧪 DEVELOPMENT ONLY: Add placeholder images when alt text exists but images are null
  if (process.env.NODE_ENV === 'development') {
    const productName = encodeURIComponent(p.name || 'Product');
    const placeholderBase = 'https://via.placeholder.com/400x300';
    
    // Add placeholders only if alt text exists but image URL is null/empty
    if (p.altTextImage1 && !img1) {
      img1 = `${placeholderBase}/4CAF50/white?text=${productName}+Image+1`;
      console.log('🧪 DEV: Added placeholder for image1 with alt text');
    }
    if (p.altTextImage2 && !img2) {
      img2 = `${placeholderBase}/2196F3/white?text=${productName}+Image+2`;
      console.log('🧪 DEV: Added placeholder for image2 with alt text');
    }
    if (p.altTextImage3 && !img3) {
      img3 = `${placeholderBase}/FF9800/white?text=${productName}+Image+3`;
      console.log('🧪 DEV: Added placeholder for image3 with alt text');
    }
    
    // Set mainImg to first available image
    if (!mainImg) {
      mainImg = img1 || img2 || img3;
    }
  }

  const images = [
    mainImg && { type: 'image', img: mainImg },
    img1 && { type: 'image', img: img1 },
    img2 && { type: 'image', img: img2 },
    img3 && { type: 'image', img: img3 },
  ].filter(Boolean);

  if (videoUrl || poster) {
    images.push({ type: 'video', img: poster || mainImg || img1 || img2 || img3, video: videoUrl });
  }

  const mappedProduct = {
    _id: p.id || p._id,
    slug: p.productslug || p.slug,
    title: p.productTitle || p.shortProductDescription || p.name || p.title, // Use productTitle first, then shortProductDescription, then fallback
    name: p.name, // Preserve original name field
    productTitle: p.productTitle, // Preserve original productTitle field
    productTagline: p.productTagline, // Preserve original productTagline field
    shortProductDescription: p.shortProductDescription, // Preserve short description
    fullProductDescription: p.fullProductDescription, // Preserve full description
    img: mainImg,
    image1: img1,
    image2: img2,
    image3: img3,
    video: videoUrl,
    videourl: videoUrl,
    videoThumbnail: poster,
    color: p.color || p.colors || [],
    colors: p.colors || p.color || [],
    motif: p.motif || p.motifsize || null,
    motifId: (p.motif && p.motif._id) || p.motif || p.motifsize || null,
    imageURLs: images,
    videoId: videoUrl,
    
    // ✅ CRITICAL: Alt text fields from API - Enhanced preservation
    altTextImage1: p.altTextImage1 || null,
    altTextImage2: p.altTextImage2 || null,
    altTextImage3: p.altTextImage3 || null,
    altTextVideo: p.altTextVideo || null,
    
    price: p.salesPrice || p.price,
    description: p.fullProductDescription || p.description || p.productdescription || '',
    shortDescription: p.shortProductDescription || '',
    fullProductDescription: p.fullProductDescription || p.description || p.productdescription || '',
    shortProductDescription: p.shortProductDescription || '',
    productTagline: p.productTagline, // Preserve original productTagline field
    status: p.status || 'in-stock',
    sku: p.sku || p.fabricCode,
    category: p.category || '',
    categoryId: p.category?._id || p.category || '',
    structure: p.structure || '',
    structureId: p.structure?._id || p.structure || '',
    content: p.content || [],
    contentId: p.content?._id || p.content || '',
    finish: p.finish || [],
    finishId: p.finish?._id || p.finish || '',
    design: p.design || '',
    designId: p.design?._id || p.design || '',
    motifsizeId: p.motif?._id || p.motif || '',
    suitableforId: p.subsuitable?._id || p.subsuitable || '',
    vendorId: p.vendor?._id || p.vendor || '',
    collectionId: p.collectionId || p.collection?.id || '',
    collection: p.collection || null,
    gsm: p.gsm,
    oz: p.ozs || p.oz,
    cm: p.cm,
    inch: p.inch,
    productIdentifier: p.productIdentifier || p.fabricCode,
    fabricCode: p.fabricCode, // Preserve original fabricCode field
    vendorFabricCode: p.vendorFabricCode, // Preserve vendor fabric code
    width: p.cm
      ? `${p.cm} cm`
      : p.inch
        ? `${p.inch} inch`
        : 'N/A',
    tags: p.tags || p.merchTags || [],
    offerDate: p.offerDate || { endDate: null },
    additionalInformation: p.additionalInformation || [],
    highlights: p.highlights || [],
    productQ1: p.productQ1,
    productA1: p.productA1,
    productQ2: p.productQ2,
    productA2: p.productA2,
    productQ3: p.productQ3,
    productA3: p.productA3,
    productQ4: p.productQ4,
    productA4: p.productA4,
    productQ5: p.productQ5,
    productA5: p.productA5,
    productQ6: p.productQ6,
    productA6: p.productA6,
    ratingCount: p.ratingCount,
    ratingValue: p.ratingValue,
    keywords: p.keywords || [],
    supplyModel: p.supplyModel,
    salesMOQ: p.salesMOQ,
    uM: p.uM,
    suitability: p.suitability || [],
    aiTempOutput: p.aiTempOutput || '',
    subsuitable: p.subsuitable || [],
  };

  // 🔍 Debug: Log the mapped product to verify alt text preservation
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 mapBackendProductToFrontend - Mapped Product Alt Text:', {
      productName: mappedProduct.name,
      altTextImage1: mappedProduct.altTextImage1,
      altTextImage2: mappedProduct.altTextImage2,
      altTextImage3: mappedProduct.altTextImage3,
      altTextVideo: mappedProduct.altTextVideo,
      hasAnyAltText: !!(mappedProduct.altTextImage1 || mappedProduct.altTextImage2 || mappedProduct.altTextImage3),
      image1: mappedProduct.image1,
      image2: mappedProduct.image2,
      image3: mappedProduct.image3
    });
  }

  return mappedProduct;
}

export default function ProductDetailsClient({ productId }) {
  const {
    data,
    isLoading,
    isError,
  } = useGetSingleNewProductByIdQuery(productId);

  if (isLoading) return <ProductDetailsLoader loading />;
  if (isError) return <ErrorMsg msg="There was an error loading the product" />;
  if (!data?.data) return <ErrorMsg msg="No product found!" />;

  const product = mapBackendProductToFrontend(data.data);
  return <ProductDetailsArea product={product} />;
}