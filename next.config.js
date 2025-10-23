/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
  swcMinify: true,
  experimental: {
    typedRoutes: false,
  },
}

module.exports = nextConfig
