import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, query, where, orderBy, onSnapshot, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
  import { calcularCompatibilidad } from "./compat.js";

  // ---- Perfil ----
  export async function cargarPerfil(uid) {
    const s = await getDoc(doc(db, "usuarios", uid));
      return s.exists() ? s.data() : null;
      }
      export async function guardarPerfil(uid, datos) {
        const ref = doc(db, "usuarios", uid);
          const existe = (await getDoc(ref)).exists();
            await setDoc(ref, existe ? datos : { ...datos, rol: "estudiante" }, { merge: true });
            }

            // ---- Candidatos (usuarios reales + ejemplos) ----
            export async function cargarCandidatos(uid) {
              const demo = await (await fetch("data/roomies.json")).json();
                const snap = await getDocs(collection(db, "usuarios"));
                  const reales = snap.docs
                      .filter(d => d.id !== uid && d.data().perfilCompleto)
                          .map(d => ({ id: d.id, ...d.data() }));
                            return [...reales, ...demo];
                            }
                            export function conPorcentaje(yo, lista) {
                              return lista.map(r => ({ ...r, pct: calcularCompatibilidad(yo, r).total }))
                                            .sort((a, b) => b.pct - a.pct);
                                            }

                                            // ---- Favoritos ----
                                            export async function cargarFavoritos(uid) {
                                              const s = await getDocs(query(collection(db, "favoritos"), where("uid", "==", uid)));
                                                return s.docs.map(d => d.data().otroId);
                                                }
                                                export async function alternarFavorito(uid, otroId, yaEsFav) {
                                                  const ref = doc(db, "favoritos", uid + "_" + otroId);
                                                    if (yaEsFav) await deleteDoc(ref); else await setDoc(ref, { uid, otroId });
                                                    }

                                                    // ---- Mensajes ----
                                                    export const idConv = (a, b) => [a, b].sort().join("__");

                                                    export async function abrirConversacion(yo, otro) {
                                                      const cid = idConv(yo.uid, otro.id);
                                                        await setDoc(doc(db, "conversaciones", cid), {
                                                            participantes: [yo.uid, otro.id],
                                                                datos: {
                                                                      [yo.uid]: { nombre: yo.nombre, foto: yo.foto || "" },
                                                                            [otro.id]: { nombre: otro.nombre, foto: otro.foto || "" }
                                                                                }
                                                                                  }, { merge: true });
                                                                                    return cid;
                                                                                    }
                                                                                    export async function enviarMensaje(cid, uid, texto) {
  await addDoc(collection(db, "conversaciones", cid, "mensajes"),
    { de: uid, texto, fecha: serverTimestamp() });
  await setDoc(doc(db, "conversaciones", cid),
    { ultimoMensaje: texto, ultimoDe: uid, actualizado: serverTimestamp() }, { merge: true });
                                                                                    }
                                                                                                export function escucharMensajes(cid, cb) {
                                                                                                  const q = query(collection(db, "conversaciones", cid, "mensajes"), orderBy("fecha"));
                                                                                                    return onSnapshot(q, s => cb(s.docs.map(d => d.data())));
                                                                                                    }
                                                                                                    export function escucharConversaciones(uid, cb) {
                                                                                                      const q = query(collection(db, "conversaciones"), where("participantes", "array-contains", uid));
                                                                                                        return onSnapshot(q, s => {
                                                                                                            const lista = s.docs.map(d => ({ id: d.id, ...d.data() }));
                                                                                                                lista.sort((a, b) => (b.actualizado?.seconds || 0) - (a.actualizado?.seconds || 0));
                                                                                                                    cb(lista);
                                                                                                                      });
                                                                                                                      }

                                                                                                                      // ---- Cuenta ----
                                                                                                                      export async function eliminarMisDatos(uid) {
                                                                                                                        const f = await getDocs(query(collection(db, "favoritos"), where("uid", "==", uid)));
                                                                                                                          await Promise.all(f.docs.map(d => deleteDoc(d.ref)));
                                                                                                                            await deleteDoc(doc(db, "usuarios", uid));
                                                                                                                            }

// ---- Index: cuenta privada, preferencias y actividad ----
export async function cargarCuenta(uid) {
  const s = await getDoc(doc(db, "cuentas", uid));
  return s.exists() ? s.data() : null;
}
export async function guardarPreferenciasInicio(uid, prefs) {
  await setDoc(doc(db, "cuentas", uid), { preferenciasInicio: prefs }, { merge: true });
}
export async function marcarNotifVistas(uid) {
  await setDoc(doc(db, "cuentas", uid), { notifVistas: serverTimestamp() }, { merge: true });
}
export async function marcarActividad(uid) {
  await setDoc(doc(db, "usuarios", uid), { ultimaActividad: serverTimestamp() }, { merge: true });
}
