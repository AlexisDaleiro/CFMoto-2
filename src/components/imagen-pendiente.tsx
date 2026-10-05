export function ImagenPendiente({ nombre }: { nombre: string }) {
  return <div className="imagen-pendiente" role="img" aria-label={`Imagen oficial de ${nombre} pendiente de confirmación`}><span className="micro">CFMOTO / IMAGEN PENDIENTE</span><span className="display outline">{nombre}</span><span className="pending-caption">Catálogo CFMOTO Uruguay</span></div>;
}
