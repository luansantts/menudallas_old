/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Force Next to bundle ESM dependencies so packages that import
    // extensionless files (e.g. next/image) keep working on newer Node versions
    // and avoid the resolution error triggered by @chakra-ui/next-js + moment.
    esmExternals: false,
  },
  images: {
    domains: [
      "imgmenudallas.s3.sa-east-1.amazonaws.com",
      "s3.sa-east-1.amazonaws.com",
      "dallas-0001.s3.sa-east-1.amazonaws.com",
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
