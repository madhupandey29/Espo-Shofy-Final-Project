'use client';
import React, { useEffect } from 'react';

import ErrorMsg                     from '../common/error-msg';
import ProductDetailsBreadcrumb     from '../breadcrumb/product-details-breadcrumb';
import ProductDetailsContent        from './product-details-content';
import { trackProductView }         from '@/utils/analytics';

/* -------------------------------------------------------------------- */
/*  ProductDetailsArea                                                  */
/* -------------------------------------------------------------------- */
const ProductDetailsArea = ({ product }) => {
  /* handle missing product after hooks have run */
  if (!product) return <ErrorMsg msg="No product found!" />;

  const breadcrumbTitle = product.productTitle || product.title || product.name || 'Product';

  // Track product view
  useEffect(() => {
    if (product) {
      trackProductView(product);
    }
  }, [product]);

  return (
    <>
      <ProductDetailsBreadcrumb
        title={breadcrumbTitle}
      />
      <ProductDetailsContent productItem={product} />
    </>
  );
};

export default ProductDetailsArea;
