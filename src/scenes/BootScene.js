// src/scenes/BootScene.js
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Assets loaded in Task 3
  }

  create() {
    this.scene.start('Menu');
  }
}
