import { RoundManagementController } from './RoundManagementController';
import { RoundManagementState } from '../states/RoundManagementState';
import { fakeApi } from '../api/FakeApi';
import { locales } from '../common/locales';
import { RoundState } from '../common/types';
import { DiceValue, GameType } from '../api/types';

jest.mock('../states/RoundManagementState');
jest.mock('../api/FakeApi');
describe('Round Management Controller', () => {
  let roundState: RoundManagementState;
  let controller: RoundManagementController;

  beforeEach(() => {
    roundState = new RoundManagementState();
    controller = new RoundManagementController(roundState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Start Timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.clearAllTimers();
    });
    it('Should start timer and call tick, clearInterval, and closeRound when time is ended', () => {
      jest.spyOn(controller, 'tick');
      jest.spyOn(global, 'setInterval');
      jest.spyOn(global, 'clearInterval');
      controller.closeRound = jest.fn();

      controller.startTimer();

      expect(roundState.setTimeForBetting).toBeCalledWith(
        RoundManagementController.START_TIME,
      );
      expect(controller.timer).toBeDefined();
      expect(global.setInterval).toHaveBeenCalledTimes(1);
      expect(global.setInterval).toHaveBeenLastCalledWith(
        expect.any(Function),
        1000,
      );

      jest.advanceTimersByTime(1000);
      expect(controller.tick).toHaveBeenCalledTimes(1);
      controller.isTimeEnded = jest.fn().mockReturnValue(true);

      jest.advanceTimersByTime(1000);
      expect(clearInterval).toHaveBeenCalledTimes(1);
      expect(roundState.setTimeForBetting).toHaveBeenCalledWith(-1);
      expect(controller.closeRound).toHaveBeenCalled();
    });
  });

  describe('Tick', () => {
    it('Decreases time for betting by 1 if time has not ended', () => {
      controller.isTimeEnded = jest.fn().mockReturnValue(false);
      controller.tick();
      expect(roundState.setTimeForBetting).toHaveBeenCalled();
    });
    it('Does not decrease time for betting if time has ended', () => {
      controller.isTimeEnded = jest.fn().mockReturnValue(true);
      controller.tick();
      expect(roundState.setTimeForBetting).not.toHaveBeenCalled();
    });
  });

  describe('IsTimeEnded', () => {
    it('Should return true when time for betting is 0', () => {
      roundState.timeForBetting = 0;
      expect(controller.isTimeEnded()).toBe(true);
    });
    it('Should return false when time for betting is 10', () => {
      roundState.timeForBetting = 10;
      expect(controller.isTimeEnded()).toBe(false);
    });
    it('Should return true when time for betting is -1 or some negative num', () => {
      roundState.timeForBetting = -1;
      expect(controller.isTimeEnded()).toBe(true);
    });
  });

  describe('ResetErrors', () => {
    it('Should put an empty string in the round state in the errorMessage field', () => {
      controller.resetErrors();
      expect(roundState.setErrorMessage).toHaveBeenCalledWith('');
    });
  });

  describe('GetInitialRoundState', () => {
    describe('Execution scenarios for getInitialRoundState', () => {
      beforeEach(() => {
        jest.spyOn(fakeApi, 'getCurrentRound');
        jest.spyOn(controller, 'startTimer');
        controller.isTimeEnded = jest.fn().mockReturnValue(true);
      });
      it('Should start the timer after receiving a state that matches round state and the betting time has expired', async () => {
        fakeApi.getCurrentRound = jest.fn().mockResolvedValue({
          data: {
            id: 'rnd_test',
            gameType: GameType.Dices,
            startedAt: 'test',
          },
        });

        await controller.getInitialRoundState();
        expect(fakeApi.getCurrentRound).toHaveBeenCalled(); // проверка, что запрос на fakeApi из приватного метода произошел
        expect(roundState.setRoundState).toHaveBeenCalled();
        expect(controller.startTimer).toHaveBeenCalled();
      });
      it('Should not start a timer after receiving a state that does not match round state or the betting time has not yet expired', async () => {
        fakeApi.getCurrentRound = jest.fn().mockResolvedValue({
          data: {
            id: 'rnd_test',
            gameType: GameType.Dices,
            closedAt: 'test',
          },
        });

        await controller.getInitialRoundState();
        expect(fakeApi.getCurrentRound).toHaveBeenCalled(); // проверка, что запрос на fakeApi из приватного метода произошел
        expect(roundState.setRoundState).toHaveBeenCalled();
        expect(controller.startTimer).not.toHaveBeenCalled();
      });
    });
    it('Should throw an error and put the value Ошибка при инициализации', async () => {
      fakeApi.getCurrentRound = jest
        .fn()
        .mockRejectedValue(new Error('Test error'));

      await controller.getInitialRoundState();
      expect(roundState.setErrorMessage).toHaveBeenCalledWith(
        locales.errorInit,
      );
    });
  });
  describe('StartRound', () => {
    it('Should start the round, update its state and start the timer', async () => {
      jest.spyOn(controller, 'startTimer');
      fakeApi.startRound = jest.fn().mockResolvedValue({});

      await controller.startRound();
      expect(roundState.setRoundState).toBeCalledWith(RoundState.SETTING_BETS);
      expect(controller.startTimer).toHaveBeenCalled();
    });
    it('Should throw an error and put the value Ошибка при старте раунда', async () => {
      fakeApi.startRound = jest.fn().mockRejectedValue('any');

      await controller.startRound();
      expect(roundState.setErrorMessage).toBeCalledWith(locales.errorStart);
    });
  });
  describe('CloseRound', () => {
    describe('Execution scenarios for getInitialRoundState', () => {
      beforeEach(() => {
        jest.spyOn(global, 'clearInterval');
        fakeApi.closeRound = jest.fn().mockResolvedValue({});
      });
      it('Should close the round and dont reset the timer', async () => {
        await controller.closeRound();
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_FOR_RESULTS,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).not.toHaveBeenCalled();
      });
      it('Should close the round and reset timer', async () => {
        await controller.startTimer(); // инициализируем timer
        await controller.closeRound();
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_FOR_RESULTS,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).toHaveBeenCalled();
      });
    });
    it('Should throw an error and put the value Ошибка при закрытии ставок', async () => {
      fakeApi.closeRound = jest.fn().mockRejectedValue('any');

      await controller.closeRound();
      expect(roundState.setErrorMessage).toBeCalledWith(locales.errorClose);
    });
  });
  describe('FinishRound', () => {
    const dice1: DiceValue = '3';
    const dice2: DiceValue = '4';
    describe('Execution scenarios for FinishRound', () => {
      beforeEach(() => {
        jest.spyOn(global, 'clearInterval');
        fakeApi.finishRound = jest.fn().mockResolvedValue({});
      });
      it('Should finish the round and dont reset the timer', async () => {
        await controller.finishRound(dice1, dice2);
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_NEW_ROUND,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).not.toHaveBeenCalled();
      });
      it('Should finish the round and reset timer', async () => {
        await controller.startTimer();
        await controller.finishRound(dice1, dice2);
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_NEW_ROUND,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).toHaveBeenCalled();
      });
    });
    it('Should throw an error and put the value Ошибка при закрытии раунда', async () => {
      fakeApi.finishRound = jest.fn().mockRejectedValue('any');

      await controller.finishRound(dice1, dice2);
      expect(roundState.setErrorMessage).toBeCalledWith(locales.errorFinish);
    });
  });

  describe('CancelRound', () => {
    describe('Execution scenarios for CancelRound', () => {
      beforeEach(() => {
        jest.spyOn(global, 'clearInterval');
        fakeApi.cancelRound = jest.fn().mockResolvedValue(undefined);
      });
      it('Should cancel the round and dont reset the timer', async () => {
        await controller.cancelRound();
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_NEW_ROUND,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).not.toHaveBeenCalled();
      });
      it('Should cancel the round and reset timer', async () => {
        await controller.startTimer();
        await controller.cancelRound();
        expect(roundState.setRoundState).toBeCalledWith(
          RoundState.WAITING_NEW_ROUND,
        );
        expect(roundState.setTimeForBetting).toBeCalledWith(-1);
        expect(global.clearInterval).toHaveBeenCalled();
      });
    });
    it('Should throw an error and put the value Ошибка при отмене раунда', async () => {
      fakeApi.cancelRound = jest.fn().mockRejectedValue('any');

      await controller.cancelRound();
      expect(roundState.setErrorMessage).toBeCalledWith(locales.errorCancel);
    });
  });
});
