import { getSitio } from "./catalogo";
export function whatsapp(contexto?: { modelo?: string; linea?: string; testRide?: boolean }) {
  const mensaje = contexto?.modelo
    ? `Hola, quiero ${contexto.testRide ? "agendar un test ride de" : "cotizar"} la CFMOTO ${contexto.modelo}`
    : contexto?.linea ? `Hola, quiero info sobre ${contexto.linea.toLowerCase()} CFMOTO` : "Hola, quiero info sobre CFMOTO Uruguay";
  return `https://wa.me/${getSitio().whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
