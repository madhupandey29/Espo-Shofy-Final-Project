import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import CategoryShowcase from "@/components/category/CategoryShowcase";

export const metadata = {
  title: "Shofy - Category Page",
};

export const dynamic = 'force-dynamic';

export default function CategoryPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <ShopBreadcrumb title="Only Categories" subtitle="Only Categories" />
      <CategoryShowcase />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
