import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The remotePatterns array tells Next.js which external domains are safe to load images from.
    remotePatterns: [
      // This pattern is for your own backend uploads (e.g., profile pictures)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/uploads/**', 
      },
      // This pattern is for the Unsplash guide images.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Make sure this is plural: "images"
        port: '',
        pathname: '/**', // Allows any image path from this domain
      },
      // This pattern is for the Pravatar author avatars.
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;