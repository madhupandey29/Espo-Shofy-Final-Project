import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import OrderConfirmationArea from "@/components/checkout/order-confirmation-area";

export const metadata = {
  title: "Order Confirmation - Thank You",
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function OrderConfirmationPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>
        Order Confirmation - Thank You for Your Order
      </h1>
      <OrderConfirmationArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
