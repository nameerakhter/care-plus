import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true, // Enables source maps for debugging
}

export default withSentryConfig(nextConfig, {
  org: 'nameer-2s',
  project: 'javascript-nextjs',
  silent: false, // Show logs
  widenClientFileUpload: true,
  hideSourceMaps: false, // Show source maps in prod (for debugging)
  disableLogger: false, // Enable Sentry logging
  automaticVercelMonitors: true,
})
