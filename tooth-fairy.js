"use strict";

import { loadAsset } from "./phaser-util.js";
import { Tooth } from "./tfclasses.js";

const DEBUG = false;
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
    loadAsset(this, "croc-face-blank");
    loadAsset(this, "croc-eyes-happy");
    loadAsset(this, "croc-eyes-neutral");
    loadAsset(this, "croc-eyes-skeptical");
    loadAsset(this, "croc-eyes-very-angry");

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
    loadAsset(this, "blush-transparent");
    loadAsset(this, "angry-veins");
    loadAsset(this, "smoke");
    loadAsset(this, "fire");
    loadAsset(this, "fairy");

    loadAsset(this, "play-button");

    this.load.audio("background-music", [
        "a/Glitter Blast.mp3"
    ]);
}

let _gameState = {
    playButton: null,
    paused: true,
    teeth: [],
    crocHead: null,
    happyEyes: null,
    neutralEyes: null,
    skepticalEyes: null,
    angryEyes: null,
    blush: null,
    gameOver: false,
    mood: 0,
    pulledTeethCount: 0,
    pulledFoulCount: 0,
    totalFoulTeeth: 0,
    timeWithoutAction: 0,
    teethCount: TOTAL_TEETH,
    smokeEmitters: {
        left: null,
        right: null,
    },
}

let gyroMagnitude = 0.0;
function create() {
    this.add.image(150, 300, "croc-mouth");
    _gameState.crocHead = this.add.image(150, 300, "croc-face-blank");

    _gameState.happyEyes = this.add.image(150, 41, "croc-eyes-happy").setVisible(false);
    _gameState.neutralEyes = this.add.image(150, 48, "croc-eyes-neutral").setVisible(false);
    _gameState.skepticalEyes = this.add.image(150, 38, "croc-eyes-skeptical").setVisible(false);
    _gameState.angryEyes = this.add.image(150, 64, "croc-eyes-very-angry").setVisible(false);
    _gameState.blush = this.add.image(150, 103, "blush-transparent").setVisible(false);

    let emitterConfig = {
      frequency: 0.1,
      speedY: -10,
      //alpha: 1,
      scale: {start: 0.7, end: 1.5},
      accelerationY: -50,
      //angle: {min: -85, max: -95},
      rotate: {min: -50, max: 50},
      lifespan: {min: 1000, max: 1500},
      on: false,
    };
    let particles = this.add.particles("smoke");
    _gameState.smokeEmitters.left = particles.createEmitter({...emitterConfig, x: 115, y: 87});
    _gameState.smokeEmitters.right = particles.createEmitter({...emitterConfig, x: 195, y: 87});

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

    // add play button last, i.e. on top of everything
    _gameState.playButton = this.add.sprite(150, 300, "play-button")
        .on('pointerup', function() {
            // move outside of the view volume to "disable" it
            _gameState.playButton.x = 1000;
            _gameState.paused = false;
            if (!bgm.isPlaying) {
                bgm.play();
            }
        })
        .setInteractive();

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
        gameObject._self.autoMove();
    });

    if (gyro.hasFeature('devicemotion')) {
        gyro.frequency = 50; // ms
        gyro.startTracking(_onGyro);
    }
}

function _onGyro(o) {
    let magnitude = Math.sqrt(o.x * o.x + o.y * o.y + o.z * o.z);
    gyroMagnitude = Math.max(magnitude, gyroMagnitude);
    if (gyroMagnitude >= 20.0) {
        _gameState.mood += 1;
        gyroMagnitude = 0.0;
    }
}

function update(t, dt) {
    if (_gameState.paused) {
        return;
    }

    _gameState.timeWithoutAction += dt;
    // 8s without action reduce mood
    if (_gameState.timeWithoutAction >= 8000.0) {
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

    // Cap positive mood at 2
    if (_gameState.mood > 2) {
        _gameState.mood = 2;
    }
}

function updateCrocFace(scene) {
    if (_gameState.pulledFoulCount == _gameState.totalFoulTeeth) {
        gameOver(scene, true);
    } else if (_gameState.mood < -3) {
        gameOver(scene);
    } else {
        _gameState.crocHead.setTexture("croc-face-blank");
    }

    let veryHappy = _gameState.mood >= 2;
    _gameState.blush.setVisible(veryHappy);

    let happy = _gameState.mood >= 1;
    _gameState.happyEyes.setVisible(happy);

    let neutral = _gameState.mood == 0;
    _gameState.neutralEyes.setVisible(neutral);

    let skeptical = _gameState.mood == -1;
    _gameState.skepticalEyes.setVisible(skeptical);

    let angry = _gameState.mood <= -2 && _gameState.mood >= -3;
    _gameState.angryEyes.setVisible(angry);

    let veryAngry = _gameState.mood == -3;
    if (veryAngry) {
        _gameState.smokeEmitters.left.start();
        _gameState.smokeEmitters.right.start();
    } else {
        _gameState.smokeEmitters.left.stop();
        _gameState.smokeEmitters.right.stop();
    }
}

function gameOver(scene, win=false) {
    if (_gameState.gameOver) {
        return;
    }

    _gameState.gameOver = true;

    let animDuration = 600;

    let maw = scene.add.follower(null, 150, 0, "croc-snapping-blank-transparent");
    if (!win) {
        let veinsX = 100
        let veins = scene.add.follower(null, veinsX, -100, "angry-veins");
        veins.setPath(new Phaser.Curves.Path(veins.x, veins.y).lineTo(veinsX, 60));
        veins.startFollow({
            positionOnPath: true,
            duration: animDuration,
            repeat: 0,
            rotateToPath: false,
            onComplete: () => { },
            onUpdate: () => { }
        });
    }
    let eyes = scene.add.follower(null, 150, 0, win ? "croc-snapping-eyes-transparent" : "croc-eyes-very-angry-transparent");
    maw.setPath(new Phaser.Curves.Path(maw.x, maw.y).lineTo(150, 360));
    maw.startFollow({
        positionOnPath: true,
        duration: animDuration,
        repeat: 0,
        rotateToPath: false,
        onComplete: () => { if (win) fairy(scene); else burn(scene); },
        onUpdate: () => { }
    });
    eyes.setPath(new Phaser.Curves.Path(eyes.x, eyes.y).lineTo(150, 175));
    eyes.startFollow({
        positionOnPath: true,
        duration: animDuration,
        repeat: 0,
        rotateToPath: false,
        onComplete: () => { },
        onUpdate: () => { }
    });
}

function burn(scene) {
    let particles = scene.add.particles("fire");
    particles.createEmitter({
      x: 150, y: 800,
      speedY: -400,
      frequency: 10,
      accelerationY: -100,
      //blendMode: "ADD",
      scale: 10,
      lifespan: 10000,
      rotate: { min: -100, max: 100},
    });
}

function fairy(scene) {
    let toothfairy = scene.add.follower(null, 150, 700, "fairy");
    toothfairy.setPath(new Phaser.Curves.Path(150, 700).lineTo(100, 400).lineTo(200, 200).lineTo(150, 80));
    toothfairy.startFollow({
        positionOnPath: true,
        duration: 1500,
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
