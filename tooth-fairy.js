"use strict";

import { loadAsset } from "./phaser-util.js";
import { Tooth } from "./tfclasses.js";

const DEBUG = true;
const WIDTH = 300;
const HEIGHT = 600;
const TOTAL_TEETH = 11;

let config = {
    type: Phaser.AUTO,
    scale: {
        parent: "game",
        fullscreenTarget: "game",
        mode: Phaser.Scale.FIT,
        width: WIDTH,
        height: HEIGHT
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
    loadAsset(this, "croc-face-happy-transparent");
    loadAsset(this, "croc-face-neutral-transparent");
    loadAsset(this, "croc-face-skeptical-transparent");
    loadAsset(this, "croc-face-very-angry-transparent");

    loadAsset(this, "tooth-01-transparent");
    loadAsset(this, "tooth-02-transparent");
    loadAsset(this, "tooth-03-transparent");
    loadAsset(this, "tooth-04-transparent");
    loadAsset(this, "tooth-05-transparent");
    loadAsset(this, "tooth-06-transparent");
    loadAsset(this, "tooth-07-transparent");
    loadAsset(this, "tooth-08-transparent");
    loadAsset(this, "tooth-09-transparent");
    loadAsset(this, "tooth-10-transparent");
    loadAsset(this, "tooth-11-transparent");

    loadAsset(this, "croc-snapping-eyes-transparent"); // WIN
    loadAsset(this, "croc-eyes-very-angry-transparent"); // LOSE
    loadAsset(this, "croc-snapping-blank-transparent");

    this.load.audio("background-music", [
        "a/Glitter Blast.mp3"
    ]);
}

let _gameState = {
    teeth: [],
    crocHead: null,
    gameOver: false,
    mood: 0,
    pulledTeethCount: 0,
    pulledFoulCount: 0,
    totalFoulTeeth: 0,
    timeWithoutAction: 0,
    teethCount: TOTAL_TEETH,
    eventQueue: [],
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
    _gameState.teeth.push(new Tooth(this, 280, 580, "tooth-07-transparent"));

    _gameState.teeth.push(new Tooth(this, 290, 260, "tooth-08-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 350, "tooth-09-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 430, "tooth-10-transparent"));
    _gameState.teeth.push(new Tooth(this, 290, 500, "tooth-11-transparent"));

    let bgm = this.sound.add('background-music', { loop: true });

    for (let tooth of _gameState.teeth) {
        if (tooth.isFoul()) {
            _gameState.totalFoulTeeth += 1;
        }
    }
    if (DEBUG) { console.log("Foul teeth: " + _gameState.totalFoulTeeth) }

    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject._self.isDragged = true;
        _gameState.timeWithoutAction = 0;
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
        _gameState.timeWithoutAction = 0;
    });

    this.input.on('dragend', function (pointer, gameObject) {
        gameObject._self.isDragged = false;
        gameObject._self.autoMove(_gameState);
    });

    bgm.play();
}

function update(t, dt) {
    _gameState.timeWithoutAction += dt;
    if (_gameState.timeWithoutAction >= 10000.0) {
        _gameState.mood -= 1;
        _gameState.timeWithoutAction = 0;
    }

    updatePulledTeethAndMood();

    updateCrocFace(this);
}

function updatePulledTeethAndMood() {
    let pulledTeethCount = 0;
    let foulTeethPulled = 0;
    for (let tooth of _gameState.teeth) {
        if (tooth.isPulled()) {
            pulledTeethCount += 1;
            if (tooth.isFoul()) {
                foulTeethPulled += 1;
            }
        }
    }

    if (_gameState.pulledTeethCount != pulledTeethCount) {
        if (_gameState.pulledTeethCount < pulledTeethCount) {
            if (foulTeethPulled > _gameState.pulledFoulCount) {
                _gameState.mood += 1;
            } else {
                _gameState.mood -= 1;
            }
        }

        _gameState.pulledTeethCount = pulledTeethCount;
        _gameState.pulledFoulCount = foulTeethPulled;
        if (DEBUG) { console.log("Pulled: " + _gameState.pulledTeethCount + ", foul pulled: " + _gameState.pulledFoulCount + "/" + _gameState.totalFoulTeeth + ", mood: " + _gameState.mood) }
    }

}

function updateCrocFace(scene) {
    if (_gameState.pulledFoulCount == _gameState.totalFoulTeeth) {
        gameOver(scene, true);
    } else if (_gameState.mood < -3) {
        gameOver(scene);
    } else if (_gameState.mood == -2) {
        _gameState.crocHead.setTexture("croc-face-very-angry-transparent");
    } else if (_gameState.mood == -1) {
        _gameState.crocHead.setTexture("croc-face-skeptical-transparent");
    } else if (_gameState.mood >= 1) {
        _gameState.crocHead.setTexture("croc-face-happy-transparent");
    } else if (_gameState.mood == 0) {
        _gameState.crocHead.setTexture("croc-face-neutral-transparent");
    }
}

function gameOver(scene, win=false) {
    if (_gameState.gameOver) {
        return;
    }

    _gameState.gameOver = true;

    console.log("Game over!");

    let maw = scene.add.follower(null, 150, 0, "croc-snapping-blank-transparent");
    let eyes = scene.add.follower(null, 150, 0, win ? "croc-snapping-eyes-transparent" : "croc-eyes-very-angry-transparent");
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

// Fullscreen
game.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
    game.scale.scaleMode = Phaser.Scale.NONE;
    game.scale.resize(WIDTH, HEIGHT);
    game.scale.setZoom(1);
});

game.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
    game.scale.scaleMode = Phaser.Scale.FIT;
    game.scale.setGameSize(WIDTH, HEIGHT);
});

function goFullscreen() {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen(false);
    }
}

window.toothFairyFullscreen = goFullscreen;
