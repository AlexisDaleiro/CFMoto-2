/* eslint-disable @next/next/no-img-element -- Thumbnails use server-generated optimized image props. */
import { getImageProps } from "next/image";
import Link from "next/link";
import { formatUsd, getModelos } from "@/lib/catalogo";
import { Arrow } from "./icon";
export function NavCatalog({ linea }: { linea: { slug: "motos" | "cuatriciclos" | "utv"; nombre: string; numero: string } }) {
  const modelos = getModelos(linea.slug);
  return <><div className="mega-intro"><p className="micro">{linea.numero} / CFMOTO URUGUAY</p><h2 className="display">{linea.nombre}</h2><Link prefetch={false} className="text-link" href={`/${linea.slug}`}>Ver todos los modelos <Arrow /></Link></div><div className="mega-models">{[...new Set(modelos.map((modelo) => modelo.segmentoCc))].map((cc) => <div key={cc}><p className="micro mega-cc">SEGMENTO {cc} CC</p>{modelos.filter((modelo) => modelo.segmentoCc === cc).map((modelo) => <Link prefetch={false} href={`/${linea.slug}/${modelo.slug}`} key={modelo.slug}>{modelo.imagenes.perfil && <img {...getImageProps({ src: modelo.imagenes.perfil, alt: "", width: 72, height: 48, sizes: "72px" }).props} alt="" loading="lazy" />}<span>{modelo.nombre}<small>Desde USD {formatUsd(modelo.precioDesdeUsd)} · demo</small></span></Link>)}</div>)}</div></>;
}
