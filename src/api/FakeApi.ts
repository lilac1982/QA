import { BasicApi } from './BasicApi';
import { GameType, CurrentRoundData, DiceValue } from './types';

class FakeApi extends BasicApi {
  fakeServer = {
    status: FakeApiStatus.FINISHED,

    start: function () {
      this.status = FakeApiStatus.STARTED;
    },
    close: function () {
      this.status = FakeApiStatus.CLOSED;
    },
    finish: function () {
      this.status = FakeApiStatus.FINISHED;
    },
    cancel: function () {
      this.status = FakeApiStatus.FINISHED;
    },
  };

  async startRound(): Promise<CurrentRoundData> {
    if (this.fakeServer.status === FakeApiStatus.STARTED) {
      return Promise.reject('any');
    }
    this.fakeServer.start();
    return Promise.resolve({});
  }

  async cancelRound() {
    this.fakeServer.cancel();
    return Promise.resolve(undefined);
  }

  async closeRound(): Promise<CurrentRoundData> {
    if (this.fakeServer.status !== FakeApiStatus.STARTED) {
      return Promise.reject('any');
    }

    this.fakeServer.close();
    return Promise.resolve({});
  }

  async finishRound(
    dice1: DiceValue,
    dice2: DiceValue,
  ): Promise<CurrentRoundData> {
    if (this.fakeServer.status === FakeApiStatus.FINISHED) {
      return Promise.reject('any');
    }
    console.log(dice1);
    console.log(dice2);

    this.fakeServer.finish();
    return Promise.resolve({});
  }

  async getCurrentRound(): Promise<CurrentRoundData> {
    if (this.fakeServer.status === FakeApiStatus.STARTED) {
      return Promise.resolve({
        data: {
          id: 'rnd_test',
          gameType: GameType.Dices,
          startedAt: 'test',
        },
      });
    } else if (this.fakeServer.status === FakeApiStatus.CLOSED) {
      return Promise.resolve({
        data: {
          id: 'rnd_test',
          gameType: GameType.Dices,
          closedAt: 'test',
        },
      });
    } else {
      return Promise.resolve({
        data: {
          id: 'rnd_test',
          gameType: GameType.Dices,
        },
      });
    }
  }
}

enum FakeApiStatus {
  STARTED = 'started',
  CLOSED = 'closed',
  FINISHED = 'finished',
}

export const fakeApi = new FakeApi({
  url: 'just a stub url',
  headers: {
    'Content-type': 'application/json',
  },
});
