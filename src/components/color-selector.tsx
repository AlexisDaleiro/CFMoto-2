"use client";
import Image from "next/image";
import { useState } from "react";
export function ColorSelector({ colores, nombre }: { colores: { nombre: string; hex: string; imagen: string }[]; nombre: string }) {
  const [selected, setSelected] = useState(0);
  return <section className="color-section shell" aria-labelledby="color-heading"><div className="color-title"><p className="micro">01 / CONFIGURACIÓN</p><h2 id="color-heading" className="display section-title">A tu manera.</h2><fieldset><legend className="micro">Color de referencia</legend><div className="swatches">{colores.map((color, index) => <label className="swatch" key={color.nombre} title={color.nombre}><input type="radio" name="color" value={color.nombre} checked={index === selected} onChange={() => setSelected(index)} aria-label={color.nombre} /><span style={{ background: color.hex }} /></label>)}</div><p aria-live="polite">{colores[selected].nombre}</p></fieldset><p className="fine">Colores sujetos a disponibilidad local.</p></div><div className="color-image">{colores.map((color, index) => <Image key={color.nombre} src={color.imagen} alt={`CFMOTO ${nombre} color ${color.nombre}, vista lateral`} fill sizes="(max-width: 767px) 100vw, 66vw" className={index === selected ? "selected" : ""} />)}</div></section>;
}
