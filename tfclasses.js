"use strict";

import { distance } from "./phaser-util.js";

export class Tooth {
    constructor(scene, startX, startY, image="tooth") {
        this._scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.isDragged = false;

        this._sprite = scene.add.follower(null, startX, startY, image).setInteractive();

        scene.input.setDraggable(this._sprite);

        let self = this;

        scene.input.on('dragstart', function (pointer, gameObject) {
            self.isDragged = true;
        });

        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        scene.input.on('dragend', function (pointer, gameObject) {
            self.isDragged = false;
            //self.bounceBack();
        });
    }

    bounceBack() {
        let d = distance(this.startX, this.startY, this._sprite.x, this._sprite.y);
        console.log("Distance: " + d);
        if (d <= 25.0) {
            this._sprite.setPath(new Phaser.Curves.Path(this._sprite.x, this._sprite.y).lineTo(this.startX, this.startY));
            this._sprite.startFollow({
                positionOnPath: true,
                duration: 1000,
                repeat: 0,
                rotateToPath: false,
                onComplete: () => { this._sprite.setInteractive() },
                onUpdate: () => { }
            });
        }
    }
}
