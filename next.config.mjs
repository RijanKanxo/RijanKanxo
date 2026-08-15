const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repoName.endsWith(".github.io");
const basePath =
  isGithubActions && repoName && !isUserOrOrgPagesRepo ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? "export" : "standalone",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
};

export default nextConfig;
