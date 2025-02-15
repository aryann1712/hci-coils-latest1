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
        ],
      },    
};

export default nextConfig;
