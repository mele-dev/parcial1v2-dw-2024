import { localStorageKeys, sessionStorageKeys, validarToken, logOut } from "../utils.js";

/** @type {HTMLParagraphElement} **/
const btnLogOut = document.getElementById("btnLogOut");

const main = async () => {
    const result = await fetch("http://localhost/back/temas", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem(localStorageKeys.jwtToken)}`,
        }
    });
    const temas = await result.json();
    
    if (!result.ok) {
        confirm("Error inesperado. Te redirigiremos al login.");
        logOut();
    }

    await cargarTemas(temas);
};

/**
 * 
 * @param {json} temas 
 */
const cargarTemas = async (temas) => {
    const helperMessage = document.getElementById("helperMessage");
    for (const i in temas) {
        const tema = temas[i];
        const newDiv = document.createElement("div");
        newDiv.className = "card";
        newDiv.innerHTML = `
            <div id="${tema.id_tema}" class="container">
                <h4><b>${tema.titulo}</b></h4>
                <label>${tema.descripcion}</label>
                <hr>
                <label><i>Comentarios:</i></label>
                <div id="comentarios_${tema.id_tema}"></div>
    
                <div style="margin: 0.5rem;">
                    <button class="addComent fancy-button fancy-button-right grow">Nuevo comentario</button>
                </div>
            </div>
        `;
    
        helperMessage.parentNode.insertBefore(newDiv, helperMessage.nextSibling);
    
        cargarComentariosTema(tema.id_tema)
    }
}

/**
 * 
 * @param {number} idTema 
 */
const cargarComentariosTema = async (idTema) => {
    const div = document.getElementById(`comentarios_${idTema}`);
    const idUsuario = JSON.parse(localStorage.getItem(localStorageKeys.userData)).id_usuario;

    const result = await fetch(`http://localhost/back/usuarios/${idUsuario}/temas/${idTema}/comentarios`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem(localStorageKeys.jwtToken)}`,
        }
    });
    const comentarios = await result.json();

    for (const i in comentarios) {
        const comentario = comentarios[i];
        div.innerHTML = `
            <p id="comentario_${comentario.id_comentario}">${comentario.descripcion}</p>
        `;
        
        const comentarioActual = document.getElementById(`comentario_${comentario.id_comentario}`);

        function clickComentario() {
            const p = comentarioActual.innerHTML;

            comentarioActual.innerHTML = `
                <input value="${comentarioActual.innerHTML}">
            `;

            const label = document.createElement("label");
            label.innerHTML = `
                <label><i>Presione enter para modificar comentario</i></label>
            `;

            comentarioActual.insertBefore(label, comentarioActual.children[0]);
            comentarioActual.removeEventListener("click", clickComentario);

            comentarioActual.addEventListener("keyup", async function(event) {
                if (event.keyCode == 13) {
                    const put = await fetch(`http://localhost/back/usuarios/${idUsuario}/temas/${idTema}/comentarios/${comentario.id_comentario}`, {
                        method: "PUT",
                        body: {
                            descripcion: comentarioActual.innerHTML
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(localStorageKeys.jwtToken)}`,
                        },
                    });

                    const resultado = await put.json();

                    alert(resultado.ok);
                }
            });
        };

        comentarioActual.addEventListener("click", clickComentario);
    }
}

btnLogOut.addEventListener("click", function() {
    logOut();
});


main();