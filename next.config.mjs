/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    // Configure domains for external images if needed
    domains: ["localhost"],
    // Use unoptimized for Docker if you don't need Next.js image optimization
    unoptimized: process.env.NODE_ENV === "production",
  },
  experimental: {
    // aquí defines los orígenes que pueden acceder a los recursos _next/*
    allowedDevOrigins: [
      "*", // tu máquina/dispositivo en la red local
    ],
    serverComponentsExternalPackages: [],
  },
  // Webpack configuration for optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      // Optimize bundle size in production
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    return config;
  },

  // Disable telemetry in containers
  telemetry: false,

  // Configure headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
