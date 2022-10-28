export type CurrentRoundData = {
  data?: CurrentRound;
};
export type CurrentRound = {
  id: GameRoundId;
  gameType: GameType;
  startedAt?: string;
  closedAt?: string;
};
export type PrefixedId<T extends string> = `${T}_${string}`;
export type GameRoundId = PrefixedId<'rnd'>;

export enum GameType {
  Dices = 'game_dices',
}

export type GameRoundData = {
  data?: Array<GameRound>;
  limit: string;
  offset: string;
  total: string;
};

export type GameRound = {
  id: string;
  gameType: GameType;
  startedAt: string;
  closedAt?: string;
  finishedAt?: string;
  cancelledAt?: string;
  result?: {
    value: DicesResult;
    type: string;
  };
};

export type RoundData = {
  data: GameRound;
};

export type DiceValue = '1' | '2' | '3' | '4' | '5' | '6';
export type DicesResult = `${DiceValue}_${DiceValue}`;
export type PaginationParams = {
  limit: number;
  offset: number;
};

export enum ServerEventType {
  HISTORY = 'event_history',
  RECEIVED = 'event_received',
}

export type BasicServerEvent = {
  readonly id: number;
  readonly retry: number;
  readonly type: ServerEventType;
  readonly data: string;
};

export interface IEventEmitter {
  addEventListener(
    event: string | symbol,
    fn: (data: BasicServerEvent) => void,
  ): void;
  close(): void;
}

export type GameHistoryEvent = {
  readonly time: string;
  readonly timeframe: number;
  readonly events: GameRoundEvent[];
};

export type RoundStartedEvent = GameEvent<RoundStartedPayload>;
export type RoundClosedEvent = GameEvent<RoundClosedPayload>;
export type RoundFinishedEvent = GameEvent<RoundFinishedPayload>;
export type RoundCancelledEvent = GameEvent<RoundCancelledPayload>;
export type RoundResultUpdatedEvent = GameEvent<RoundResultUpdatedPayload>;
export type GameRoundEvent =
  | RoundStartedEvent
  | RoundClosedEvent
  | RoundFinishedEvent
  | RoundCancelledEvent
  | RoundResultUpdatedEvent;

export type GameEvent<TPayload> = {
  readonly id: EventId;
  readonly type: RoundEventType;
  readonly createdAt: string;
  readonly version: number;
  readonly payload: TPayload;
};

export interface BasicPayload {
  readonly gameType: GameType;
  readonly roundId: GameRoundId;
}

export interface RoundStartedPayload extends BasicPayload {
  readonly startedAt: string;
}

export interface RoundClosedPayload extends BasicPayload {
  readonly closedAt: string;
}

export interface RoundFinishedPayload extends BasicPayload {
  readonly finishedAt: string;
  readonly result: DiceGameResultPayload;
}

export interface RoundCancelledPayload extends BasicPayload {
  readonly cancelledAt: string;
}

export interface RoundResultUpdatedPayload extends BasicPayload {
  readonly updatedAt: string;
  readonly oldResult: DiceGameResultPayload;
  readonly newResult: DiceGameResultPayload;
}

export type EventId = PrefixedId<'evt'>;
export type DiceRollResult = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceGameResultPayload = `${DiceRollResult}_${DiceRollResult}`;
export type DiceGameResult = {
  type: GameType.Dices;
  payload: DiceGameResultPayload;
};
export enum RoundEventType {
  STARTED = 'round_started',
  CLOSED = 'round_closed',
  FINISHED = 'round_finished',
  CANCELLED = 'round_cancelled',
  RESULT_UPDATED = 'round_result_updated',
}
