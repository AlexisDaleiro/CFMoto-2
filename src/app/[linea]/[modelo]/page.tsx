import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getLinea, getModelo, getModelos, getRelacionados, formatUsd } from "@/lib/catalogo";
import { metadata, productJson } from "@/lib/seo";
import { whatsapp } from "@/lib/whatsapp";
import { Breadcrumb } from "@/components/breadcrumb";
import { ModelImage } from "@/components/model-image";
import { ColorSelector } from "@/components/color-selector";
import { CarouselControls } from "@/components/carousel-controls";
import { ModelCard } from "@/components/model-card";
import { TestRide } from "@/components/test-ride";
import { JsonLd } from "@/components/json-ld";
import { Arrow, WhatsAppIcon } from "@/components/icon";
export const dynamicParams = false;
export function generateStaticParams() { return getModelos().map((modelo) => ({ linea: modelo.linea, modelo: modelo.slug })); }
type Props = { params: Promise<{ linea: string; modelo: string }> };
export async function generateMetadata({ params }: Props) {
  const { linea, modelo: slug } = await params;
  const modelo = getModelo(slug, linea);
  if (!modelo) return {};
  let description = `CFMOTO ${modelo.nombre} Uruguay: ficha técnica, equipamiento y precio de referencia. Cotizá tu modelo y agendá un test ride en Barra de Carrasco.`;
  if (description.length < 140) description += " Canelones.";
  return metadata(`CFMOTO ${modelo.nombre} Uruguay`, description, `/${linea}/${slug}`, modelo.imagenes.hero || modelo.imagenes.perfil);
}
export default async function ModeloPage({ params }: Props) {
  const { linea: lineSlug, modelo: slug } = await params;
  const modelo = getModelo(slug, lineSlug);
  const linea = getLinea(lineSlug);
  if (!modelo || !linea) notFound();
  const quote = `/cotizar?modelo=${modelo.slug}`;
  const captions: Record<string, string[]> = { "800mt-touring": ["800MT Touring sobre balasto.", "Equipaje para la ruta; maletas opcionales.", "799 cc, motor bicilíndrico en línea.", "Tablero TFT de 7 pulgadas con conectividad.", "Un camino de tierra, dos 800MT Touring."] };
  return <><div className="product-top shell"><Breadcrumb items={[{ nombre: "Inicio", href: "/" }, { nombre: linea.nombre, href: `/${linea.slug}` }, { nombre: modelo.nombre, href: `/${linea.slug}/${modelo.slug}` }]} /></div>
    <section className="product-hero shell" aria-labelledby="product-heading"><div className="product-heading"><p className="micro">{linea.numero} / {linea.nombre} / CFMOTO</p><ViewTransition name={`nombre-${modelo.slug}`} share="morph" default="none"><h1 id="product-heading" className="display">{modelo.nombre}</h1></ViewTransition><p className="product-deck">{modelo.bajada}</p></div><ViewTransition name={`modelo-${modelo.slug}`} share="morph" default="none"><div className="product-main-image"><ModelImage src={modelo.imagenes.perfil} nombre={modelo.nombre} contain priority sizes="(max-width: 767px) 100vw, 68vw" /></div></ViewTransition><div className="product-purchase"><div className="price-block"><p className="micro">DESDE / REFERENCIA DEMO</p><p className="display">USD {formatUsd(modelo.precioDesdeUsd)}</p></div><div id="product-hero-cta" className="product-ctas"><Link prefetch={false} href={quote} className="button primary">Cotizar <Arrow /></Link><a href={whatsapp({ modelo: modelo.nombre })} className="button secondary" target="_blank" rel="noopener"><WhatsAppIcon /> WhatsApp</a></div><p className="fine">Precio ilustrativo. Consultá disponibilidad y equipamiento para Uruguay.</p>{!!modelo.specs?.length && <a href="#ficha-tecnica" className="text-link">Ver ficha técnica <Arrow /></a>}</div></section>
    {modelo.colores && modelo.colores.length > 0 && <ColorSelector colores={modelo.colores} nombre={modelo.nombre} />}
    {modelo.keySpecs && <section className="key-specs shell" aria-label="Cuatro cifras del modelo">{modelo.keySpecs.map((spec, index) => <div key={spec.etiqueta} className="reveal"><span className="micro">0{index + 1} / {spec.etiqueta}</span><p className="display">{spec.valor}<small>{spec.unidad}</small></p></div>)}</section>}
    {modelo.imagenes.galeria && modelo.imagenes.galeria.length > 0 && <section className="gallery-section" aria-labelledby="gallery-heading"><div className="section-heading shell"><div><p className="micro">02 / EN DETALLE</p><h2 className="display section-title" id="gallery-heading">Desde otro ángulo.</h2></div><CarouselControls id="product-gallery" nombre="galería" /></div><div className="gallery-track" id="product-gallery" tabIndex={0} aria-label={`Fotografías oficiales de ${modelo.nombre}`}>{modelo.imagenes.galeria.filter(Boolean).map((src, index) => <figure key={src}><div className="gallery-image"><ModelImage src={src} nombre={modelo.nombre} sizes="(max-width: 767px) 85vw, 60vw" /></div><figcaption><span className="micro">0{index + 1}</span>{captions[modelo.slug]?.[index] || `${modelo.nombre}. Vista ${index + 1} del modelo en terreno.`}</figcaption></figure>)}</div></section>}
    {modelo.features && modelo.features.length > 0 && <section className="features shell" aria-label="Equipamiento del modelo">{modelo.features.map((feature, index) => <div className={`feature feature-${index}`} key={feature.titulo}><div className="feature-image reveal"><ModelImage src={feature.imagen} nombre={modelo.nombre} sizes="(max-width: 767px) 100vw, 58vw" /></div><div className="feature-copy"><p className="micro">0{index + 3} / EQUIPAMIENTO</p><h2 className="display section-title">{feature.titulo}</h2><p>{feature.texto}</p></div></div>)}</section>}
    {!!modelo.specs?.length && <section className="specs-section shell" id="ficha-tecnica" aria-labelledby="spec-heading"><div><p className="micro">LA FICHA / DATOS OFICIALES</p><h2 id="spec-heading" className="display section-title">Cada dato cuenta.</h2><p className="fine">Especificaciones de la versión internacional. El equipamiento local se confirma al cotizar.</p></div><div>{modelo.specs && modelo.specs.length > 0 ? <>{modelo.specs.map((grupo) => <details className="spec-group" key={grupo.grupo}><summary>{grupo.grupo}<span aria-hidden="true">+</span></summary><table><caption className="sr-only">Especificaciones de {grupo.grupo} de {modelo.nombre}</caption><tbody>{grupo.filas.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></details>)}<div className="source-links">{modelo.fuentes.map((url, index) => <a className="text-link fine" key={url} href={url} target="_blank" rel="noopener">Fuente oficial CFMOTO{modelo.fuentes.length > 1 ? ` ${index + 1}` : ""} <Arrow /></a>)}</div></> : <div className="pending-specs"><p>La ficha técnica de esta versión está pendiente de confirmación.</p><a className="text-link" href={whatsapp({ modelo: modelo.nombre })} target="_blank" rel="noopener">Consultá por {modelo.nombre} <Arrow /></a></div>}</div></section>}
    <section className="related shell" aria-labelledby="related-heading"><div className="section-heading"><div><p className="micro">MISMA LÍNEA / OTRAS OPCIONES</p><h2 id="related-heading" className="display section-title">Seguí mirando.</h2></div><Link prefetch={false} href={`/${linea.slug}`} className="text-link">Ver {linea.nombre.toLowerCase()} <Arrow /></Link></div><div className="related-grid">{getRelacionados(modelo).map((item) => <ModelCard key={item.slug} modelo={item} />)}</div></section><TestRide modelo={modelo} />
    <div className="product-mobile-bar"><Link prefetch={false} href={quote} className="button primary">Cotizar <Arrow /></Link><a href={whatsapp({ modelo: modelo.nombre })} className="button secondary" target="_blank" rel="noopener"><WhatsAppIcon /> WhatsApp</a></div><JsonLd data={productJson(modelo)} /></>;
}
