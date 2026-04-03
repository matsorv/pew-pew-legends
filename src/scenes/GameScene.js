// src/scenes/GameScene.js
import Phaser from 'phaser';
import { GameState } from '../state/GameState.js';
import { ArenaGenerator } from '../state/ArenaGenerator.js';
import { Obstacle } from '../entities/Obstacle.js';
import { Player } from '../entities/Player.js';
import { KEY_LOCATION } from '../config/controls.js';
import { Bullet } from '../entities/Bullet.js';
import { WEAPONS } from '../config/weapons.js';
import { HUD } from '../ui/HUD.js';

const ARENA_WIDTH = 2400;
const ARENA_HEIGHT = 600;
const GROUND_Y = 500;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.bestOf = data.bestOf || 3;
    this.existingGameState = data.gameState || null;
  }

  create() {
    this.gameState = this.existingGameState || new GameState(this.bestOf);
    this.existingGameState = null;

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

    // Players
    this.player1 = new Player(this, this.gameState.player1, 'player1');
    this.player2 = new Player(this, this.gameState.player2, 'player2');

    // Player-ground collisions
    this.physics.add.collider(this.player1, this.groundGroup);
    this.physics.add.collider(this.player2, this.groundGroup);
    this.physics.add.collider(this.player1, this.obstacleGroup);
    this.physics.add.collider(this.player2, this.obstacleGroup);

    // World bounds
    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Camera follows midpoint
    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Input — P1 keys
    this.p1Keys = {
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
      aimUp: this.input.keyboard.addKey('W'),
      aimDown: this.input.keyboard.addKey('S'),
      jump: null,  // handled via raw event for left shift
      shoot: null, // handled via raw event for left ctrl
      weaponPrev: this.input.keyboard.addKey('Q'),
      weaponNext: this.input.keyboard.addKey('E'),
    };

    // P2 keys
    this.p2Keys = {
      left: this.input.keyboard.addKey('LEFT'),
      right: this.input.keyboard.addKey('RIGHT'),
      aimUp: this.input.keyboard.addKey('UP'),
      aimDown: this.input.keyboard.addKey('DOWN'),
      jump: null,
      shoot: null,
      weaponPrev: this.input.keyboard.addKey('COMMA'),
      weaponNext: this.input.keyboard.addKey('PERIOD'),
    };

    // Track left/right shift and ctrl separately via raw keyboard events
    this.rawKeys = {
      leftShift: false,
      rightShift: false,
      leftCtrl: false,
      rightCtrl: false,
    };

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Shift' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftShift = true;
      if (event.key === 'Shift' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightShift = true;
      if (event.key === 'Control' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftCtrl = true;
      if (event.key === 'Control' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightCtrl = true;
    });

    this.input.keyboard.on('keyup', (event) => {
      if (event.key === 'Shift' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftShift = false;
      if (event.key === 'Shift' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightShift = false;
      if (event.key === 'Control' && event.location === KEY_LOCATION.LEFT) this.rawKeys.leftCtrl = false;
      if (event.key === 'Control' && event.location === KEY_LOCATION.RIGHT) this.rawKeys.rightCtrl = false;
    });

    // Create virtual key objects for jump/shoot
    this.p1Keys.jump = { isDown: false };
    this.p1Keys.shoot = { isDown: false };
    this.p2Keys.jump = { isDown: false };
    this.p2Keys.shoot = { isDown: false };

    // Weapon switching
    this.p1Keys.weaponPrev.on('down', () => this.gameState.player1.switchWeapon(-1));
    this.p1Keys.weaponNext.on('down', () => this.gameState.player1.switchWeapon(1));
    this.p2Keys.weaponPrev.on('down', () => this.gameState.player2.switchWeapon(-1));
    this.p2Keys.weaponNext.on('down', () => this.gameState.player2.switchWeapon(1));

    // Bullet group
    this.bullets = this.add.group();

    // Track last fire time per player
    this.lastFireTime = { 1: 0, 2: 0 };

    // Prevent browser default for game keys
    this.input.keyboard.addCapture(['W','A','S','D','Q','E','UP','DOWN','LEFT','RIGHT','SHIFT','CTRL','COMMA','PERIOD','ENTER']);

    // HUD
    this.hud = new HUD(this);
  }

  update(time, delta) {
    // Sync raw keys to virtual key objects
    this.p1Keys.jump.isDown = this.rawKeys.leftShift;
    this.p1Keys.shoot.isDown = this.rawKeys.leftCtrl;
    this.p2Keys.jump.isDown = this.rawKeys.rightShift;
    this.p2Keys.shoot.isDown = this.rawKeys.rightCtrl;

    // Player input
    this.player1.handleInput(this.p1Keys, delta);
    this.player2.handleInput(this.p2Keys, delta);

    // Update visuals
    this.player1.updateVisuals();
    this.player2.updateVisuals();

    // Shooting
    this.handleShooting(this.player1, this.p1Keys, time);
    this.handleShooting(this.player2, this.p2Keys, time);

    // Bullet vs player collisions
    this.physics.overlap(this.bullets, this.player1, (bullet, player) => {
      if (bullet.shooterId === player.playerState.id) return;
      this.hitPlayer(bullet, player);
    });
    this.physics.overlap(this.bullets, this.player2, (bullet, player) => {
      if (bullet.shooterId === player.playerState.id) return;
      this.hitPlayer(bullet, player);
    });

    // Bullet vs obstacle collisions
    this.physics.overlap(this.bullets, this.obstacleGroup, (bullet, obstacle) => {
      const damage = WEAPONS[bullet.weaponKey].damage;
      if (obstacle.takeDamage) obstacle.takeDamage(damage);
      bullet.destroy();
    });

    // Camera follows midpoint between players
    const midX = (this.player1.x + this.player2.x) / 2;
    const midY = (this.player1.y + this.player2.y) / 2;
    this.cameras.main.centerOn(midX, midY);

    // Update HUD
    this.hud.update(this.gameState);
  }

  handleShooting(playerEntity, keys, time) {
    const state = playerEntity.playerState;
    const weapon = WEAPONS[state.currentWeapon];
    const canFire = time - state.lastFireTime >= weapon.fireRate;

    if (keys.shoot.isDown && canFire) {
      state.lastFireTime = time;
      const spawnX = playerEntity.x + playerEntity.facing * 16;
      const spawnY = playerEntity.y - 8;

      if (weapon.chargeDelay > 0) {
        // Sniper has charge delay
        this.time.delayedCall(weapon.chargeDelay, () => {
          if (playerEntity.active) {
            this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
          }
        });
      } else {
        this.spawnBullet(spawnX, spawnY, state.aimAngle, playerEntity.facing, state.currentWeapon, state.id);
      }
    }
  }

  spawnBullet(x, y, angle, facing, weaponKey, shooterId) {
    const bullet = new Bullet(this, x, y, angle, facing, weaponKey, shooterId);
    this.bullets.add(bullet);
  }

  hitPlayer(bullet, playerEntity) {
    const state = playerEntity.playerState;

    // Headshot detection: upper 25% of sprite
    const headThreshold = playerEntity.y - playerEntity.height * 0.25;
    const isHeadshot = bullet.y < headThreshold;

    const damage = bullet.getDamage(isHeadshot);
    state.takeDamage(damage, isHeadshot);
    bullet.destroy();

    // Flash player on hit
    playerEntity.setTint(0xffffff);
    this.time.delayedCall(100, () => {
      if (playerEntity.active) playerEntity.clearTint();
    });

    // Check for death
    if (state.isDead()) {
      this.handlePlayerDeath(state.id);
    }
  }

  handlePlayerDeath(deadPlayerId) {
    const winnerIndex = deadPlayerId === 1 ? 1 : 0;
    this.gameState.winRound(winnerIndex);

    // Cleanup
    this.player1.cleanup();
    this.player2.cleanup();

    const matchWinner = this.gameState.getMatchWinner();
    if (matchWinner !== null) {
      this.scene.start('GameOver', {
        winner: matchWinner + 1,
        scores: [...this.gameState.scores],
        bestOf: this.bestOf,
      });
    } else {
      this.scene.start('RoundEnd', {
        roundWinner: winnerIndex + 1,
        scores: [...this.gameState.scores],
        bestOf: this.bestOf,
        gameState: this.gameState,
      });
    }
  }
}
