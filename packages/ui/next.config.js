/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    const extensions = config.resolve.extensions || []
    const preferredExtensions = ['.ts', '.tsx', '.js', '.jsx']
    const remainingExtensions = extensions.filter((ext) => !preferredExtensions.includes(ext))

    config.resolve.extensions = [...preferredExtensions, ...remainingExtensions]

    return config
  },
  output: 'export',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3001/api/:path*`,
      },
    ]
  },
}
