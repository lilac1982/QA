export enum RoundState {
  GETTING_CURRENT_ROUND,
  WAITING_NEW_ROUND,
  SETTING_BETS,
  WAITING_FOR_RESULTS,
}

export type PaginationClick = {
  index: number | null;
  selected: number;
  nextSelectedPage: number;
  event: object;
  isPrevious: boolean;
  isNext: boolean;
  isBreak: boolean;
  isActive: boolean;
};
