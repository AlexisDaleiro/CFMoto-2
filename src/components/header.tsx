"use client";
/* eslint-disable @next/next/no-img-element -- SVG logo and thumbnail props optimized with getImageProps on the server. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icon";
import { WhatsAppDemo } from "./whatsapp-demo";
import { containDialogFocus } from "@/lib/dialog-focus";
type NavLine = { slug: string; nombre: string; numero: string; imagen: string; imagenSrcSet?: string };
export function Header({ lineas, panels }: { lineas: NavLine[]; panels: React.ReactNode[] }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      header.current?.classList.toggle("solid", y > 48 || !document.querySelector(".photo-hero"));
      header.current?.classList.toggle("header-hidden", y > previous && y > 180 && !header.current?.contains(document.activeElement));
      previous = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const cta = document.getElementById("product-hero-cta");
    const observer = cta ? new IntersectionObserver(([entry]) => document.documentElement.classList.toggle("show-product-bar", !entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 }) : null;
    if (cta) observer?.observe(cta);
    return () => { window.removeEventListener("scroll", onScroll); observer?.disconnect(); document.documentElement.classList.remove("show-product-bar"); };
  }, [pathname]);
  useEffect(() => {
    if (menuOpen) dialog.current?.showModal();
    else { const wasOpen = dialog.current?.open; dialog.current?.close(); if (wasOpen) menuButton.current?.focus(); }
  }, [menuOpen]);
  function closeMenu() { setMenuOpen(false); }
  return <header ref={header} className="site-header" onKeyDown={(event) => { if (event.key === "Escape") { setPanel(null); (header.current?.querySelector(`[aria-controls="desktop-models-${panel}"]`) as HTMLElement | null)?.focus(); } }}>
    <div className="header-inner"><Link prefetch={false} href="/" className="logo" aria-label="CFMOTO Uruguay, inicio" onClick={() => { setPanel(null); closeMenu(); }}><img src="/images/cfmoto-logo.svg" alt="CFMOTO" width={142} height={28} /><span>URUGUAY</span></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">{lineas.map((linea) => <div className="nav-line" key={linea.slug}><Link prefetch={false} href={`/${linea.slug}`} aria-current={pathname.startsWith(`/${linea.slug}`) ? "page" : undefined} onClick={() => setPanel(null)}>{linea.nombre}</Link><button type="button" aria-label={`Modelos de ${linea.nombre}`} aria-expanded={panel === linea.slug} aria-controls={`desktop-models-${linea.slug}`} onClick={() => setPanel(panel === linea.slug ? null : linea.slug)}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><path d="m3 4 3 3 3-3" stroke="currentColor" fill="none" /></svg></button></div>)}</nav>
      <Link prefetch={false} href="/cotizar" className="button primary header-quote" onClick={() => setPanel(null)}>Cotizar <Arrow /></Link>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}><svg aria-hidden="true" width="28" height="24" viewBox="0 0 28 24"><path d="M1 7h26M1 17h26" stroke="currentColor" strokeWidth="1.5" /></svg></button>
    </div>
    {lineas.map((linea, index) => <div key={linea.slug} id={`desktop-models-${linea.slug}`} className="mega-panel" hidden={panel !== linea.slug} onClick={(event) => { if ((event.target as Element).closest("a")) setPanel(null); }}>{panels[index]}</div>)}
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Menú principal" onCancel={closeMenu} onKeyDown={containDialogFocus}>
     <div className="mobile-menu-top"><span className="micro">CFMOTO / URUGUAY</span><button type="button" aria-label="Cerrar menú" onClick={closeMenu}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="m4 4 16 16M20 4 4 20" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
     <nav aria-label="Líneas CFMOTO">{lineas.map((linea) => <Link prefetch={false} className="mobile-line" href={`/${linea.slug}`} key={linea.slug} onClick={closeMenu}><span className="micro">{linea.numero}</span><span className="display">{linea.nombre}</span>{linea.imagen && <img src={linea.imagen} srcSet={linea.imagenSrcSet} alt="" loading="lazy" width={84} height={64} sizes="84px" />}<Arrow /></Link>)}</nav>
     <div className="mobile-menu-bottom"><Link prefetch={false} className="button primary" href="/cotizar" onClick={closeMenu}>Cotizar <Arrow /></Link><WhatsAppDemo>Escribinos por WhatsApp</WhatsAppDemo><p className="fine">Ruta 101 y Calcagno<br />Barra de Carrasco, Canelones</p></div>
   </dialog>
  </header>;
}
