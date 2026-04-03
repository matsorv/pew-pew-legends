import { PlayerState } from './PlayerState.js';

export class GameState {
  constructor(bestOf) {
    this.bestOf = bestOf;
    this.roundsToWin = Math.ceil(bestOf / 2);
    this.scores = [0, 0];
    this.currentRound = 1;
    this.arenaWidth = 2400;
    this.player1 = new PlayerState(1, 200, 400);
    this.player2 = new PlayerState(2, this.arenaWidth - 200, 400);
  }

  winRound(playerIndex) {
    this.scores[playerIndex]++;
    this.currentRound++;
  }

  getMatchWinner() {
    if (this.scores[0] >= this.roundsToWin) return 0;
    if (this.scores[1] >= this.roundsToWin) return 1;
    return null;
  }

  resetRound(arenaWidth) {
    this.arenaWidth = arenaWidth || this.arenaWidth;
    this.player1.reset(200, 400);
    this.player2.reset(this.arenaWidth - 200, 400);
  }

  fullReset(bestOf) {
    this.bestOf = bestOf;
    this.roundsToWin = Math.ceil(bestOf / 2);
    this.scores = [0, 0];
    this.currentRound = 1;
    this.player1.reset(200, 400);
    this.player2.reset(this.arenaWidth - 200, 400);
  }
}
