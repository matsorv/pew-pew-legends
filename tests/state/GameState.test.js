import { describe, it, expect } from 'vitest';
import { GameState } from '../../src/state/GameState.js';

describe('GameState', () => {
  it('initializes with two players and score 0-0', () => {
    const state = new GameState(3);
    expect(state.scores).toEqual([0, 0]);
    expect(state.roundsToWin).toBe(2);
    expect(state.currentRound).toBe(1);
    expect(state.player1).toBeDefined();
    expect(state.player2).toBeDefined();
  });

  it('best-of-5 requires 3 wins', () => {
    const state = new GameState(5);
    expect(state.roundsToWin).toBe(3);
  });

  it('registers a round win', () => {
    const state = new GameState(3);
    state.winRound(0);
    expect(state.scores).toEqual([1, 0]);
    expect(state.currentRound).toBe(2);
  });

  it('detects match winner', () => {
    const state = new GameState(3);
    expect(state.getMatchWinner()).toBe(null);
    state.winRound(0);
    expect(state.getMatchWinner()).toBe(null);
    state.winRound(0);
    expect(state.getMatchWinner()).toBe(0);
  });

  it('resets round state without resetting scores', () => {
    const state = new GameState(3);
    state.player1.takeDamage(50, false);
    state.winRound(0);
    state.resetRound(2400);
    expect(state.player1.hp).toBe(100);
    expect(state.player2.hp).toBe(100);
    expect(state.scores).toEqual([1, 0]);
  });

  it('full reset clears everything', () => {
    const state = new GameState(3);
    state.winRound(1);
    state.winRound(1);
    state.fullReset(3);
    expect(state.scores).toEqual([0, 0]);
    expect(state.currentRound).toBe(1);
  });
});
