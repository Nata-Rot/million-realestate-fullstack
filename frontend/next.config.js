/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google
      { protocol: "https", hostname: "www.google.com" }              // Opcional
    ]
  }
};

module.exports = nextConfig;
