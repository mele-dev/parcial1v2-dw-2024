import { localStorageKeys, sessionStorageKeys } from "./utils.js";

/** @type {HTMLParagraphElement} **/
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
    const allInputs = [ username, contraseña, loginButton];

    try {
        for (const input of allInputs) {
            input.disabled = true;
        }

        const result = await fetch("http://localhost/back/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                contraseña: contraseña.value,   
            }),
        });

        const token = await result.json();
        alert(`token = ${JSON.stringify(token)}`)

        if (result.ok) {
            localStorage.setItem(localStorageKeys.jwtToken, token.token);
            localStorage.setItem(localStorageKeys.userData, JSON.stringify(token.usuario));
            const aimPage = sessionStorage.getItem(sessionStorageKeys.aimPage);
            sessionStorage.removeItem(sessionStorageKeys.aimPage, "aimPage");
            window.location.href = aimPage ?? "./temas";
        } else if (result.status === 404) {
            helperMessage.innerText = "No pudimos encontrarte";
            helperMessage.style.color = "red";
        } else {
            console.error(result);
        }
    } catch (e) {
        helperMessage.innerText = "Error de red";
        helperMessage.style.color = "red";
        console.error(e);
    } finally {
        for (const input of allInputs) {
            input.disabled = false;
        }
    }
});