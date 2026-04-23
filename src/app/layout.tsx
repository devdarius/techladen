import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import AuthProvider from '@/components/auth/AuthProvider';
import CookieConsent from '@/components/CookieConsent';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';

export const metadata: Metadata = {
  title: 'TechLaden.de – Premium Handy-Zubehör',
  description:
    'Hochwertige Hüllen, Ladegeräte, Kabel, Schutzglas und Powerbanks. Schnelle Lieferung 3–7 Werktage. Kostenloser Versand ab 29€.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techladen.de'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col bg-white text-text-main">
        <AnnouncementBar />
        <Header />
        <main className="flex-1"><AuthProvider>{children}</AuthProvider></main>
        <Footer />
        <CartDrawer />
        <CookieConsent />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
