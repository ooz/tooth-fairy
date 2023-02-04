"use strict";

import { distance, random } from "./phaser-util.js";

export class TFEvent {
    constructor() { }
    getType() {}
    execute() {}
}
export class ToothPlanted extends TFEvent {
    constructor(gameState) {
        super();
        this.gameState = gameState;
    }
    getType() { return "ToothPlanted" }
}
export class ToothGone extends TFEvent {
    getType() { return "ToothGone" }
}
export class ToothNicePulled extends TFEvent {
    getType() { return "ToothNicePulled" }
}
export class ToothFoulPulled extends TFEvent {
    getType() { return "ToothFoulPulled" }
}

export class Tooth {
    constructor(scene, startX, startY, image="tooth") {
        this._scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.image = image;
        this.isDragged = false;

        this._sprite = scene.add.follower(null, startX, startY, image).setInteractive();
        scene.input.setDraggable(this._sprite);
        this._sprite._self = this;

        this._isFoul = !!random(0, 1);
    }

    autoMove(gameState) {
        let d = distance(this.startX, this.startY, this._sprite.x, this._sprite.y);
        if (d <= 30.0) {
            this._sprite.setPath(new Phaser.Curves.Path(this._sprite.x, this._sprite.y).lineTo(this.startX, this.startY));
            this._sprite.startFollow({
                positionOnPath: true,
                duration: 800,
                repeat: 0,
                rotateToPath: false,
                onComplete: () => {
                    // Recreate sprite because it stops being draggable after path following
                    this._scene.input.setDraggable(this._sprite, false);
                    this._sprite.destroy();
                    this._sprite = this._scene.add.follower(null, this.startX, this.startY, this.image).setInteractive();
                    this._scene.input.setDraggable(this._sprite);
                    this._sprite._self = this;
                    gameState.eventQueue.push(new ToothPlanted());
                },
                onUpdate: () => { }
            });
        } else {
            if (this._sprite.y <= 230) {
                this._sprite.setPath(new Phaser.Curves.Path(this._sprite.x, this._sprite.y).lineTo(150, -100));
                this._sprite.startFollow({
                    positionOnPath: true,
                    duration: 1000,
                    repeat: 0,
                    rotateToPath: false,
                    onComplete: () => { },
                    onUpdate: () => { }
                });
                gameState.eventQueue.push(new ToothGone());
            }
        }
    }

    isPulled() {
        let d = distance(this.startX, this.startY, this._sprite.x, this._sprite.y);
        if (d > 30.0 || this._sprite.y < 0) {
            return true;
        }
        return false;
    }

    isFoul() {
        return this._isFoul;
    }
}
