import { Suspense } from "react";
import { getDepartamentos, getModelos, getSitio } from "@/lib/catalogo";
import { metadata as pageMetadata } from "@/lib/seo";
import { whatsapp } from "@/lib/whatsapp";
import { QuoteForm } from "@/components/quote-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Arrow, WhatsAppIcon } from "@/components/icon";
export const metadata = pageMetadata("Cotizar moto CFMOTO Uruguay", "Cotizá tu moto, cuatriciclo o UTV CFMOTO en Uruguay. Elegí un modelo y coordiná un test ride en Barra de Carrasco. También podés escribirnos por WhatsApp.", "/cotizar");
export default function CotizarPage() {
  const sitio = getSitio();
  const modelos = getModelos().map((modelo) => ({ slug: modelo.slug, nombre: modelo.nombre, linea: modelo.linea, imagen: modelo.imagenes.perfil, wa: whatsapp({ modelo: modelo.nombre }), waTest: whatsapp({ modelo: modelo.nombre, testRide: true }) }));
  return <div className="quote-page shell"><Breadcrumb items={[{ nombre: "Inicio", href: "/" }, { nombre: "Cotizar", href: "/cotizar" }]} /><div className="quote-heading"><p className="micro">COTIZACIÓN / TEST RIDE</p><h1 className="display">Hablemos de<br />tu próxima CFMOTO.</h1><p>Elegí el modelo. Contanos cómo contactarte.<br />El próximo paso se coordina con el showroom.</p></div><div className="quote-layout"><Suspense fallback={<p className="fine">Elegí tu modelo para completar la consulta.</p>}><QuoteForm modelos={modelos} departamentos={getDepartamentos()} /></Suspense><aside className="showroom" aria-labelledby="showroom-heading"><p className="micro">VENÍ A VERNOS</p><h2 id="showroom-heading" className="display section-title">Barra de<br />Carrasco.</h2><address>{sitio.direccion}</address><a className="text-link" href={sitio.mapa} target="_blank" rel="noopener">Cómo llegar <Arrow /></a><div><h3 className="micro">HORARIOS</h3>{sitio.horarios.map((horario) => <p key={horario}>{horario}</p>)}</div><div><h3 className="micro">CONTACTO</h3>{sitio.telefonos.map((telefono) => <a key={telefono} href={`tel:+598${telefono.replace(/\D/g, "").slice(1)}`}>{telefono}</a>)}<a href={`mailto:${sitio.email}`}>{sitio.email}</a></div><a className="button secondary" href={whatsapp()} target="_blank" rel="noopener"><WhatsAppIcon /> Escribinos por WhatsApp</a></aside></div></div>;
}
