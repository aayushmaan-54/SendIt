import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '0tkok2jwuf.ufs.sh', port: "" },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', port: "" },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: "" },
    ],
  },
};


export default nextConfig;
