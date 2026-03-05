import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ForgotArea from "@/components/login-register/forgot-area";

export const metadata = {
  title: "Shofy - Forgot Page",
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default function ForgotPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <CommonBreadcrumb title="Forgot Password" subtitle="Reset Password" center={true} />
      <ForgotArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
