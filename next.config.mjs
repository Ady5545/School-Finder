/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Fix the 4 broken legacy card links from the original homepage
      {
        source: '/schools/xaviers.html',
        destination: '/schools/st-xaviers-high-school',
        permanent: true,
      },
      {
        source: '/schools/gdgoenka.html',
        destination: '/schools/gd-goenka-international-school',
        permanent: true,
      },
      {
        source: '/schools/bls.html',
        destination: '/schools/bls-world-school',
        permanent: true,
      },
      {
        source: '/schools/shriram.html',
        destination: '/schools/the-shri-ram-universal-school',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

