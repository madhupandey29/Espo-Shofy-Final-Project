import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import SearchArea from "@/components/search/search-area";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Shofy - Search Page",
};

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <CommonBreadcrumb title="Search Products" subtitle="Search Products" />
      <SearchArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
