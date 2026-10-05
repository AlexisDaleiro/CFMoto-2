import { lineas } from "@/content/lineas";
import { modelos } from "@/content/modelos";
import { departamentos, sitio, talleres } from "@/content/sitio";
import type { Linea, Modelo } from "@/content/types";

// El único adaptador de datos. Un backend futuro reemplaza este módulo.
export const getLineas = () => lineas;
export const getLinea = (slug: string) => lineas.find((linea) => linea.slug === slug);
export const getModelos = (linea?: Linea): Modelo[] => modelos.filter((modelo) => !linea || modelo.linea === linea);
export const getModelo = (slug: string, linea?: string): Modelo | undefined => modelos.find((modelo) => modelo.slug === slug && (!linea || modelo.linea === linea));
export const getRelacionados = (modelo: Modelo) => getModelos(modelo.linea).filter((item) => item.slug !== modelo.slug).sort((a, b) => Math.abs(a.segmentoCc - modelo.segmentoCc) - Math.abs(b.segmentoCc - modelo.segmentoCc)).slice(0, 3);
export const getDestacados = () => getModelos().filter((modelo) => modelo.destacado);
export const getSitio = () => sitio;
export const getTalleres = () => talleres;
export const getDepartamentos = () => departamentos;
export const getPrecioLinea = (linea: Linea) => Math.min(...getModelos(linea).flatMap((modelo) => modelo.precioDesdeUsd ? [modelo.precioDesdeUsd] : []));
export const formatUsd = (precio?: number) => precio ? new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(precio) : "Consultar";
