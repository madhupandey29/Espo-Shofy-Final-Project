import SitemapPageClient from './SitemapPageClient';

export const metadata = {
  title: 'Sitemap Page',
  description: 'Complete sitemap of all pages on this Fabric website. Find all products, blog posts, and important pages.',
  keywords: 'sitemap, website map, navigation, pages, products, blog',
  robots: 'index, follow',

  // ✅ Canonical for the UI sitemap page
  alternates: {
    canonical: '/sitemap',
  },
};

export default function SitemapPage() {
  return <SitemapPageClient />;
}
