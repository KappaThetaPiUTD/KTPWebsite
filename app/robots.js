const SITE_URL = "https://ktp-website.vercel.app";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/portal/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
