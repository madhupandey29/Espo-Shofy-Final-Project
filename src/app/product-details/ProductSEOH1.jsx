'use client';

import { useGetSingleNewProductByIdQuery } from '@/redux/features/newProductApi';

export default function ProductSEOH1({ productId }) {
  const { data } = useGetSingleNewProductByIdQuery(productId);
  
  const productTitle = data?.data?.name || 
                      data?.data?.productTitle || 
                      data?.data?.title || 
                      "Product Details";
  
  return (
    <h1 
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {productTitle} - Premium Fabric Details
    </h1>
  );
}