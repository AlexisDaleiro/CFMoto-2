import type { Metadata } from "next";
import type { Modelo } from "@/content/types";
import { getSitio } from "./catalogo";
export function metadata(titulo: string, description: string, path: string, image?: string): Metadata {
  const url = new URL(path, getSitio().url).toString();
  const images = image ? [{ url: new URL(image, getSitio().url).toString(), alt: titulo }] : [];
  return { title: titulo, description, alternates: { canonical: url }, openGraph: { type: "website", locale: "es_UY", siteName: getSitio().nombre, title: titulo, description, url, images }, twitter: { card: "summary_large_image", title: titulo, description, images: images.map((item) => item.url) } };
}
export function breadcrumbJson(items: { nombre: string; href: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.nombre, item: new URL(item.href, getSitio().url).toString() })) };
}
export function productJson(modelo: Modelo) {
  return { "@context": "https://schema.org", "@type": "Product", name: `CFMOTO ${modelo.nombre}`, brand: { "@type": "Brand", name: "CFMOTO" }, description: `${modelo.bajada} Precio de referencia de demo; confirmar cotización.`, sku: modelo.slug, image: [modelo.imagenes.hero, modelo.imagenes.perfil].filter(Boolean).map((src) => new URL(src, getSitio().url).toString()), ...(modelo.precioDesdeUsd ? { offers: { "@type": "Offer", priceCurrency: "USD", price: modelo.precioDesdeUsd, url: new URL(`/${modelo.linea}/${modelo.slug}`, getSitio().url).toString(), seller: { "@type": "Organization", name: getSitio().nombre } } } : {}) };
}
export function dealerJson() {
  const s = getSitio();
  return { "@context": "https://schema.org", "@type": "MotorcycleDealer", "@id": `${s.url}/#showroom`, name: s.nombre, url: s.url, telephone: "+59898379380", email: s.email, address: { "@type": "PostalAddress", streetAddress: "Ruta 101 y Calcagno", addressLocality: "Barra de Carrasco", addressRegion: "Canelones", addressCountry: "UY" }, sameAs: s.redes.map((r) => r.url), openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "13:00" }, { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "14:00", closes: "18:30" }, { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" }] };
}
