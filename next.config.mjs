import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Disable TypeScript errors from blocking builds during testing
  typescript: {
    // ⚠️ Dangerously allow production builds even with TypeScript errors
    // This matches your relaxed TS config
    ignoreBuildErrors: true,
  },

  // Disable ESLint errors from blocking builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization - allow all domains for testing
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hfiznpxdopjdwtuenxqf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Webpack configuration for path aliases
  webpack: (config) => {
    // Support both src and root-level directories (like lib, app, components)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/components': path.resolve(__dirname, './components'),
      '@': path.resolve(__dirname, './src'),
    }
    return config
  },
}

export default nextConfig
