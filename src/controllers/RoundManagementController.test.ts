import { RoundManagementController } from './RoundManagementController';
import { RoundManagementState } from '../states/RoundManagementState';
import { RoundState } from '../common/types';
import { locales } from '../common/locales';

describe('RoundManagementController', () => {
  let rMC: RoundManagementController;

  beforeEach(() => {
    rMC = new RoundManagementController(new RoundManagementState());
  });

  /*
    2.1. Старт раунда
      Сразу же после объявления начала раунда запускается 10-и секундный таймер.
      2.1.1. Значение таймера не может быть отрицательным, при достижении нуля таймер должен останавливаться.
      2.1.2. Значение таймера при старте == захардкоженный START_TIME.
      2.1.3. Значение таймера уменьшается тиками на одну секунду, следовательно после каждого тика значение таймера падает ровно на одну секунду.
  */
  test('Timer works correctly', () => {
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
    expect(rMC.roundState.timeForBetting).toBe(0);
    expect(rMC.isTimeEnded()).toBe(true);
  });

  /*
    2.1. Старт раунда
      2.1.4. После начала раунда его статус == SETTING_BETS
      2.1.5. После окончания таймера статус раунда == WAITING_FOR_RESULTS
    2.2. Завершение раунда
      2.2.1. После получения значений, статус раунда == WAITING FOR RESULTS
    2.3. Отмена раунда
      2.3.2. После отмены раунда, статус раунда == WAITING FOR RESULTS
  */
  test('State transitions work correctly', async () => {
    expect(rMC.roundState.stateOfRound).toBe(RoundState.GETTING_CURRENT_ROUND);
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

  /*
  2.3. Отмена раунда
    2.3.1. Если после отмены получены результаты, должно выводиться корректное сообщение об ошибке.
  */
  test('Canceled round can not be finished', async () => {
    await rMC.startRound();
    await rMC.cancelRound();
    await rMC.finishRound('2', '4');
    expect(rMC.roundState.errorMessage).toBe(locales.errorFinish);
  });
});
