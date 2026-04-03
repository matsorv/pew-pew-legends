// src/scenes/RoundEndScene.js
import Phaser from 'phaser';

export class RoundEndScene extends Phaser.Scene {
  constructor() {
    super('RoundEnd');
  }

  init(data) {
    this.roundWinner = data.roundWinner;
    this.scores = data.scores;
    this.bestOf = data.bestOf;
    this.gameState = data.gameState;
  }

  create() {
    const centerX = 640;
    const winnerColor = this.roundWinner === 1 ? '#4fc3f7' : '#ef5350';

    this.add.text(centerX, 200, `Player ${this.roundWinner} wins the round!`, {
      fontSize: '36px',
      fill: winnerColor,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(centerX, 280, `${this.scores[0]}  -  ${this.scores[1]}`, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Countdown
    this.countdown = 3;
    this.countdownText = this.add.text(centerX, 380, `Next round in ${this.countdown}...`, {
      fontSize: '20px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        this.countdown--;
        if (this.countdown > 0) {
          this.countdownText.setText(`Next round in ${this.countdown}...`);
        } else {
          this.gameState.resetRound();
          this.scene.start('Game', { bestOf: this.bestOf, gameState: this.gameState });
        }
      },
    });
  }
}
