/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "imgmenudallas.s3.sa-east-1.amazonaws.com",
      "s3.sa-east-1.amazonaws.com",
      "dallas-0001.ss-east-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.sa-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ss-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
