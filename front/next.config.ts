import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['localhost', 'host.docker.internal', 'admin.friendshostel.ge', 'friendshostel.ge'],
    },
};

module.exports = nextConfig;
