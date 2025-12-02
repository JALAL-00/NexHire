import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    // The remotePatterns array tells Next.js which external domains are safe to load images from.
    remotePatterns: [
      // This pattern is for your own backend uploads (e.g., profile pictures)
      {
        protocol: 'http',
        hostname: 'localhost',
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