export type WhatsAppContext = { modelo?: string; linea?: string; testRide?: boolean };
export function mensajeWhatsApp(contexto?: WhatsAppContext) {
  return contexto?.modelo
    ? `Hola, quiero ${contexto.testRide ? "agendar un test ride de" : "cotizar"} la CFMOTO ${contexto.modelo}`
    : contexto?.testRide ? "Hola, quiero coordinar un test ride en CFMOTO Uruguay"
    : contexto?.linea ? `Hola, quiero cotizar un modelo de ${contexto.linea.toLowerCase()} CFMOTO` : "Hola, quiero cotizar un modelo de CFMOTO Uruguay";
}
export function enlaceWhatsApp(telefono: string, contexto?: WhatsAppContext) {
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsApp(contexto))}`;
}
