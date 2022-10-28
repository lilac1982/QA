import { action, makeAutoObservable } from 'mobx';
import { RoundState } from '../common/types';

export class RoundManagementState {
  stateOfRound = RoundState.GETTING_CURRENT_ROUND;
  timeForBetting = -1;
  errorMessage = '';

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setTimeForBetting(time: number) {
    this.timeForBetting = time;
  }

  @action
  setRoundState(state: RoundState) {
    this.stateOfRound = state;
  }

  @action
  setErrorMessage(error: string) {
    this.errorMessage = error;
  }
}
