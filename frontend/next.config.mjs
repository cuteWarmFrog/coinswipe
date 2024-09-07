const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/coins/images/**",
      },
      {
        protocol: "https",
        hostname: "dzyb4dm7r8k8w.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
