import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   cacheComponents: true,
  // },
};

export default withWorkflow(nextConfig);
