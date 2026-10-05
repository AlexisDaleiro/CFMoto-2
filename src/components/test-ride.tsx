import Link from "next/link";
import { whatsapp } from "@/lib/whatsapp";
import { Arrow, WhatsAppIcon } from "./icon";
export function TestRide({ modelo }: { modelo?: { slug: string; nombre: string } }) {
  return <section className="test-ride" aria-labelledby="test-ride-heading"><div className="shell test-ride-inner"><div><p className="micro">EL PRÓXIMO PASO / BARRA DE CARRASCO</p><h2 id="test-ride-heading" className="display">Agendá tu<br />test ride{modelo && <span> de la {modelo.nombre}</span>}.</h2></div><div><p>Pasá por Ruta 101 y Calcagno. Coordinamos modelo, día y horario antes de tu visita.</p><Link prefetch={false} className="button primary" href={`/cotizar?${modelo ? `modelo=${modelo.slug}&` : ""}testRide=1`}>Agendar test ride <Arrow /></Link><a className="text-link" href={whatsapp({ modelo: modelo?.nombre, testRide: true })} target="_blank" rel="noopener"><WhatsAppIcon /> Escribinos por WhatsApp</a></div></div></section>;
}
