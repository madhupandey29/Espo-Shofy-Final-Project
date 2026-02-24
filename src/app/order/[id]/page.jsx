import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import OrderArea from "@/components/order/order-area";

export const metadata = {
  title: "Amrita Global Enterprises - Order Details",
};

// Force SSR for order details
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

export default function OrderPage({ params, searchParams }) {
  // ----- Server-side auth guard -----
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value || '';

  let userId = '';
  const userInfoRaw = cookieStore.get('userInfo')?.value;
  if (userInfoRaw) {
    try {
      const parsed = JSON.parse(userInfoRaw);
      userId = String(parsed?.user?._id || '');
    } catch {
      // ignore JSON parse errors
    }
  }

  // Route folder is [id], so params.id is the order id
  const orderId = params?.id;

  if (!sessionId && !userId) {
    redirect(`/login?returnTo=${encodeURIComponent(`/order/${orderId}`)}`);
  }
  // -----------------------------

  const userIdParam = searchParams?.userId ?? null; // optional, we also resolve from localStorage in OrderArea

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <OrderArea orderId={orderId} userId={userIdParam} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
