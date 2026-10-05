export function Arrow({ left = false }: { left?: boolean }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" style={left ? { transform: "rotate(180deg)" } : undefined}><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
export function WhatsAppIcon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7.5c-.8 1.3.3 3.6 2 5.3 1.7 1.7 4 2.8 5.3 2l1-1.4-2.6-1.4-1 1c-1.3-.5-2.3-1.5-2.8-2.8l1-1-1.4-2.6L8 7.5Z" fill="currentColor" /></svg>;
}
