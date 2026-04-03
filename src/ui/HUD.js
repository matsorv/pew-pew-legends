// src/ui/HUD.js
import { WEAPONS } from '../config/weapons.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;

    // P1 HUD (top left)
    this.p1Name = scene.add.text(15, 10, 'PLAYER 1', {
      fontSize: '14px',
      fill: '#4fc3f7',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(100);

    this.p1HealthBg = scene.add.rectangle(15, 32, 120, 10, 0x333333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.p1HealthFill = scene.add.rectangle(15, 32, 120, 10, 0x4caf50)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    this.p1Weapon = scene.add.text(15, 48, '', {
      fontSize: '11px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    // P2 HUD (top right)
    this.p2Name = scene.add.text(785, 10, 'PLAYER 2', {
      fontSize: '14px',
      fill: '#ef5350',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.p2HealthBg = scene.add.rectangle(665, 32, 120, 10, 0x333333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.p2HealthFill = scene.add.rectangle(665, 32, 120, 10, 0xf44336)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    this.p2Weapon = scene.add.text(785, 48, '', {
      fontSize: '11px',
      fill: '#ff9800',
      fontFamily: 'monospace',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Round info (top center)
    this.roundText = scene.add.text(400, 10, '', {
      fontSize: '14px',
      fill: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
  }

  update(gameState) {
    const p1 = gameState.player1;
    const p2 = gameState.player2;

    // Health bars
    this.p1HealthFill.setDisplaySize(120 * (p1.hp / 100), 10);
    this.p2HealthFill.setDisplaySize(120 * (p2.hp / 100), 10);

    // Health bar colors
    const p1Ratio = p1.hp / 100;
    const p2Ratio = p2.hp / 100;
    this.p1HealthFill.setFillStyle(p1Ratio > 0.5 ? 0x4caf50 : p1Ratio > 0.25 ? 0xff9800 : 0xf44336);
    this.p2HealthFill.setFillStyle(p2Ratio > 0.5 ? 0x4caf50 : p2Ratio > 0.25 ? 0xff9800 : 0xf44336);

    // Weapon names
    this.p1Weapon.setText(WEAPONS[p1.currentWeapon].name);
    this.p2Weapon.setText(WEAPONS[p2.currentWeapon].name);

    // Round info
    this.roundText.setText(
      `Round ${gameState.currentRound}  |  ${gameState.scores[0]} - ${gameState.scores[1]}`
    );
  }
}
