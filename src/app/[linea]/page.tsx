import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLinea, getLineas, getModelo, getModelos } from "@/lib/catalogo";
import { metadata } from "@/lib/seo";
import { whatsapp } from "@/lib/whatsapp";
import { ModelImage } from "@/components/model-image";
import { ModelCard } from "@/components/model-card";
import { Breadcrumb } from "@/components/breadcrumb";
import { DisplacementFilter } from "@/components/displacement-filter";
import { TestRide } from "@/components/test-ride";
import { WhatsAppIcon, Arrow } from "@/components/icon";
export const dynamicParams = false;
export function generateStaticParams() { return getLineas().map((linea) => ({ linea: linea.slug })); }
type Props = { params: Promise<{ linea: string }> };
export async function generateMetadata({ params }: Props) {
  const { linea: slug } = await params; const linea = getLinea(slug);
  if (!linea) return {};
  return metadata(`${linea.nombre === "Motos" ? "Motos CFMOTO" : linea.nombre} Uruguay`, linea.descripcion, `/${linea.slug}`, getModelo(linea.modeloPortada)?.imagenes.hero);
}
export default async function LineaPage({ params }: Props) {
  const { linea: slug } = await params; const linea = getLinea(slug);
  if (!linea) notFound();
  const portada = getModelo(linea.modeloPortada);
  const modelos = getModelos(linea.slug);
  const cards = modelos.map((modelo) => ({ slug: modelo.slug, cc: modelo.segmentoCc, card: <ModelCard modelo={modelo} /> }));
  return <><section className="line-hero photo-hero" aria-labelledby="line-heading"><ModelImage src={portada?.imagenes.hero} nombre={portada?.nombre || linea.nombre} priority sizes="100vw" /><div className="photo-scrim" /><div className="shell line-hero-copy"><p className="micro">{linea.numero} / CFMOTO URUGUAY</p><h1 id="line-heading" className="display">{linea.nombre}</h1><div><p>{linea.bajada}</p><a href={whatsapp({ linea: linea.nombre })} className="text-link" target="_blank" rel="noopener"><WhatsAppIcon /> Consultá por {linea.nombre.toLowerCase()} <Arrow /></a></div></div></section><div className="shell"><Breadcrumb items={[{ nombre: "Inicio", href: "/" }, { nombre: linea.nombre, href: `/${linea.slug}` }]} /><section className="catalog-section" aria-labelledby="catalog-heading"><div className="section-heading"><div><p className="micro">CATÁLOGO / {linea.nombre}</p><h2 id="catalog-heading" className="display section-title">Elegí tu modelo.</h2></div><p className="fine">Precios de referencia de demo.<br />Cada modelo se cotiza con disponibilidad local.</p></div><Suspense fallback={<div className="catalog-grid">{cards.map((item) => <div className="catalog-cell" key={item.slug}>{item.card}</div>)}</div>}><DisplacementFilter segmentos={[...new Set(modelos.map((modelo) => modelo.segmentoCc))].sort((a, b) => a - b)} modelos={cards} /></Suspense></section></div><TestRide /></>;
}
