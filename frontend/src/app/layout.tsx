import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Million RealEstate',
  description: 'Listado de propiedades',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
