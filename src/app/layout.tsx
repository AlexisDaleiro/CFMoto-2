import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getImageProps } from "next/image";
import { ViewTransition } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getLineas, getModelo, getSitio } from "@/lib/catalogo";
import { NavCatalog } from "@/components/nav-catalog";
import { dealerJson } from "@/lib/seo";
import { isPreview } from "@/lib/environment";
import "./globals.css";
const archivo = localFont({ src: "../assets/fonts/archivo-latin.woff2", weight: "400 800", display: "optional", preload: false, variable: "--font-archivo", fallback: ["Arial"], declarations: [{ prop: "font-stretch", value: "75% 100%" }] });
const archivoDisplay = localFont({ src: "../assets/fonts/archivo-display.woff2", weight: "800", display: "optional", variable: "--font-archivo-display", fallback: ["Arial Narrow", "Arial"] });
export const metadata: Metadata = { robots: isPreview ? { index: false, follow: false } : { index: true, follow: true }, metadataBase: new URL(getSitio().url), title: { default: "Motos CFMOTO Uruguay", template: "%s | CFMOTO Uruguay" }, description: "Motos, cuatriciclos y UTV CFMOTO en Uruguay. Consultá el catálogo, cotizá tu modelo y coordiná un test ride en nuestro showroom de Barra de Carrasco.", icons: { icon: "/icon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0C0D" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nav = getLineas().map((linea) => {
    const src = getModelo(linea.modeloPortada)?.imagenes.perfil;
    const image = src ? getImageProps({ src, alt: "", width: 84, height: 64, sizes: "84px" }).props : undefined;
    return { slug: linea.slug, nombre: linea.nombre, numero: linea.numero, imagen: image?.src || "", imagenSrcSet: image?.srcSet };
  });
  return <html lang="es-UY" className={`${archivo.variable} ${archivoDisplay.variable}`}><body><a className="skip-link" href="#contenido">Saltar al contenido</a><Header lineas={nav} panels={getLineas().map(linea => <NavCatalog key={linea.slug} linea={linea} />)} /><ViewTransition name="page" default="page-transition"><main id="contenido" tabIndex={-1}>{children}</main></ViewTransition><Footer /><JsonLd data={dealerJson()} /></body></html>;
}
