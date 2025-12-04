/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'phantom.com',
      },
      {
        protocol: 'https',
        hostname: 'namiwallet.io',
      },
      {
        protocol: 'https',
        hostname: 'electrum.org',
      },
      {
        protocol: 'https',
        hostname: 'z.cash',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
      },
      {
        protocol: 'https',
        hostname: 'wormhole.com',
      },
      {
        protocol: 'https',
        hostname: 'layerzero.network',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
