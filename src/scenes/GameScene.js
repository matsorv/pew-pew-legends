// src/scenes/GameScene.js
import Phaser from 'phaser';
import { GameState } from '../state/GameState.js';
import { ArenaGenerator } from '../state/ArenaGenerator.js';
import { Obstacle } from '../entities/Obstacle.js';

const ARENA_WIDTH = 2400;
const ARENA_HEIGHT = 600;
const GROUND_Y = 500;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.bestOf = data.bestOf || 3;
  }

  create() {
    this.gameState = new GameState(this.bestOf);

    // Sky background
    this.cameras.main.setBackgroundColor('#0f0f23');

    // Ground
    this.groundGroup = this.physics.add.staticGroup();
    for (let x = 0; x < ARENA_WIDTH; x += 64) {
      const tile = this.groundGroup.create(x + 32, GROUND_Y + 32, 'ground');
      tile.setDisplaySize(64, 64);
      tile.refreshBody();
    }

    // Obstacles
    this.obstacleGroup = this.physics.add.staticGroup();
    const obstacleConfigs = ArenaGenerator.generate(ARENA_WIDTH);
    this.obstacles = obstacleConfigs.map(config => {
      const obs = new Obstacle(this, config);
      this.obstacleGroup.add(obs);
      return obs;
    });

    // World bounds
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Camera
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Placeholder text (will be replaced when players are added)
    this.add.text(ARENA_WIDTH / 2, 300, 'Arena loaded — players next', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
