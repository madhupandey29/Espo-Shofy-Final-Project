import { Suspense } from 'react';
import WrapperISR from "@/layout/wrapper-isr";
import HeaderTwoISR from "@/layout/headers/header-2-isr";
import Footer from "@/layout/footers/footer-isr";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "Shofy - Shop Right Sidebar Page",
};

export default function ShopRightSidebarPage() {
  return (
    <WrapperISR>
      <HeaderTwoISR style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      <Suspense fallback={<div className="container py-5"><p>Loading products...</p></div>}>
        <ShopArea shop_right={true}/>
      </Suspense>
      <Footer primary_style={true} />
    </WrapperISR>
  );
}
