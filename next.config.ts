import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/e-memo-registry',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/e-memo-registry',
        permanent: false,
        basePath: false,
      },
      {
        source: '/login',
        destination: '/e-memo-registry/login',
        permanent: false,
        basePath: false,
      },
      {
        source: '/register',
        destination: '/e-memo-registry/register',
        permanent: false,
        basePath: false,
      },
      {
        source: '/auth/callback',
        destination: '/e-memo-registry/auth/callback',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
