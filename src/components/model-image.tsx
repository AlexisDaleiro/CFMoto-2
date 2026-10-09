/* eslint-disable @next/next/no-img-element -- getImageProps retains the Next image optimizer without client hydration. */
import { getImageProps } from "next/image";
import { ImagenPendiente } from "./imagen-pendiente";
export function ModelImage({ src, mobileSrc, nombre, sizes = "(max-width: 767px) 100vw, 50vw", priority = false, contain = false, className = "" }: { src?: string; mobileSrc?: string; nombre: string; sizes?: string; priority?: boolean; contain?: boolean; className?: string }) {
  if (src && mobileSrc) {
    const common = { alt: `CFMOTO ${nombre}, fotografía oficial`, fill: true, sizes, quality: priority ? 65 : 75, loading: priority ? "eager" as const : "lazy" as const, fetchPriority: priority ? "high" as const : "auto" as const, className: `object-cover ${className}` };
    const { props: desktop } = getImageProps({ ...common, src });
    const { props: mobile } = getImageProps({ ...common, src: mobileSrc });
    return <picture className="model-picture"><source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={sizes} /><img {...desktop} alt={common.alt} /></picture>;
  }
  if (!src) return <ImagenPendiente nombre={nombre} />;
  const { props } = getImageProps({ src, alt: `CFMOTO ${nombre}, ${contain ? "vista del modelo" : "fotografía oficial"}`, fill: true, sizes, loading: priority ? "eager" : "lazy", fetchPriority: priority ? "high" : "auto", quality: priority ? 65 : 75, className: `${contain ? "object-contain" : "object-cover"} ${className}` });
  return <img {...props} alt={props.alt} />;
}
