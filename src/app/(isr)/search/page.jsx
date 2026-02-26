import { Suspense } from 'react';
import WrapperISR from "@/layout/wrapper-isr";
import HeaderTwoISR from "@/layout/headers/header-2-isr";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import SearchArea from "@/components/search/search-area";
import Footer from "@/layout/footers/footer-isr";

export const metadata = {
  title: "Shofy - Search Page",
};

export default function SearchPage() {
  return (
    <WrapperISR>
      <HeaderTwoISR style_2={true} />
      <CommonBreadcrumb title="Search Products" subtitle="Search Products" />
      <Suspense fallback={<div className="container py-5"><p>Loading search results...</p></div>}>
        <SearchArea />
      </Suspense>
      <Footer primary_style={true} />
    </WrapperISR>
  );
}
