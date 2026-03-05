import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import RegisterArea from "@/components/login-register/register-area";

export const metadata = {
  title: "Shofy - Register Page",
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <CommonBreadcrumb title="Register" subtitle="Register" center={true} />
      <RegisterArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
