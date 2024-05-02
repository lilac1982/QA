import { RoundManagementController } from './RoundManagementController';
import { RoundManagementState } from '../states/RoundManagementState';
import { RoundState } from '../common/types';
import { locales } from '../common/locales';

describe('RoundManagementController', () => {
  let rMC: RoundManagementController;

  beforeEach(() => {
    rMC = new RoundManagementController(new RoundManagementState());
  });

  describe('Timer works correctly', () => {
    it('Should decrease timeForBetting 1 per tick and should not decrease timeForBetting if its value is 0', () => {
      rMC.startTimer();
      expect(rMC.roundState.timeForBetting).toBe(
        RoundManagementController.START_TIME,
      );

      for (let tick = 10; tick > 0; tick--) {
        expect(rMC.roundState.timeForBetting).toBe(tick);
        expect(rMC.isTimeEnded()).toBe(false);
        rMC.tick();
      }

      rMC.tick();
      rMC.tick();
      expect(rMC.roundState.timeForBetting).toBe(0);
      expect(rMC.isTimeEnded()).toBe(true);
    });
  });

  describe('IsTimeEnded func works correctly', () => {
    it('Should return false when time for betting is 10', () => {
      rMC.startTimer();
      expect(rMC.isTimeEnded()).toBe(false);
    });

    it('Should return true when time for betting is 0', () => {
      rMC.startTimer();

      for (let tick = 10; tick > 0; tick--) {
        expect(rMC.roundState.timeForBetting).toBe(tick);
        expect(rMC.isTimeEnded()).toBe(false);
        rMC.tick();
      }
      expect(rMC.isTimeEnded()).toBe(true);
    });
  });

  describe('State transitions work correctly', () => {
    it('State transitions work correctly', async () => {
      expect(rMC.roundState.stateOfRound).toBe(
        RoundState.GETTING_CURRENT_ROUND,
      );
      await rMC.startRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.SETTING_BETS);

      await rMC.closeRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_FOR_RESULTS);

      await rMC.finishRound('1', '6');
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_NEW_ROUND);

      // just in case
      expect(rMC.roundState.errorMessage).toBe('');

      await rMC.startRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.SETTING_BETS);

      await rMC.cancelRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_NEW_ROUND);

      // just in case
      expect(rMC.roundState.errorMessage).toBe('');
    });
  });

  describe('StartRound', () => {
    it('Should start the round, update its state and start the timer', async () => {
      await rMC.startRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.SETTING_BETS);
      expect(rMC.roundState.timeForBetting).toBeGreaterThan(0);
    });
  });

  describe('CloseRound', () => {
    it('Should close the round and reset the timer', async () => {
      await rMC.startRound();
      await rMC.closeRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_FOR_RESULTS);
      expect(rMC.roundState.timeForBetting).toBe(-1);
    });
  });

  describe('FinishRound', () => {
    it('Should finish the round and reset the tiner', async () => {
      await rMC.startRound();
      await rMC.closeRound();
      await rMC.finishRound('2', '4');
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_NEW_ROUND);
      expect(rMC.roundState.timeForBetting).toBe(-1);
    });

    it('Canceled round can not be finished', async () => {
      await rMC.startRound();
      await rMC.cancelRound();
      await rMC.finishRound('2', '4');
      expect(rMC.roundState.errorMessage).toBe(locales.errorFinish);
    });
  });

  describe('CancelRound', () => {
    it('Should cancel the round and reset timer', async () => {
      await rMC.startRound();
      await rMC.cancelRound();
      expect(rMC.roundState.stateOfRound).toBe(RoundState.WAITING_NEW_ROUND);
      expect(rMC.roundState.timeForBetting).toBe(-1);
    });
  });
});
