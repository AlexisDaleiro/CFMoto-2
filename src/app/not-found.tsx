import Link from "next/link";
import { Arrow } from "@/components/icon";
export default function NotFound() {
  return <section className="not-found shell"><p className="micro">CFMOTO URUGUAY / 404</p><h1 className="display">Este camino<br />no sigue.</h1><p>La página que buscás no está en el catálogo. Volvé al inicio o elegí una línea.</p><div><Link prefetch={false} className="button primary" href="/">Volver al inicio <Arrow /></Link><Link prefetch={false} className="text-link" href="/motos">Ver motos <Arrow /></Link></div></section>;
}
