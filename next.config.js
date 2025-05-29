/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['hcicoils.in'],
  },
  trailingSlash: true,
}

module.exports = nextConfig 