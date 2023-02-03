"use strict";

import { loadAsset } from "./phaser-util.js";
import { Tooth } from "./tfclasses.js";

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

let _gameState = {
    teeth: []
}

function preload() {
    loadAsset(this, "croc-mouth");
    loadAsset(this, "croc-face-neutral-transparent");

    loadAsset(this, "tooth");
}

function create() {
    this.add.image(150, 300, "croc-mouth");
    this.add.image(150, 300, "croc-face-neutral-transparent");

    _gameState.teeth.push(new Tooth(this, 30, 300));
    _gameState.teeth.push(new Tooth(this, 30, 400));
    _gameState.teeth.push(new Tooth(this, 30, 500));
}

function update(t, dt) {
    for (let tooth of _gameState.teeth) {
        //tooth.bounceBack();
    }
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