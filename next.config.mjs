/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
