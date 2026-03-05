import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import LoginArea from "@/components/login-register/login-area";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://amrita-fashions.com").replace(/\/$/, "");

export const metadata = {
  title: "Shofy - Login Page",
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2={true} />
      </Suspense>
      <CommonBreadcrumb title="Login" subtitle="Login" center={true} />
      <LoginArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
