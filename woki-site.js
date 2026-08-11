import { mountWokiRig } from "./woki-rig/woki-rig.js";

const container = document.querySelector("#woki-team-rig");

if (container) {
    mountWokiRig(container, {
        src: "./woki-rig/woki-rigged.svg",
        gaze: true,
        blink: true
    })
        .then(() => {
            const svg = container.querySelector("svg");

            if (svg) {
                svg.setAttribute("viewBox", "0 0 400 225");
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            }
        })
        .catch((error) => {
            console.error("No se pudo cargar Woki en la landing.", error);
            container.hidden = true;
        });
}
