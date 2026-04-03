// src/scenes/GameOverScene.js
import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.winner = data.winner;
    this.scores = data.scores;
    this.bestOf = data.bestOf;
  }

  create() {
    const centerX = 640;
    const winnerColor = this.winner === 1 ? '#4fc3f7' : '#ef5350';

    this.add.text(centerX, 180, `Player ${this.winner} wins!`, {
      fontSize: '48px',
      fill: winnerColor,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(centerX, 260, `${this.scores[0]}  -  ${this.scores[1]}`, {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 340, `Best of ${this.bestOf}`, {
      fontSize: '18px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 440, 'Press ENTER to play again', {
      fontSize: '22px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(centerX, 490, 'Press ESC for menu', {
      fontSize: '16px',
      fill: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Game', { bestOf: this.bestOf });
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('Menu');
    });
  }
}
