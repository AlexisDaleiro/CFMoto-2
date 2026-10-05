import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { ViewTransition } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { formatUsd, getLineas, getModelo, getModelos, getSitio } from "@/lib/catalogo";
import { dealerJson } from "@/lib/seo";
import { whatsapp } from "@/lib/whatsapp";
import "./globals.css";
const archivo = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-archivo", axes: ["wdth"] });
export const metadata: Metadata = { metadataBase: new URL(getSitio().url), title: { default: "Motos CFMOTO Uruguay", template: "%s | CFMOTO Uruguay" }, description: "Motos, cuatriciclos y UTV CFMOTO en Uruguay. Consultá el catálogo, cotizá tu modelo y coordiná un test ride en nuestro showroom de Barra de Carrasco.", icons: { icon: "/icon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0C0D" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nav = getLineas().map((linea) => ({ slug: linea.slug, nombre: linea.nombre, numero: linea.numero, imagen: getModelo(linea.modeloPortada)?.imagenes.perfil || "", modelos: getModelos(linea.slug).map((modelo) => ({ slug: modelo.slug, nombre: modelo.nombre, cc: modelo.segmentoCc, precio: formatUsd(modelo.precioDesdeUsd), imagen: modelo.imagenes.perfil })) }));
  return <html lang="es-UY" className={archivo.variable}><body><a className="skip-link" href="#contenido">Saltar al contenido</a><Header lineas={nav} wa={whatsapp()} /><ViewTransition name="page" default="page-transition"><main id="contenido" tabIndex={-1}>{children}</main></ViewTransition><Footer /><JsonLd data={dealerJson()} /></body></html>;
}
