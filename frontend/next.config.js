/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "www.google.com" },
      // Agrega soporte para tu API local
      { protocol: "http", hostname: "localhost", port: "5242" },
    ],
    // Configuración adicional para optimización
    formats: ['image/webp', 'image/avif'],
    // Permite imágenes no optimizadas para desarrollo si es necesario
    // unoptimized: process.env.NODE_ENV === 'development'
  }
};

module.exports = nextConfig;