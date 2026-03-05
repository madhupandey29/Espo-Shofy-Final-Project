import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "Shofy - Shop Hidden Sidebar Page",
};

export const dynamic = 'force-dynamic';

export default function ShopHiddenSidebarPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      <ShopArea hidden_sidebar={true}/>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
