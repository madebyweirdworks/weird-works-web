import { mountWokiRig } from "./woki-rig/woki-rig.js";

const container = document.querySelector("#woki-team-rig");

if (container) {
    mountWokiRig(container, {
        src: "./woki-rig/woki-rigged.svg",
        gaze: true,
        blink: true
    }).catch((error) => {
        console.error("No se pudo cargar Woki en la landing.", error);
        container.hidden = true;
    });
}
