"use client";
import { useSearchParams } from "next/navigation";
import { startTransition } from "react";
export function DisplacementFilter({ segmentos, modelos }: { segmentos: number[]; modelos: { slug: string; cc: number; card: React.ReactNode }[] }) {
  const params = useSearchParams();
  const raw = Number(params.get("cc"));
  const selected = segmentos.includes(raw) ? raw : 0;
  function select(cc: number) {
    const url = new URL(window.location.href);
    if (cc) url.searchParams.set("cc", String(cc)); else url.searchParams.delete("cc");
    startTransition(() => window.history.pushState(null, "", url.pathname + url.search));
  }
  const visibles = modelos.filter((modelo) => !selected || modelo.cc === selected);
  return <><div className="filter-row"><fieldset><legend className="micro">FILTRAR POR SEGMENTO DE CILINDRADA</legend><div className="chips">{[0, ...segmentos].map((cc) => <button key={cc} type="button" className={cc === selected ? "selected" : ""} aria-pressed={cc === selected} onClick={() => select(cc)}>{cc ? `${cc} cc` : "Todas"}</button>)}</div></fieldset><p className="micro" aria-live="polite">{visibles.length.toString().padStart(2, "0")} MODELOS</p></div><div className="catalog-grid">{visibles.map((modelo) => <div key={modelo.slug} className="catalog-cell">{modelo.card}</div>)}</div></>;
}
