/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@natcore/signals-react', '@natcore/signals-core'],
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
