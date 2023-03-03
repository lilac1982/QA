import { RoundManagementController } from '../controllers/RoundManagementController';
import { RoundState } from '../common/types';
import { DiceValue } from '../api/types';
import { fakeApi } from '../api/FakeApi';
import { locales } from '../common/locales';

describe('RoundManagementController', () => {
  let roundManagementController: RoundManagementController;

  beforeEach(() => {
    roundManagementController = new RoundManagementController();
  });

  it('should start timer', () => {
    const setTimeForBettingSpy = CreateSpyOnSetTimeForBetting();

    roundManagementController.startTimer();

    expect(setTimeForBettingSpy).toBeCalledWith(
      RoundManagementController.START_TIME,
    );
    expect(roundManagementController.timer).toBeGreaterThan(0);
  });

  it('should tick if timer started', () => {
    const setTimeForBettingSpy = CreateSpyOnSetTimeForBetting();

    roundManagementController.startTimer();
    roundManagementController.tick();

    expect(setTimeForBettingSpy).toBeCalled();
  });

  it('should not tick if timer not started', () => {
    const setTimeForBettingSpy = CreateSpyOnSetTimeForBetting();

    roundManagementController.tick();

    expect(setTimeForBettingSpy).not.toBeCalled();
  });

  it('should return true if time for betting is 0', () => {
    roundManagementController.roundState.timeForBetting = 0;

    expect(roundManagementController.isTimeEnded()).toBe(true);
  });

  it('should return true if time for betting is -1', () => {
    roundManagementController.roundState.timeForBetting = -1;

    expect(roundManagementController.isTimeEnded()).toBe(true);
  });

  it('should return false if time for betting is 1', () => {
    roundManagementController.roundState.timeForBetting = 1;

    expect(roundManagementController.isTimeEnded()).toBe(false);
  });

  it('should reset errors', () => {
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();

    roundManagementController.resetErrors();

    expect(setErrorMessageSpy).toBeCalledWith('');
  });

  it('should set initial round state', async () => {
    const setRoundStateSpy = CreateSpyOnSetRoundState();

    await roundManagementController.getInitialRoundState();

    expect(setRoundStateSpy).toHaveBeenCalled();
  });

  it('should handle an error if something goes wrong when we try to set initial round state', async () => {
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();
    roundManagementController.roundState.setRoundState = jest.fn(() => {
      throw new Error('Something bad happened');
    });

    await roundManagementController.getInitialRoundState();

    expect(setErrorMessageSpy).toBeCalledWith(locales.errorInit);
  });

  it('should start round', async () => {
    const setRoundStateSpy = CreateSpyOnSetRoundState();
    fakeApi.startRound = jest.fn();
    roundManagementController.startTimer = jest.fn();

    await roundManagementController.startRound();

    expect(fakeApi.startRound).toHaveBeenCalled();
    expect(roundManagementController.startTimer).toHaveBeenCalled();
    expect(setRoundStateSpy).toBeCalledWith(RoundState.SETTING_BETS);
  });

  it('should handle an error if something goes wrong when we try to start round', async () => {
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();
    fakeApi.startRound = jest.fn(() => {
      throw new Error('Something bad happened');
    });

    await roundManagementController.startRound();

    expect(setErrorMessageSpy).toBeCalledWith(locales.errorStart);
  });

  it('should close round', async () => {
    const setRoundStateSpy = CreateSpyOnSetRoundState();
    fakeApi.closeRound = jest.fn();

    await roundManagementController.closeRound();

    expect(fakeApi.closeRound).toHaveBeenCalled();
    expect(setRoundStateSpy).toBeCalledWith(RoundState.WAITING_FOR_RESULTS);
  });

  it('should handle an error if something goes wrong when we try to close round', async () => {
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();
    fakeApi.closeRound = jest.fn(() => {
      throw new Error('Something bad happened');
    });

    await roundManagementController.closeRound();

    expect(setErrorMessageSpy).toBeCalledWith(locales.errorClose);
  });

  it('should finish round', async () => {
    const diceValue: DiceValue = '1';
    const setRoundStateSpy = CreateSpyOnSetRoundState();
    fakeApi.finishRound = jest.fn();

    await roundManagementController.finishRound(diceValue, diceValue);

    expect(fakeApi.finishRound).toBeCalledWith(diceValue, diceValue);
    expect(setRoundStateSpy).toBeCalledWith(RoundState.WAITING_NEW_ROUND);
  });

  it('should handle an error if something goes wrong when we try to finish round', async () => {
    const diceValue: DiceValue = '1';
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();
    fakeApi.finishRound = jest.fn(() => {
      throw new Error('Something bad happened');
    });

    await roundManagementController.finishRound(diceValue, diceValue);

    expect(setErrorMessageSpy).toBeCalledWith(locales.errorFinish);
  });

  it('should cancel round', async () => {
    const setRoundStateSpy = CreateSpyOnSetRoundState();
    fakeApi.cancelRound = jest.fn();

    await roundManagementController.cancelRound();

    expect(fakeApi.cancelRound).toBeCalled();
    expect(setRoundStateSpy).toBeCalledWith(RoundState.WAITING_NEW_ROUND);
  });

  it('should handle an error if something goes wrong when we try to cancel round', async () => {
    const setErrorMessageSpy = CreateSpyOnSetErrorMessage();
    fakeApi.cancelRound = jest.fn(() => {
      throw new Error('Something bad happened');
    });

    await roundManagementController.cancelRound();

    expect(setErrorMessageSpy).toBeCalledWith(locales.errorCancel);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function CreateSpyOnSetTimeForBetting() {
    return jest.spyOn(
      roundManagementController.roundState,
      'setTimeForBetting',
    );
  }

  function CreateSpyOnSetRoundState() {
    return jest.spyOn(roundManagementController.roundState, 'setRoundState');
  }

  function CreateSpyOnSetErrorMessage() {
    return jest.spyOn(roundManagementController.roundState, 'setErrorMessage');
  }
});
