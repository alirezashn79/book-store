import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    domains: [
      // لیست دامنه‌های مجاز
      'book-store.storage.c2.liara.space',
    ],
  },
}

export default nextConfig
