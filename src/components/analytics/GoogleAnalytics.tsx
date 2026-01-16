"use client";
import Script from "next/script";

export default function GoogleAnalytics({ gaId }) {
  if (!gaId) return null;

  return (
    <>
      {/* ✅ Optimized: lazyOnload = loads after page is fully interactive */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
