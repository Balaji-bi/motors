import type { Metadata } from 'next';
import './globals.css';
import { LockedFeatureProvider } from '@/components/modals/LockedFeature';

const SITE_URL = 'https://tamilmotors.demo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tamil Motors | Two Wheeler Dealer in Coimbatore',
    template: '%s | Tamil Motors',
  },
  description:
    'Tamil Motors is a two-wheeler showroom in Coimbatore. Explore demo bike models, book a test ride, and check finance and insurance assistance. Demonstration platform by PubliqWebb Tech.',
  applicationName: 'Tamil Motors',
  keywords: ['Tamil Motors', 'two wheeler dealer Coimbatore', 'bike showroom Coimbatore', 'test ride', 'bike finance'],
  authors: [{ name: 'PubliqWebb Tech' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Tamil Motors',
    title: 'Tamil Motors | Two Wheeler Dealer in Coimbatore',
    description:
      'Explore our latest two-wheelers, compare models, book a test ride and connect with our sales team.',
    url: SITE_URL,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamil Motors | Two Wheeler Dealer in Coimbatore',
    description: 'Explore our latest two-wheelers, book a test ride and connect with our sales team.',
  },
  robots: { index: true, follow: true },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Tamil Motors',
  description: 'Two-wheeler sales and customer services showroom in Coimbatore, Tamil Nadu.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gandhipuram',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  areaServed: ['Coimbatore', 'Tiruppur', 'Erode'],
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <LockedFeatureProvider>{children}</LockedFeatureProvider>
      </body>
    </html>
  );
}
