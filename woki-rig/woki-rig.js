export async function mountWokiRig(container, options = {}) {
    const {
        src = "./woki-rigged.svg",
        gaze = true,
        blink = true,
        blinkMin = 2800,
        blinkMax = 6800
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

    let blinkTimer;
    let gazeFrame;
    let thinking = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function applyPupilOffset(x, y) {
        if (!pupilLeft || !pupilRight) return;

        const transform = `translate(${x}px, ${y}px)`;
        pupilLeft.style.transform = transform;
        pupilRight.style.transform = transform;
    }

    function animateGaze() {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;
        applyPupilOffset(currentX, currentY);

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            gazeFrame = window.requestAnimationFrame(animateGaze);
        } else {
            currentX = targetX;
            currentY = targetY;
            applyPupilOffset(currentX, currentY);
            gazeFrame = undefined;
        }
    }

    function setPupilTarget(x, y) {
        targetX = Math.max(-4.5, Math.min(4.5, x));
        targetY = Math.max(-3.5, Math.min(3.5, y));

        if (!gazeFrame) {
            gazeFrame = window.requestAnimationFrame(animateGaze);
        }
    }

    function resetGaze() {
        if (!thinking) {
            setPupilTarget(0, 0);
        }
    }

    function handlePointerMove(event) {
        if (!gaze || !svg || thinking) return;

        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.54;

        const dx = (event.clientX - cx) / Math.max(rect.width, 1);
        const dy = (event.clientY - cy) / Math.max(rect.height, 1);

        setPupilTarget(dx * 10, dy * 8);
    }

    function doBlink(doubleBlink = false) {
        container.classList.add("is-blinking");

        window.setTimeout(() => {
            container.classList.remove("is-blinking");

            if (doubleBlink) {
                window.setTimeout(() => {
                    container.classList.add("is-blinking");
                    window.setTimeout(() => container.classList.remove("is-blinking"), 95);
                }, 125);
            }
        }, 105);
    }

    function scheduleBlink() {
        if (!blink) return;

        const delay = blinkMin + Math.random() * (blinkMax - blinkMin);
        blinkTimer = window.setTimeout(() => {
            doBlink(Math.random() < 0.2);
            scheduleBlink();
        }, delay);
    }

    function triggerPeek() {
        container.classList.remove("is-peeking");
        void container.offsetWidth;
        container.classList.add("is-peeking");

        window.setTimeout(() => {
            container.classList.remove("is-peeking");
        }, 820);
    }

    function setThinking(active = true) {
        thinking = active;
        container.classList.toggle("is-thinking", active);

        if (active) {
            setPupilTarget(3, -3.5);
        } else {
            resetGaze();
        }
    }

    if (gaze) {
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        container.addEventListener("pointerleave", resetGaze);
    }

    scheduleBlink();

    return {
        blink: () => doBlink(false),
        peek: triggerPeek,
        think: setThinking,

        lookAt(x = 0, y = 0) {
            setPupilTarget(x, y);
        },

        reset() {
            thinking = false;
            container.classList.remove("is-thinking", "is-peeking", "is-blinking");
            setPupilTarget(0, 0);
        },

        destroy() {
            window.clearTimeout(blinkTimer);

            if (gazeFrame) {
                window.cancelAnimationFrame(gazeFrame);
            }

            window.removeEventListener("pointermove", handlePointerMove);
            container.innerHTML = "";
            container.classList.remove("woki-stage");
        }
    };
}
