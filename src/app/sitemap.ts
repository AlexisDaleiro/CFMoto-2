import type { MetadataRoute } from "next";
import { getLineas, getModelos, getSitio } from "@/lib/catalogo";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/cotizar", ...getLineas().map((l) => `/${l.slug}`), ...getModelos().map((m) => `/${m.linea}/${m.slug}`)].map((path) => ({ url: `${getSitio().url}${path || "/"}`, changeFrequency: "monthly", priority: path === "" ? 1 : path.includes("/800mt-touring") ? 0.9 : 0.7 }));
}
