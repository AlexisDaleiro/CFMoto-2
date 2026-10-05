import Link from "next/link";
import { breadcrumbJson } from "@/lib/seo";
import { JsonLd } from "./json-ld";
export function Breadcrumb({ items }: { items: { nombre: string; href: string }[] }) {
  return <><nav className="breadcrumb micro" aria-label="Ruta de navegación"><ol>{items.map((item, index) => <li key={item.href}>{index === items.length - 1 ? <span aria-current="page">{item.nombre}</span> : <Link prefetch={false} href={item.href}>{item.nombre}</Link>}</li>)}</ol></nav><JsonLd data={breadcrumbJson(items)} /></>;
}
