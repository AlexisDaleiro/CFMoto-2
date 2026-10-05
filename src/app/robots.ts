import type { MetadataRoute } from "next";
import { getSitio } from "@/lib/catalogo";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${getSitio().url}/sitemap.xml`, host: getSitio().url }; }
