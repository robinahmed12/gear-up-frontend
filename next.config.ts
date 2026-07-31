import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      // Gear images / provider-supplied URLs — narrow this once your
      // actual image hosting is known.
      { hostname: '**' },
    ],
  },
};

export default nextConfig;
