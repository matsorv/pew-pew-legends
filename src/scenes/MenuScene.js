// src/scenes/MenuScene.js
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const centerX = 400;

    // Title
    this.add.text(centerX, 150, 'PEW PEW LEGENDS', {
      fontSize: '48px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, 210, '2 Player Arena Shooter', {
      fontSize: '18px',
      fill: '#aaaaaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Best-of selector
    this.bestOf = 3;

    this.add.text(centerX, 320, 'ROUNDS', {
      fontSize: '16px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.bestOfText = this.add.text(centerX, 360, 'Best of 3', {
      fontSize: '28px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 400, '← →  to change', {
      fontSize: '14px',
      fill: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Start prompt
    this.add.text(centerX, 490, 'Press ENTER to start', {
      fontSize: '22px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(centerX, 550, 'P1: WASD + Shift/Ctrl + Q/E  |  P2: Arrows + Shift/Ctrl + ,/.', {
      fontSize: '11px',
      fill: '#555555',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Input
    this.input.keyboard.on('keydown-LEFT', () => {
      this.bestOf = 3;
      this.bestOfText.setText('Best of 3');
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.bestOf = 5;
      this.bestOfText.setText('Best of 5');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game', { bestOf: this.bestOf });
    });
  }
}
