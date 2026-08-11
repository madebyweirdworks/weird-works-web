export async function mountWokiRig(container, options = {}) {
    const {
        src = "./woki-rigged.svg",
        gaze = true,
        blink = true,
        blinkMin = 2600,
        blinkMax = 6200
    } = options;

    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`No se pudo cargar Woki: ${response.status}`);
    }

    container.innerHTML = await response.text();
    container.classList.add("woki-stage");

    const svg = container.querySelector("svg");
    const pupilLeft = container.querySelector("#pupil-left");
    const pupilRight = container.querySelector("#pupil-right");

    replaceRasterPupil(pupilLeft, 165, 185);
    replaceRasterPupil(pupilRight, 235, 185);

    let blinkTimer;

    function replaceRasterPupil(group, cx, cy) {
        if (!group) return;

        group.replaceChildren();

        const pupil = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pupil.setAttribute("cx", cx);
        pupil.setAttribute("cy", cy);
        pupil.setAttribute("r", "8");
        pupil.setAttribute("fill", "#050505");
        pupil.setAttribute("class", "pupil-shape");

        group.appendChild(pupil);
    }

    function setPupilOffset(x, y) {
        if (!pupilLeft || !pupilRight) return;

        const transform = `translate(${x}px, ${y}px)`;
        pupilLeft.style.transform = transform;
        pupilRight.style.transform = transform;
    }

    function resetGaze() {
        setPupilOffset(0, 0);
    }

    function handlePointerMove(event) {
        if (!gaze || !svg) return;

        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.53;

        const dx = (event.clientX - cx) / Math.max(rect.width, 1);
        const dy = (event.clientY - cy) / Math.max(rect.height, 1);

        const x = Math.max(-5, Math.min(5, dx * 12));
        const y = Math.max(-4, Math.min(4, dy * 10));

        setPupilOffset(x, y);
    }

    function doBlink() {
        container.classList.add("is-blinking");
        window.setTimeout(() => {
            container.classList.remove("is-blinking");
        }, 115);
    }

    function scheduleBlink() {
        if (!blink) return;

        const delay = blinkMin + Math.random() * (blinkMax - blinkMin);
        blinkTimer = window.setTimeout(() => {
            doBlink();
            scheduleBlink();
        }, delay);
    }

    if (gaze) {
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        container.addEventListener("pointerleave", resetGaze);
    }

    scheduleBlink();

    const api = {
        blink: doBlink,

        peek() {
            container.classList.remove("is-peeking");
            void container.offsetWidth;
            container.classList.add("is-peeking");
        },

        think(active = true) {
            container.classList.toggle("is-thinking", active);
        },

        lookAt(x = 0, y = 0) {
            setPupilOffset(
                Math.max(-5, Math.min(5, x)),
                Math.max(-4, Math.min(4, y))
            );
        },

        reset() {
            container.classList.remove("is-thinking", "is-peeking", "is-blinking");
            resetGaze();
        },

        destroy() {
            window.clearTimeout(blinkTimer);
            window.removeEventListener("pointermove", handlePointerMove);
            container.innerHTML = "";
            container.classList.remove("woki-stage");
        }
    };

    return api;
}
