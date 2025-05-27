/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
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
            hostname: 'hci-public-1.s3.ap-south-1.amazonaws.com',
            port: '',              // usually empty
            pathname: '/**' // or '/photos/*' or '/**' if you prefer
          },
        ],
        unoptimized: process.env.NODE_ENV === 'production',
      },    
};

export default nextConfig;
