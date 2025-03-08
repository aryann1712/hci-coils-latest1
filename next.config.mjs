/** @type {import('next').NextConfig} */
const nextConfig = {
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
