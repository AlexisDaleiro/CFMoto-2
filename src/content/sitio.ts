export const sitio = {
  nombre: "CFMOTO Uruguay",
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  direccion: "Ruta 101 y Calcagno, Barra de Carrasco, Canelones",
  telefono: "098 379 380",
  telefonos: ["098 379 380", "098 379 379", "091 092 095"],
  whatsapp: "59898379380",
  email: "cfmotouruguay@gmail.com",
  horarios: ["Lunes a viernes · 09:00–13:00 / 14:00–18:30", "Sábados · 09:00–13:00"],
  mapa: "https://www.google.com/maps/search/?api=1&query=CFMOTO+Ruta+101+Calcagno+Barra+de+Carrasco+Uruguay",
  redes: [
    { nombre: "Instagram", url: "https://www.instagram.com/cfmotouruguay" },
    { nombre: "Facebook", url: "https://www.facebook.com/CFMOTOUY" },
    { nombre: "YouTube", url: "https://www.youtube.com/channel/UCyX1skEIAyV34wnAb4n1rfw" },
  ],
  notaPrecios: "Precios de referencia para esta demo, expresados en USD. No constituyen una oferta comercial. Disponibilidad, colores y equipamiento sujetos a confirmación con CFMOTO Uruguay.",
};
export const talleres = [
  { departamento: "Montevideo", locales: [
    { nombre: "Credibikerss", direccion: "Mercedes 1789", telefono: "097 530 690" },
    { nombre: "Cafe Race", direccion: "Av. Rivera 4406 esq. Ambrosio Velazco", telefono: "093 947 771" },
    { nombre: "Allroad", direccion: "Av. Italia 4001", telefono: "2618 1180" },
    { nombre: "Bikeup", direccion: "Comercio 1950", telefono: "2508 818", confirmar: true },
  ] },
  { departamento: "Maldonado", locales: [{ nombre: "Motos Punta", direccion: "Arturo Santana esq. 19 de Abril", telefono: "4224 5163" }] },
  { departamento: "Cerro Largo", locales: [{ nombre: "Yelton Motos", direccion: "Mata 300 esq. Oribe, Melo", telefono: "099 591 074" }, { nombre: "Multimotos Hogar", direccion: "Aparicio Saravia 675, Melo", telefono: "091 367 598" }] },
  { departamento: "Paysandú", locales: [{ nombre: "Francisco Automotores", direccion: "Bulevar Artigas esq. Uruguay", telefono: "4723 4844" }] },
  { departamento: "Salto", locales: [{ nombre: "MYM", direccion: "Av. Gobernador de Viana 675", telefono: "2508 8185", confirmar: true }] },
  { departamento: "Colonia", locales: [{ nombre: "Automercado", direccion: "Ruta 1 km 128.500, Radial Rosario", telefono: "4552 1483" }] },
];
export const departamentos = ["Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"];
