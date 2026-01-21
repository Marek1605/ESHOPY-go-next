/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'eshopbuilder.sk', 'api.eshopbuilder.sk'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL ? `${process.env.API_URL}/api/:path*` : 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
