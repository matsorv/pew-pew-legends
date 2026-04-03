// src/scenes/GameScene.js
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.text(400, 300, 'Game Scene - TODO', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
