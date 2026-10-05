"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { enviarCotizacion } from "@/app/cotizar/actions";
import { telefonoUruguayoValido } from "@/lib/cotizacion";
import { Arrow, WhatsAppIcon } from "./icon";
type FormModel = { slug: string; nombre: string; linea: string; imagen: string; wa: string; waTest: string };
type Props = { modelos: FormModel[]; departamentos: string[] };
export function QuoteForm(props: Props) {
  const params = useSearchParams();
  return <FormContents key={`${params.get("modelo")}-${params.get("testRide")}`} {...props} initialModel={params.get("modelo") || ""} testRide={params.get("testRide") === "1"} />;
}
function FormContents({ modelos, departamentos, initialModel, testRide }: Props & { initialModel: string; testRide: boolean }) {
  const [selected, setSelected] = useState(modelos.some((m) => m.slug === initialModel) ? initialModel : "");
  const [state, formAction, pending] = useActionState(enviarCotizacion, { ok: false });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const status = useRef<HTMLDivElement>(null);
  const modelo = modelos.find((item) => item.slug === selected);
  const errores = { ...localErrors, ...state.errores };
  useEffect(() => { if (state.ok) status.current?.focus(); }, [state.ok]);
  function check(event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const input = event.currentTarget;
    const message = input.name === "telefono" && !telefonoUruguayoValido(input.value) ? "Usá 09X XXX XXX o +598 9X XXX XXX." : !input.validity.valid ? "Completá este campo con un dato válido." : "";
    setLocalErrors((prev) => ({ ...prev, [input.name]: message }));
  }
  if (state.ok) {
    const elegido = modelos.find((item) => item.slug === state.modelo);
    return <div ref={status} tabIndex={-1} className="quote-success" role="status"><p className="micro">DEMO / SOLICITUD VALIDADA</p><h2 className="display section-title">Ya está<br />todo listo.</h2><p>La consulta por la <strong>{elegido?.nombre}</strong> pasó la validación. En esta demo el formulario no envía ni guarda tus datos.</p><p>Para una consulta real, escribinos por WhatsApp{state.testRide ? " y coordiná tu test ride" : ""}.</p><a href={state.testRide ? elegido?.waTest : elegido?.wa} className="button primary" target="_blank" rel="noopener"><WhatsAppIcon /> Escribinos por WhatsApp</a><Link prefetch={false} className="text-link" href={elegido ? `/${elegido.linea}/${elegido.slug}` : "/motos"}>Volver al modelo <Arrow /></Link></div>;
  }
  return <form action={formAction} className="quote-form">{modelo && <div className="quote-model">{modelo.imagen && <Image src={modelo.imagen} alt={`CFMOTO ${modelo.nombre}, vista lateral`} width={144} height={96} sizes="144px" />}<div><span className="micro">TU MODELO</span><p className="display">{modelo.nombre}</p></div></div>}
    <div className="form-field"><label htmlFor="nombre">Nombre <span aria-hidden="true">*</span></label><input id="nombre" name="nombre" autoComplete="name" required minLength={2} maxLength={80} placeholder="Tu nombre" onBlur={check} aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "nombre-error" : undefined} />{errores.nombre && <p className="form-error" id="nombre-error">{errores.nombre}</p>}</div>
    <div className="form-field"><label htmlFor="telefono">Celular <span aria-hidden="true">*</span></label><input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" required maxLength={22} pattern="(09[0-9]{7}|\+?5989[0-9]{7}|09[0-9][ ]?[0-9]{3}[ ]?[0-9]{3}|\+?598[ ]?9[0-9][ ]?[0-9]{3}[ ]?[0-9]{3})" placeholder="098 123 456" onBlur={check} aria-invalid={!!errores.telefono} aria-describedby={`telefono-help${errores.telefono ? " telefono-error" : ""}`} /><p className="fine" id="telefono-help">09X XXX XXX o +598 9X XXX XXX.</p>{errores.telefono && <p className="form-error" id="telefono-error">{errores.telefono}</p>}</div>
    <div className="form-field"><label htmlFor="modelo">Modelo <span aria-hidden="true">*</span></label><select id="modelo" name="modelo" required value={selected} onChange={(event) => setSelected(event.target.value)} onBlur={check} aria-invalid={!!errores.modelo} aria-describedby={errores.modelo ? "modelo-error" : undefined}><option value="">Elegí tu CFMOTO</option>{["motos", "cuatriciclos", "utv"].map((linea) => <optgroup key={linea} label={linea === "motos" ? "Motos" : linea === "utv" ? "UTV" : "Cuatriciclos"}>{modelos.filter((item) => item.linea === linea).map((item) => <option key={item.slug} value={item.slug}>{item.nombre}</option>)}</optgroup>)}</select>{errores.modelo && <p className="form-error" id="modelo-error">{errores.modelo}</p>}</div>
    <div className="form-field"><label htmlFor="departamento">Departamento <span className="fine">/ opcional</span></label><select id="departamento" name="departamento" autoComplete="address-level1" aria-invalid={!!errores.departamento} aria-describedby={errores.departamento ? "departamento-error" : undefined}><option value="">Seleccioná tu departamento</option>{departamentos.map((nombre) => <option key={nombre}>{nombre}</option>)}</select>{errores.departamento && <p id="departamento-error" className="form-error">{errores.departamento}</p>}</div>
    <label className="test-checkbox"><input type="checkbox" name="testRide" defaultChecked={testRide} /><span>Quiero agendar un test ride</span></label><p className="fine demo-note">Formulario de demostración. El envío es simulado; tus datos no se guardan ni se envían. Los campos con * son obligatorios.</p><button className="button primary" type="submit" disabled={pending}>{pending ? "Validando…" : "Enviar consulta"}<Arrow /></button>{state.errores && <p className="form-error" role="alert">Revisá los campos marcados antes de continuar.</p>}
  </form>;
}
