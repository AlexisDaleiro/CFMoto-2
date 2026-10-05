import { getTalleres } from "@/lib/catalogo";
export function ServiceList({ compact = false }: { compact?: boolean }) {
  return <div className={`service-list ${compact ? "compact" : ""}`}>{getTalleres().map((grupo) => <details key={grupo.departamento}><summary><span>{grupo.departamento}</span><span className="micro">{grupo.locales.length.toString().padStart(2, "0")}</span></summary><ul>{grupo.locales.map((local) => <li key={local.nombre}><h3>{local.nombre}</h3><p>{local.direccion}</p><a href={`tel:+598${local.telefono.replace(/\D/g, "").replace(/^0/, "")}`}>{local.telefono}</a>{"confirmar" in local && local.confirmar && <small className="fine">Número a confirmar</small>}</li>)}</ul></details>)}</div>;
}
