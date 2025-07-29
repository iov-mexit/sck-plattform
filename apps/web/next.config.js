/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude dist directories from compilation to prevent duplicate file warnings
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.next/**']
    };
    return config;
  },
  // Exclude packages from transpilation
  transpilePackages: [],
  // Ignore dist directories
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Vercel-compatible configuration
  serverExternalPackages: ['@prisma/client']
}

module.exports = nextConfig 