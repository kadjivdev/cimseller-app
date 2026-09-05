// // next.config.ts
// const nextConfig = {
//   experimental: {
//     webpackBuildWorker: false,//true
//   },
  // turbopack: {
  //   root: __dirname, // 👈 force le bon répertoire
  // },
// }

// export default nextConfig

const nextConfig = {
  // experimental: {
  //   webpackBuildWorker: false,
  // },
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
    workerThreads: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;