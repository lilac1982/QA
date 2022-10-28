import { fakeApi } from './../api/FakeApi';
import { DiceValue } from '../api/types';
import { locales } from '../common/locales';
import { RoundState } from '../common/types';
import { RoundManagementState } from '../states/RoundManagementState';

export class RoundManagementController {
  timer?: NodeJS.Timer;
  public static readonly START_TIME = 10;

  constructor(
    readonly roundState: RoundManagementState = new RoundManagementState(),
  ) {}

  startTimer() {
    this.roundState.setTimeForBetting(RoundManagementController.START_TIME);
    this.timer = setInterval(() => {
      this.tick();
      if (this.isTimeEnded() && this.timer) {
        clearInterval(this.timer);
        this.roundState.setTimeForBetting(-1);
        this.closeRound();
      }
    }, 1000);
  }

  tick() {
    if (!this.isTimeEnded()) {
      this.roundState.setTimeForBetting(this.roundState.timeForBetting - 1);
    }
  }

  isTimeEnded() {
    return this.roundState.timeForBetting <= 0;
  }

  resetErrors() {
    this.roundState.setErrorMessage('');
  }

  async getInitialRoundState() {
    try {
      const state = await this.getCurrentRoundState();
      this.roundState.setRoundState(state);
      if (state === RoundState.SETTING_BETS && this.isTimeEnded()) {
        this.startTimer();
      }
    } catch {
      this.roundState.setErrorMessage(locales.errorInit);
    }
  }

  async startRound() {
    try {
      await fakeApi.startRound();
      this.roundState.setRoundState(RoundState.SETTING_BETS);
      this.startTimer();
    } catch {
      this.roundState.setErrorMessage(locales.errorStart);
    }
  }

  async closeRound() {
    try {
      await fakeApi.closeRound();
      this.roundState.setRoundState(RoundState.WAITING_FOR_RESULTS);
      this.resetTimer();
    } catch {
      this.roundState.setErrorMessage(locales.errorClose);
    }
  }

  async finishRound(dice1: DiceValue, dice2: DiceValue) {
    try {
      await fakeApi.finishRound(dice1, dice2);
      this.roundState.setRoundState(RoundState.WAITING_NEW_ROUND);
      this.resetTimer();
    } catch {
      this.roundState.setErrorMessage(locales.errorFinish);
    }
  }

  async cancelRound() {
    try {
      await fakeApi.cancelRound();
      this.roundState.setRoundState(RoundState.WAITING_NEW_ROUND);
      this.resetTimer();
    } catch {
      this.roundState.setErrorMessage(locales.errorCancel);
    }
  }

  private async getCurrentRoundState(): Promise<RoundState> {
    const round = await fakeApi.getCurrentRound();
    if (round?.data?.closedAt) {
      return RoundState.WAITING_FOR_RESULTS;
    } else if (round?.data?.startedAt) {
      return RoundState.SETTING_BETS;
    }
    return RoundState.WAITING_NEW_ROUND;
  }

  private resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.roundState.setTimeForBetting(-1);
  }
}

export const roundManagementController = new RoundManagementController();
