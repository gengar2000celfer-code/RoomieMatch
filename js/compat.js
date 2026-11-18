// Pesos: deben sumar 100 (documentarlos es un entregable)
export const PESOS = {
  presupuesto: 20, ubicacion: 15, ruido: 15, horario: 15,
  limpieza: 10, mascotas: 10, visitas: 10, fumar: 5
};

// Perfil de prueba mientras no hay perfil guardado en Firestore
export const PERFIL_DEMO = {
  presupuestoMin: 3500, presupuestoMax: 4500,
  mascotas: "ninguna", ruido: "tranquilo", limpieza: "alta",
  fuma: false, visitas: "pocas", horario: "diurno"
};

const NIVELES = {
  ruido: ["tranquilo", "moderado", "ruidoso"],
  limpieza: ["baja", "media", "alta"],
  visitas: ["pocas", "algunas", "muchas"]
};

function ordinal(campo, a, b) {
  const lista = NIVELES[campo];
  const dif = Math.abs(lista.indexOf(a) - lista.indexOf(b));
  return 1 - dif / (lista.length - 1);
}

function presupuesto(a, b) {
  const inicio = Math.max(a.presupuestoMin, b.presupuestoMin);
  const fin = Math.min(a.presupuestoMax, b.presupuestoMax);
  if (fin <= inicio) return 0;
  const ancho = Math.min(a.presupuestoMax - a.presupuestoMin, b.presupuestoMax - b.presupuestoMin);
  return Math.min(1, (fin - inicio) / ancho);
}

function horario(a, b) {
  if (a === b) return 1;
  if (a === "flexible" || b === "flexible") return 0.7;
  return 0;
}

export function calcularCompatibilidad(yo, otro) {
  const puntos = {
    presupuesto: presupuesto(yo, otro),
    ubicacion: Math.max(0, 1 - otro.distanciaKm / 10),
    ruido: ordinal("ruido", yo.ruido, otro.ruido),
    horario: horario(yo.horario, otro.horario),
    limpieza: ordinal("limpieza", yo.limpieza, otro.limpieza),
    mascotas: yo.mascotas === otro.mascotas ? 1 : 0.4,
    visitas: ordinal("visitas", yo.visitas, otro.visitas),
    fumar: yo.fuma === otro.fuma ? 1 : 0
  };
  let total = 0;
  for (const campo in PESOS) total += puntos[campo] * PESOS[campo];
  return { total: Math.round(total), detalle: puntos };
}