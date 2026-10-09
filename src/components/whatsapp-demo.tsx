"use client";
import { lazy, Suspense, useRef, useState } from "react";
import type { WhatsAppContext } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icon";

const Dialog = lazy(() => import("./whatsapp-dialog"));
export function WhatsAppDemo({ contexto, className = "text-link", children = "WhatsApp" }: { contexto?: WhatsAppContext; className?: string; children?: React.ReactNode }) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return <><button ref={trigger} type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}><WhatsAppIcon />{children}</button>
    {open && <Suspense fallback={<span role="status" className="sr-only">Preparando mensaje…</span>}><Dialog contexto={contexto} onClose={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }} /></Suspense>}
  </>;
}
