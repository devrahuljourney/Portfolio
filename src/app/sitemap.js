const SITE_URL = "https://rahulverma.site";

export default function sitemap() {
  const now = new Date();
  // Single-page app — the primary sections live under hash anchors on `/`.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
