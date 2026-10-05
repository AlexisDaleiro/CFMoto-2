"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow, WhatsAppIcon } from "./icon";
type NavLine = { slug: string; nombre: string; numero: string; imagen: string; modelos: { slug: string; nombre: string; cc: number; precio: string; imagen: string }[] };
export function Header({ lineas, wa }: { lineas: NavLine[]; wa: string }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = lineas.find((linea) => linea.slug === panel);
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
    if (menuOpen) { dialog.current?.showModal(); dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(); document.body.style.overflow = "hidden"; }
    else { const wasOpen = dialog.current?.open; dialog.current?.close(); document.body.style.overflow = ""; if (wasOpen) menuButton.current?.focus(); }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  function closeMenu() { setMenuOpen(false); }
  return <header ref={header} className="site-header" onKeyDown={(event) => { if (event.key === "Escape") { setPanel(null); (header.current?.querySelector(`[aria-controls="desktop-models-${panel}"]`) as HTMLElement | null)?.focus(); } }}>
    <div className="header-inner"><Link prefetch={false} href="/" className="logo" aria-label="CFMOTO Uruguay, inicio" onClick={() => { setPanel(null); closeMenu(); }}><Image src="/images/cfmoto-logo.svg" alt="CFMOTO" width={142} height={28} /><span>URUGUAY</span></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">{lineas.map((linea) => <div className="nav-line" key={linea.slug}><Link prefetch={false} href={`/${linea.slug}`} aria-current={pathname.startsWith(`/${linea.slug}`) ? "page" : undefined} onClick={() => setPanel(null)}>{linea.nombre}</Link><button type="button" aria-label={`Modelos de ${linea.nombre}`} aria-expanded={panel === linea.slug} aria-controls={`desktop-models-${linea.slug}`} onClick={() => setPanel(panel === linea.slug ? null : linea.slug)}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><path d="m3 4 3 3 3-3" stroke="currentColor" fill="none" /></svg></button></div>)}</nav>
      <Link prefetch={false} href="/cotizar" className="button primary header-quote" onClick={() => setPanel(null)}>Cotizar <Arrow /></Link>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}><svg aria-hidden="true" width="28" height="24" viewBox="0 0 28 24"><path d="M1 7h26M1 17h26" stroke="currentColor" strokeWidth="1.5" /></svg></button>
    </div>
    {lineas.map((linea) => <div key={linea.slug} id={`desktop-models-${linea.slug}`} className="mega-panel" hidden={panel !== linea.slug}>{active && panel === linea.slug && <><div className="mega-intro"><p className="micro">{linea.numero} / CFMOTO URUGUAY</p><h2 className="display">{linea.nombre}</h2><Link prefetch={false} className="text-link" href={`/${linea.slug}`} onClick={() => setPanel(null)}>Ver todos los modelos <Arrow /></Link></div><div className="mega-models">{[...new Set(linea.modelos.map((modelo) => modelo.cc))].map((cc) => <div key={cc}><p className="micro mega-cc">SEGMENTO {cc} CC</p>{linea.modelos.filter((modelo) => modelo.cc === cc).map((modelo) => <Link prefetch={false} href={`/${linea.slug}/${modelo.slug}`} key={modelo.slug} onClick={() => setPanel(null)}>{modelo.imagen && <Image src={modelo.imagen} alt="" width={72} height={48} sizes="72px" />}<span>{modelo.nombre}<small>Desde USD {modelo.precio} · demo</small></span></Link>)}</div>)}</div></>}</div>)}
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Menú principal" onCancel={closeMenu} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, [tabindex="0"]')).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      event.preventDefault();
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current + 1) % focusable.length;
      focusable[next].focus();
    }}>
      <div className="mobile-menu-top"><span className="micro">CFMOTO / URUGUAY</span><button type="button" aria-label="Cerrar menú" onClick={closeMenu}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="m4 4 16 16M20 4 4 20" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
      <nav aria-label="Líneas CFMOTO">{lineas.map((linea) => <Link prefetch={false} className="mobile-line" href={`/${linea.slug}`} key={linea.slug} onClick={closeMenu}><span className="micro">{linea.numero}</span><span className="display">{linea.nombre}</span>{linea.imagen && <Image src={linea.imagen} alt="" width={84} height={64} sizes="84px" />}<Arrow /></Link>)}</nav>
      <div className="mobile-menu-bottom"><Link prefetch={false} className="button primary" href="/cotizar" onClick={closeMenu}>Cotizar <Arrow /></Link><a className="text-link" href={wa} target="_blank" rel="noopener" onClick={closeMenu}><WhatsAppIcon /> Escribinos por WhatsApp</a><p className="fine">Ruta 101 y Calcagno<br />Barra de Carrasco, Canelones</p></div>
    </dialog>
  </header>;
}
