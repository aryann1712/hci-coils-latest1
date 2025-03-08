/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'stimg.cardekho.com',
            port: '',              // usually empty
            pathname: '/images/**' // or '/photos/*' or '/**' if you prefer
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
            port: '',              // usually empty
            pathname: '/**' // or '/photos/*' or '/**' if you prefer
          },
          {
            protocol: 'https',
            hostname: 'hci-private.s3.us-east-1.amazonaws.com',
            port: '',              // usually empty
            pathname: '/**' // or '/photos/*' or '/**' if you prefer
          },
        ],
      },    
};

export default nextConfig;
