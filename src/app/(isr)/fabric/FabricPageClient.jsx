'use client';

import { Suspense } from 'react';
import WrapperISR from "@/layout/wrapper-isr";
import HeaderTwoISR from "@/layout/headers/header-2-isr";
import Footer from "@/layout/footers/footer-isr";
import ShopArea from "@/components/shop/shop-area";
import CompactUniversalBreadcrumb from "@/components/breadcrumb/compact-universal-breadcrumb";
import FloatingButtonsISR from "@/components/common/FloatingButtonsISR";

export default function FabricPageClient({ productData, office, breadcrumbItems }) {
  return (
    <WrapperISR>
      <HeaderTwoISR style_2 />

      {/* ✅ SEO-Optimized H1 for Fabric Page */}
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
        Premium Fabric Collection - Cotton, Mercerized & Designer Textiles
        {productData.filtered && ` - ${productData.filterTag} Collection`}
      </h1>

      <CompactUniversalBreadcrumb items={breadcrumbItems} />

      <div className="shop-page-spacing">
        <Suspense fallback={<div className="container py-5"><p>Loading products...</p></div>}>
          <ShopArea 
            initialProducts={productData.products} 
            totalProducts={productData.total}
          />
        </Suspense>
      </div>

      {/* ✅ ISR Floating Buttons with pre-fetched office data */}
      <FloatingButtonsISR office={office} />

      <Footer primary_style />
    </WrapperISR>
  );
}
