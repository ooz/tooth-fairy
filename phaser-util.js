"use strict";

export function loadAsset(scene, name) {
    scene.load.image(name.toLowerCase(), `a/${name.toLowerCase()}.png`);
}

function goFullscreen() {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen();
    }
}

window.toothFairyFullscreen = goFullscreen;
