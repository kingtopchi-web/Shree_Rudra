/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/backend-images/:path*',
        destination: 'http://localhost:5000/images/:path*',
      }
    ];
  },
};

module.exports = nextConfig;

