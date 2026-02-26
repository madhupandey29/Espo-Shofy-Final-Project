import WrapperISR from "@/layout/wrapper-isr";
import HeaderTwoISR from "@/layout/headers/header-2-isr";
import Footer from "@/layout/footers/footer-isr";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopCategoryArea from "@/components/categories/shop-category-area";

export const metadata = {
  title: "Shofy - Category Page",
};

export default async function CategoryPage() {
  // Fetch categories
  let categories = null;
  let isError = false;
  try {
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productCategory/show`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    if (categoriesRes.ok) {
      categories = await categoriesRes.json();
    } else {
      isError = true;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    isError = true;
  }

  return (
    <WrapperISR>
      <HeaderTwoISR style_2={true} />
      <ShopBreadcrumb title="Only Categories" subtitle="Only Categories" />
      <ShopCategoryArea categories={categories} isLoading={false} isError={isError} />
      <Footer primary_style={true} />
    </WrapperISR>
  );
}
