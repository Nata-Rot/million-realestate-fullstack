import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Million RealEstate',
  description: 'Listado de propiedades',
  icons: {
    icon: [
      { url: '/icon.png?v=2', type: 'image/png' },
      { url: '/icon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2' },
      { url: '/apple-icon-180x180.png?v=2', sizes: '180x180' },
    ],
    shortcut: '/icon.png?v=2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen" suppressHydrationWarning={true}>
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}