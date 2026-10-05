import Image from "next/image";
import { ImagenPendiente } from "./imagen-pendiente";
export function ModelImage({ src, nombre, sizes = "(max-width: 767px) 100vw, 50vw", priority = false, contain = false, className = "" }: { src?: string; nombre: string; sizes?: string; priority?: boolean; contain?: boolean; className?: string }) {
  return src ? <Image src={src} alt={`CFMOTO ${nombre}, ${contain ? "vista lateral del modelo" : "fotografía oficial"}`} fill sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} quality={priority ? 65 : 75} className={`${contain ? "object-contain" : "object-cover"} ${className}`} /> : <ImagenPendiente nombre={nombre} />;
}
