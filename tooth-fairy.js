"use strict";

import { loadAsset } from "./phaser-util.js";

let config = {
    type: Phaser.AUTO,
    scale: {
        parent: "game",
        fullscreenTarget: "game",
        mode: Phaser.Scale.FIT,
        width: 300,
        height: 600
    },
    render: {
        pixelArt: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    loadAsset(this, "tooth");
}

class Tooth {
    constructor(scene, startX, startY) {
        this._scene = scene;
        this.startX = startX;
        this.startY = startY;

        let tooth = scene.add.sprite(startX, startY, "tooth").setInteractive();

        scene.input.setDraggable(tooth);

        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }
}

function create() {
    let tooth1 = new Tooth(this, 30, 300)
    let tooth2 = new Tooth(this, 30, 400)
    let tooth3 = new Tooth(this, 30, 500)
}

function update(t, dt) {

}

function onDown() {
    // Fullscreen
    game.paused = false;
    if (!game.scale.isFullScreen) {
        game.scale.startFullScreen(false);
        return;
    }
}

function goFullscreen() {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen(false);
    }
}

window.toothFairyFullscreen = goFullscreen;