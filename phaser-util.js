"use strict";

export function loadAsset(scene, name) {
    scene.load.image(name.toLowerCase(), `a/${name.toLowerCase()}.png`);
}

export function distance(x1, y1, x2, y2) {
    return Phaser.Math.Distance.Between(x1, y1, x2, y2);
}
