/** @type {import('next').NextConfig} */

const repoName = 'AIAssessmentTool';
const nextConfig = {
  output: 'export',
  assetPrefix: `/${repoName}/`,
  basePath: `/${repoName}`,
};

module.exports = nextConfig;
