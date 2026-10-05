import Link from "next/link";
import { ViewTransition } from "react";
import type { Modelo } from "@/content/types";
import { formatUsd } from "@/lib/catalogo";
import { Arrow } from "./icon";
import { ModelImage } from "./model-image";
export function ModelCard({ modelo, editorial = false }: { modelo: Modelo; editorial?: boolean }) {
  return <article className={`model-card ${modelo.destacado ? "featured-card" : ""}`}>
    <Link className="model-card-link" href={`/${modelo.linea}/${modelo.slug}`}>
      <span className="micro card-segment">{modelo.linea === "motos" ? "MOTOS" : modelo.linea === "utv" ? "UTV" : "ATV"} / {String(modelo.segmentoCc).padStart(3, "0")}</span>
      <ViewTransition name={`modelo-${modelo.slug}`} share="morph" default="none"><div className="card-image"><ModelImage src={modelo.imagenes.perfil} nombre={modelo.nombre} contain sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 33vw" /></div></ViewTransition>
      <div className="card-name-row"><ViewTransition name={`nombre-${modelo.slug}`} share="morph" default="none"><h3 className="display card-name">{modelo.nombre}</h3></ViewTransition><Arrow /></div>
      {modelo.datosTecnicosVerificados && <div className={`card-specs ${editorial ? "editorial-specs" : ""}`}><span>{modelo.cilindradaCc}<small> cc</small></span>{modelo.potenciaHp && <span>{modelo.potenciaHp}<small> HP</small></span>}{editorial && modelo.torqueNm && <span>{modelo.torqueNm}<small> Nm</small></span>}</div>}
    </Link>
    <div className="card-bottom"><p><span className="micro">DESDE / REFERENCIA DEMO</span><span className="card-price">USD {formatUsd(modelo.precioDesdeUsd)}</span></p><Link className="text-link" href={`/cotizar?modelo=${modelo.slug}`}>Cotizar <Arrow /></Link></div>
  </article>;
}
