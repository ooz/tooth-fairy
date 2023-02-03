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
    loadAsset(this, "croc-face-very-angry-transparent");

    loadAsset(this, "tooth");

    loadAsset(this, "tooth-01-transparent");
    loadAsset(this, "tooth-02-transparent");
    loadAsset(this, "tooth-03-transparent");
    loadAsset(this, "tooth-04-transparent");
    loadAsset(this, "tooth-05-transparent");
    loadAsset(this, "tooth-06-transparent");
    loadAsset(this, "tooth-08-transparent");
    loadAsset(this, "tooth-09-transparent");
    loadAsset(this, "tooth-10-transparent");
    loadAsset(this, "tooth-11-transparent");
    loadAsset(this, "tooth-12-transparent");
}

function create() {
    this.add.image(150, 300, "croc-mouth");
    this.add.image(150, 300, "croc-face-neutral-transparent");

    _gameState.teeth.push(new Tooth(this, 10, 260, "tooth-01-transparent"));
    _gameState.teeth.push(new Tooth(this, 10, 360, "tooth-02-transparent"));
    _gameState.teeth.push(new Tooth(this, 10, 470, "tooth-03-transparent"));

    _gameState.teeth.push(new Tooth(this, 30, 600, "tooth-04-transparent"));
    _gameState.teeth.push(new Tooth(this, 120, 600, "tooth-05-transparent"));
    _gameState.teeth.push(new Tooth(this, 210, 600, "tooth-06-transparent"));
    _gameState.teeth.push(new Tooth(this, 280, 580, "tooth-08-transparent"));

    _gameState.teeth.push(new Tooth(this, 290, 260, "tooth-09-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 350, "tooth-10-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 430, "tooth-11-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 500, "tooth-12-transparent"));

    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject._self.isDragged = true;
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
        gameObject._self.isDragged = false;
        gameObject._self.autoMove();
    });
}

function update(t, dt) {
    for (let tooth of _gameState.teeth) {
        //tooth.bounceBack();
    }
}

function goFullscreen() {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen(false);
    }
}

window.toothFairyFullscreen = goFullscreen;