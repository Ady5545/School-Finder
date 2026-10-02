/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-src 'self' https:; worker-src 'self' blob:; media-src 'self' blob:" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/schools/xaviers.html', destination: '/schools/st-xaviers-high-school', permanent: true },
      { source: '/schools/gdgoenka.html', destination: '/schools/gd-goenka-international-school', permanent: true },
      { source: '/schools/bls.html', destination: '/schools/bls-world-school', permanent: true },
      { source: '/schools/shriram.html', destination: '/schools/the-shri-ram-universal-school', permanent: true },
    ];
  },
};

export default nextConfig;
