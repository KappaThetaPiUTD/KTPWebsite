// next.config.js
export default {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        ignored: ["**/node_modules", "**/.git"],
      };
    }
    return config;
  },
};
