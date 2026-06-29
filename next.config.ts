// next.config.ts
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  turbopack: {
    root: __dirname, // 👈 force le bon répertoire
  },
}

export default nextConfig