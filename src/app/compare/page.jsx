import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CompareArea from "@/components/compare/compare-area";

export const metadata = {
  title: "Shofy - Compare Page",
};

export const dynamic = 'force-dynamic';

export default function ComparePage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <CommonBreadcrumb title="Compare" subtitle="Compare" />
      <CompareArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
