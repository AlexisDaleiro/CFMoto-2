"use client";
import { Arrow } from "./icon";
export function CarouselControls({ id, nombre }: { id: string; nombre: string }) {
  function move(direction: number) { const el = document.getElementById(id); if (el) el.scrollBy({ left: direction * (el.querySelector("article, figure")?.getBoundingClientRect().width ?? el.clientWidth), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
  return <div className="carousel-controls"><button type="button" aria-label={`Anterior en ${nombre}`} aria-controls={id} onClick={() => move(-1)}><Arrow left /></button><button type="button" aria-label={`Siguiente en ${nombre}`} aria-controls={id} onClick={() => move(1)}><Arrow /></button></div>;
}
