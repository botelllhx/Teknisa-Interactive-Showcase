/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.js ecosystem packages are ESM-only and need explicit transpilation
  // in Next.js 14 webpack to avoid "require() of ES module" errors.
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],
};

export default nextConfig;
