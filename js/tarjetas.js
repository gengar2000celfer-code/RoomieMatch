import { alternarFavorito, abrirConversacion } from "./datos.js";

export const esc = (t) => String(t ?? "").replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  export function pintarTarjetas(cont, lista, favs, acc) {
    if (!lista.length) { cont.innerHTML = '<p class="lema">No hay resultados.</p>'; return; }
      cont.innerHTML = lista.map(r => {
          const esFav = favs.has(r.id);
              const ini = esc((r.nombre || "?").split(" ").map(p => p[0]).slice(0, 2).join(""));
                  const foto = r.foto ? `<img class="avatar" src="${esc(r.foto)}" alt="">` : `<div class="avatar">${ini}</div>`;
                      const lugar = r.distanciaKm != null ? esc(r.distanciaKm) + " km" : esc(r.zona || "Sin zona");
                          return `<article class="tarjeta">
                                ${foto}
                                      <button class="fav ${esFav ? "on" : ""}" data-fav="${esc(r.id)}">${esFav ? "♥" : "♡"}</button>
                                            <div class="pct">${r.pct}%</div>
                                                  <h3>${esc(r.nombre)}</h3>
                                                        <p class="meta">${esc(r.edad)} años · ${esc(r.ocupacion || "Estudiante")}</p>
                                                              <p class="meta">${esc(r.bio)}</p>
                                                                    <div class="tags">
                                                                            <span class="tag">$${esc(r.presupuestoMin)} - $${esc(r.presupuestoMax)}</span>
                                                                                    <span class="tag">${lugar}</span>
                                                                                            <span class="tag">Mascotas: ${esc(r.mascotas)}</span>
                                                                                                    <span class="tag">${esc(r.ruido)}</span>
                                                                                                          </div>
                                                                                                                <button class="btn claro" data-msg="${esc(r.id)}">Enviar mensaje</button>
                                                                                                                    </article>`;
                                                                                                                      }).join("");
                                                                                                                        cont.querySelectorAll("[data-fav]").forEach(b => b.onclick = () => acc.onFav(b.dataset.fav));
                                                                                                                          cont.querySelectorAll("[data-msg]").forEach(b => b.onclick = () => acc.onMsg(b.dataset.msg));
                                                                                                                          }

                                                                                                                          export function crearAcciones(user, favs, getTodos, repintar) {
                                                                                                                            return {
                                                                                                                                onFav: async (id) => {
                                                                                                                                      await alternarFavorito(user.uid, id, favs.has(id));
                                                                                                                                            favs.has(id) ? favs.delete(id) : favs.add(id);
                                                                                                                                                  repintar();
                                                                                                                                                      },
                                                                                                                                                          onMsg: async (id) => {
                                                                                                                                                                const otro = getTodos().find(x => x.id === id);
                                                                                                                                                                      const cid = await abrirConversacion(
                                                                                                                                                                              { uid: user.uid, nombre: user.displayName || "Usuario", foto: user.photoURL || "" }, otro);
                                                                                                                                                                                    location.href = "mensajes.html?c=" + encodeURIComponent(cid);
                                                                                                                                                                                        }
                                                                                                                                                                                          };
                                                                                                                                                                                          }