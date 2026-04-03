// src/scenes/BootScene.js
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.generatePlayerSprite('player1', 0x4fc3f7, 0x0288d1);
    this.generatePlayerSprite('player2', 0xef5350, 0xc62828);
    this.generateBullet();
    this.generateObstacles();
    this.scene.start('Menu');
  }

  generatePlayerSprite(key, fillColor, outlineColor) {
    const g = this.add.graphics();

    // Head (16x16 at top center)
    g.fillStyle(fillColor);
    g.fillRect(8, 0, 16, 16);
    g.lineStyle(2, outlineColor);
    g.strokeRect(8, 0, 16, 16);

    // Body (20x16 below head)
    g.fillRect(6, 16, 20, 16);
    g.strokeRect(6, 16, 20, 16);

    // Left leg
    g.fillRect(8, 32, 8, 14);
    g.strokeRect(8, 32, 8, 14);

    // Right leg
    g.fillRect(18, 32, 8, 14);
    g.strokeRect(18, 32, 8, 14);

    g.generateTexture(key, 32, 48);
    g.destroy();
  }

  generateBullet() {
    const g = this.add.graphics();
    g.fillStyle(0xffeb3b);
    g.fillRect(0, 0, 8, 4);
    g.generateTexture('bullet', 8, 4);
    g.destroy();
  }

  generateObstacles() {
    // Crate
    const crate = this.add.graphics();
    crate.fillStyle(0x795548);
    crate.fillRect(0, 0, 48, 40);
    crate.lineStyle(2, 0x5d4037);
    crate.strokeRect(0, 0, 48, 40);
    crate.lineBetween(0, 0, 48, 40);
    crate.lineBetween(48, 0, 0, 40);
    crate.generateTexture('crate', 48, 40);
    crate.destroy();

    // Wall
    const wall = this.add.graphics();
    wall.fillStyle(0x546e7a);
    wall.fillRect(0, 0, 24, 80);
    wall.lineStyle(2, 0x37474f);
    wall.strokeRect(0, 0, 24, 80);
    wall.lineBetween(0, 26, 24, 26);
    wall.lineBetween(0, 53, 24, 53);
    wall.generateTexture('wall', 24, 80);
    wall.destroy();

    // Platform
    const plat = this.add.graphics();
    plat.fillStyle(0x78909c);
    plat.fillRect(0, 0, 96, 16);
    plat.lineStyle(2, 0x546e7a);
    plat.strokeRect(0, 0, 96, 16);
    plat.generateTexture('platform', 96, 16);
    plat.destroy();

    // Ground tile
    const ground = this.add.graphics();
    ground.fillStyle(0x2e7d32);
    ground.fillRect(0, 0, 64, 64);
    ground.lineStyle(1, 0x1b5e20);
    ground.lineBetween(0, 0, 64, 0);
    ground.generateTexture('ground', 64, 64);
    ground.destroy();
  }
}
