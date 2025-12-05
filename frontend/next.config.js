/**
 * Minimal next-pwa config. If you don't have `next-pwa` installed
 * the app will still run but service worker won't be generated until
 * you add the dependency and rebuild.
 */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
});
