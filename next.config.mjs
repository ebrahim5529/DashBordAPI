/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 14, no need for experimental flag
  typescript: {
    // Ignore TypeScript errors during build for faster deployment
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to successfully complete even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
  // إضافة دعم للملفات الثابتة
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
