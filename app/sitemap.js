const SITE_URL = "https://ktp-website.vercel.app";

export default function sitemap() {
  const routes = [
    "",
    "/about-us",
    "/brothers",
    "/alumni",
    "/recruitment",
    "/blog",
    "/gallery",
    "/contact-us",
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
