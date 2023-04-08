/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@natcore/signals-react', '@natcore/signals-core'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
