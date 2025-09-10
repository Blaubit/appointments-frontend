/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // aquí defines los orígenes que pueden acceder a los recursos _next/*
    allowedDevOrigins: [
      "*", // tu máquina/dispositivo en la red local
    ],
  },
};

export default nextConfig;
