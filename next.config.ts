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
  experimental: {
    webpackBuildWorker: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname, // 👈 force le bon répertoire
  },
};

export default nextConfig;