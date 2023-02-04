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

function preload() {
    loadAsset(this, "croc-mouth");
    loadAsset(this, "croc-face-neutral-transparent");
    loadAsset(this, "croc-face-skeptical-transparent");
    loadAsset(this, "croc-face-very-angry-transparent");

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

    loadAsset(this, "croc-snapping-eyes-transparent");
    loadAsset(this, "croc-snapping-blank-transparent");
}

function create() {
    this.add.image(150, 300, "croc-mouth");
    _gameState.crocHead = this.add.image(150, 300, "croc-face-neutral-transparent");

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
    let pulledTeethCount = 0;
    for (let tooth of _gameState.teeth) {
        if(tooth.isPulled()) {
            pulledTeethCount += 1;
        }
    }
    _gameState.pulledTeethCount = pulledTeethCount;

    updateCrocFace(this);
}

function updateCrocFace(scene) {
    if (_gameState.pulledTeethCount >= 6) {
        gameOver(scene);
    } else if (_gameState.pulledTeethCount >= 4) {
        _gameState.crocHead.setTexture("croc-face-very-angry-transparent");
    } else if (_gameState.pulledTeethCount >= 2) {
        _gameState.crocHead.setTexture("croc-face-skeptical-transparent");
    } else {
        _gameState.crocHead.setTexture("croc-face-neutral-transparent");
    }
}

function gameOver(scene) {
    if (_gameState.gameOver) {
        return;
    }

    _gameState.gameOver = true;

    console.log("Game over!");

    let maw = scene.add.follower(null, 150, 0, "croc-snapping-blank-transparent");
    let eyes = scene.add.follower(null, 150, 0, "croc-snapping-eyes-transparent");
    maw.setPath(new Phaser.Curves.Path(maw.x, maw.y).lineTo(150, 360));
    maw.startFollow({
        positionOnPath: true,
        duration: 600,
        repeat: 0,
        rotateToPath: false,
        onComplete: () => { },
        onUpdate: () => { }
    });
    eyes.setPath(new Phaser.Curves.Path(eyes.x, eyes.y).lineTo(150, 80));
    eyes.startFollow({
        positionOnPath: true,
        duration: 600,
        repeat: 0,
        rotateToPath: false,
        onComplete: () => { },
        onUpdate: () => { }
    });
}

function goFullscreen() {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen(false);
    }
}

window.toothFairyFullscreen = goFullscreen;