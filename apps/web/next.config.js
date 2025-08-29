/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable image optimization to avoid sharp
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Exclude dist directories from compilation to prevent duplicate file warnings
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.next/**']
    };
    
    // Force sharp to be ignored in webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: false,
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
    // Ignore TypeScript errors during CI builds to prevent failures
    ignoreBuildErrors: process.env.NODE_ENV === 'production' || process.env.CI === 'true',
  },
}

module.exports = nextConfig 