import { auth, onAuthStateChanged } from "./firebase.js";
import { cargarPerfil } from "./datos.js";

const ITEMS = [["index.html","Inicio"],["perfil.html","Mi perfil"],["buscar.html","Buscar roomies"],
  ["favoritos.html","Mis favoritos"],["mensajes.html","Mensajes"],["config.html","Configuración"]];

  export function menuHTML(activo) {
    return `<div class="logo">RoomieMatch</div>
      <p class="lema">Más que una habitación, es la persona correcta.</p>
        <nav class="menu">
            ${ITEMS.map(([h, t]) => `<a href="${h}" class="${h === activo ? "activo" : ""}">${t}</a>`).join("")}
                <a class="pronto">Calendario (próximamente)</a>
                    <a class="pronto">Gastos (próximamente)</a>
                        <a class="pronto">Reglas de vivienda (próximamente)</a>
                          </nav>`;
                          }

                          export function protegerPagina(activo, cb) {
                            onAuthStateChanged(auth, async (user) => {
                              if (!user) { location.href = "login.html"; return; }
                                    document.getElementById("sidebar").innerHTML = menuHTML(activo);
                                        document.getElementById("app").hidden = false;
                                            cb(user, await cargarPerfil(user.uid));
                                              });
                                              }