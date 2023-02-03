"use strict";

let config = {
    type: Phaser.AUTO,
    scale: {
        parent: "game",
        fullscreenTarget: "game",
        mode: Phaser.Scale.FIT,
        width: 400,
        height: 800
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

}

function create() {

}

function update(t, dt) {

}