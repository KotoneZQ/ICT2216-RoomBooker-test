/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SESSION_PASSWORD: process.env.NEXT_PUBLIC_SESSION_PASSWORD,
  },
  async headers() {
    return [
      {
        source: "/api/get-booking",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
