export type CotizacionState = { ok: boolean; errores?: Partial<Record<"nombre" | "telefono" | "modelo" | "departamento", string>>; modelo?: string; testRide?: boolean };
export const telefonoUruguayoValido = (value: string) => /^(?:09\d{7}|(?:\+?598)9\d{7})$/.test(value.replace(/[\s()-]/g, ""));
