# Pew Pew Legends — Game Design Specification

## Overview

2D local multiplayer arena shooter played in the browser. Two players share a keyboard and fight to eliminate each other across multiple rounds. Pixelated art style.

## Technology

- **Engine:** Phaser.js 3 with Arcade Physics
- **Architecture:** Game logic separated into a `GameState` class decoupled from rendering, enabling future network multiplayer support
- **Platform:** Browser (PC first, touch/mobile/iPad later with network play)

## Scenes

1. **BootScene** — Load all assets (sprites, sounds)
2. **MenuScene** — Title screen, "Start Game" button, best-of selector (3 or 5)
3. **GameScene** — The arena combat
4. **RoundEndScene** — Round winner display, score status, 3-second countdown to next round
5. **GameOverScene** — Match winner display, scoreboard, "Play Again" button

## Controls

### Player 1 (Blue)

| Key | Action |
|-----|--------|
| A / D | Move left / right |
| W / S | Aim up / down (free angle rotation) |
| Left Shift | Jump |
| Left Ctrl | Shoot |
| Q / E | Switch weapon (previous / next) |

### Player 2 (Red)

| Key | Action |
|-----|--------|
| ← / → | Move left / right |
| ↑ / ↓ | Aim up / down (free angle rotation) |
| Right Shift | Jump |
| Right Ctrl | Shoot |
| , / . | Switch weapon (previous / next) |

## Characters

- Pixelated sprites (32x32 px)
- Animations: idle, walk, jump
- Small health bar rendered above the character's head
- Visible weapon on the character's arm
- Aim line showing current aim direction
- Hitbox split: upper 25% = head, lower 75% = body (for sniper headshot detection)

## Weapons

All three weapons available at all times. Players cycle through them with weapon-switch keys.

| Weapon | Fire Rate | Damage | Hits to Kill | Special |
|--------|-----------|--------|-------------|---------|
| Handgun | Medium | 10% | 10 | Standard, reliable |
| Assault Rifle | Fast | 10% | 10 | Automatic fire (hold shoot) |
| Sniper Rifle | Slow | 33% body, 100% head | 3 body / 1 head | Visible laser sight, slight delay before firing |

- Bullets are visible projectiles with weapon-specific speed
- No ammo limit — balanced by fire rate
- Projectiles destroyed on impact with players, obstacles, or world bounds

## Arena

- **Size:** ~3x screen width
- **Camera:** Follows the midpoint between both players, zooms out as they move apart
- **Ground:** Flat terrain spanning the full arena width
- **Visual style:** Dark sky background, green terrain, pixelated obstacles matching character art style

### Obstacles

Generated randomly at the start of each round:

| Type | Size | Destructible | HP | Notes |
|------|------|-------------|-----|-------|
| Crate | Small | Yes | 50 HP | Can be jumped over |
| Wall | Tall | Yes | 150 HP | Blocks bullets, provides cover |
| Platform | Floating | No | — | Can be jumped onto, adds verticality |

Obstacle placement is randomized but balanced — neither player's spawn area should be significantly more sheltered than the other.

## Round System

- **Format:** Best-of-3 (default) or best-of-5, selected in menu
- **Round end:** When a player's HP reaches 0:
  - Brief pause, "Player X wins the round!" overlay
  - Score status displayed (e.g., "1 - 0")
  - New round starts after 3 seconds
- **New round:** Fresh random arena, both players at full health, spawned on opposite sides
- **Match end:** When a player wins enough rounds:
  - "Player X wins!" with celebration animation
  - Final scoreboard
  - "Play Again" button returns to MenuScene

## Future Considerations (Not in Scope for v1)

- **Network multiplayer:** GameState separation enables server-authoritative gameplay for mobile/iPad play over network
- **Touch controls:** Virtual joysticks (left = movement, right = aim) + buttons (jump, shoot, weapon switch)
- **Additional weapons and maps**
