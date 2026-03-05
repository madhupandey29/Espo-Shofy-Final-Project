import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import CategoryShowcase from "@/components/category/CategoryShowcase";

export const metadata = {
  title: "Shofy - Category Page",
};

export default function CategoryPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Only Categories" subtitle="Only Categories" />
      <CategoryShowcase />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
