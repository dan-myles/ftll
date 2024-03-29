/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  distDir: "dist",
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
