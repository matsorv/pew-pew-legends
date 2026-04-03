// src/scenes/MenuScene.js
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.text(400, 250, 'PEW PEW LEGENDS', {
      fontSize: '48px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Press ENTER to start', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game');
    });
  }
}
