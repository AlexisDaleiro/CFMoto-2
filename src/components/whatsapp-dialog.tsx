"use client";
import { useEffect, useId, useRef, useState } from "react";
import { containDialogFocus } from "@/lib/dialog-focus";
import { mensajeWhatsApp, type WhatsAppContext } from "@/lib/whatsapp";

export default function WhatsAppDialog({ contexto, onClose }: { contexto?: WhatsAppContext; onClose: () => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close(); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(mensajeWhatsApp(contexto)); setCopyState("copied"); }
    catch { setCopyState("error"); message.current?.focus(); message.current?.select(); }
  }
  return <dialog onKeyDown={containDialogFocus} ref={dialog} className="contact-demo" aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="contact-demo-heading"><p className="micro">CFMOTO URUGUAY / DEMO</p><button type="button" className="dialog-close" aria-label="Cerrar mensaje de prueba" title="Cerrar" onClick={onClose}><span aria-hidden="true">×</span></button></div>
    <h2 id={`${id}-title`}>Tu mensaje de WhatsApp</h2><p id={`${id}-note`} className="fine">Mensaje de prueba. No se envía al showroom ni abre WhatsApp.</p>
    <label className="sr-only" htmlFor={`${id}-message`}>Mensaje preparado</label><textarea ref={message} id={`${id}-message`} readOnly value={mensajeWhatsApp(contexto)} rows={4} />
    <div className="contact-demo-actions"><button type="button" className="button primary" onClick={copy}>Copiar mensaje</button><button type="button" className="button secondary" onClick={onClose}>Cerrar</button></div>
    <p className="copy-status fine" role="status">{copyState === "copied" ? "Mensaje copiado." : copyState === "error" ? "No se pudo copiar. El mensaje quedó seleccionado para copiarlo manualmente." : ""}</p>
  </dialog>;
}
