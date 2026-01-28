import SitemapPageClient from './SitemapPageClient';

export const metadata = {
  title: 'Sitemap - Espo Shofy',
  description: 'Complete sitemap of all pages on Espo Shofy website. Find all products, blog posts, and important pages.',
  keywords: 'sitemap, website map, navigation, pages, products, blog',
  robots: 'index, follow',
};

export default function SitemapPage() {
  return <SitemapPageClient />;
}