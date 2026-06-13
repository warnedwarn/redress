/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/redress',
  trailingSlash: true,
};

module.exports = nextConfig;
