"use server";
import { getDepartamentos, getModelo } from "@/lib/catalogo";
import { telefonoUruguayoValido, type CotizacionState } from "@/lib/cotizacion";
export async function enviarCotizacion(_prev: CotizacionState, data: FormData): Promise<CotizacionState> {
  const nombre = String(data.get("nombre") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const modelo = String(data.get("modelo") || "");
  const departamento = String(data.get("departamento") || "");
  const errores: NonNullable<CotizacionState["errores"]> = {};
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = "Ingresá tu nombre (entre 2 y 80 caracteres).";
  if (!telefonoUruguayoValido(telefono)) errores.telefono = "Ingresá un celular uruguayo: 09X XXX XXX o +598 9X XXX XXX.";
  if (!getModelo(modelo)) errores.modelo = "Elegí un modelo del catálogo.";
  if (departamento && !getDepartamentos().includes(departamento)) errores.departamento = "Elegí un departamento de Uruguay.";
  if (Object.keys(errores).length) return { ok: false, errores };
  // Conectar aquí el CRM o servicio de email antes de habilitar el envío real.
  return { ok: true, modelo, testRide: data.get("testRide") === "on" };
}
