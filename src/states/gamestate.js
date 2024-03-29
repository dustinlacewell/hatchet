import choice from '../utils';
import TilemapPool from '../pool';
import Camera from '../camera';

class GameState extends Phaser.State {

    preload() {
        this.settings = this.game.settings;
        this.camera = new Camera(this.game, this.game.map);
        this.camera.lookAt(0, 0);
        this.press_countdown = 0;
        this.press_delay = 7;
    }

    on_left() {
        this.camera.lookAt(this.camera.position.x - 1, this.camera.position.y);
    }

    on_right() {
        this.camera.lookAt(this.camera.position.x + 1, this.camera.position.y);
    }

    on_up() {
        this.camera.lookAt(this.camera.position.x, this.camera.position.y - 1);
    }

    on_down() {
        this.camera.lookAt(this.camera.position.x, this.camera.position.y +1);
    }

    update() {
        let game = this.game;
        let isDown = (kc) => {
            let bDown = game.input.keyboard.isDown(kc);
            return bDown;
        }

        if (this.press_countdown > 0) {
            this.press_countdown -= 1;
        } else if (isDown(Phaser.Keyboard.LEFT)) {
            this.camera.lookAt(this.camera.position.x - 1, this.camera.position.y);
            this.press_countdown = this.press_delay;
        } else if (isDown(Phaser.Keyboard.RIGHT)) {
            this.camera.lookAt(this.camera.position.x + 1, this.camera.position.y);
            this.press_countdown = this.press_delay;
        } else if (isDown(Phaser.Keyboard.DOWN)) {
            this.camera.lookAt(this.camera.position.x, this.camera.position.y + 1);
            this.press_countdown = this.press_delay;
        } else if (isDown(Phaser.Keyboard.UP)) {
            this.camera.lookAt(this.camera.position.x, this.camera.position.y - 1);
            this.press_countdown = this.press_delay;
        } else {
            this.press_countdown = 0;
        }
    }

}

export default GameState;
