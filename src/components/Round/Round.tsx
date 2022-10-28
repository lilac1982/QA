import { DicesResult, DiceValue, GameRound } from '../../api/types';
import { locales } from '../../common/locales';
import { RoundStatisticsResults } from '../RoundStatisticsResults/RoundStatisticsResults';
import './Round.css';

export const Round = ({
  round,
  onCancelRoundPressed,
  dataTestid,
  onChangeResultsPressed,
}: RoundProps): JSX.Element => {
  const getStatus = (round: GameRound): string => {
    if (round.result) {
      return locales.roundStatusFinished;
    }
    if (round.cancelledAt) {
      return locales.roundStatusCanceled;
    }
    if (round.closedAt) {
      return locales.roundStatusClosed;
    }
    if (round.startedAt) {
      return locales.roundStatusStarted;
    }
    return locales.roundStatusCanceled;
  };

  const getParsedDate = (date?: string): string => {
    if (!date) {
      return '';
    }
    const parsedDate = Date.parse(date);
    const roundDate = new Date(parsedDate);
    return roundDate.toLocaleTimeString();
  };

  const getResults = (dices?: DicesResult): JSX.Element => {
    if (dices) {
      const dice1 = dices.split('_')[0];
      const dice2 = dices.split('_')[1];
      return (
        <div
          className={'d-inline-block roundResultsButton'}
          onClick={() => {
            onChangeResultsPressed(round.id);
          }}
        >
          <RoundStatisticsResults
            dice1={dice1 as DiceValue}
            dice2={dice2 as DiceValue}
          />
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <tr data-testid={dataTestid}>
      <td className="align-middle">{getParsedDate(round.startedAt)}</td>
      <td className="align-middle">{getParsedDate(round.closedAt)}</td>
      <td className="align-middle">{getParsedDate(round.finishedAt)}</td>
      <td className="align-middle">{getStatus(round)}</td>
      <td className="align-middle">{getResults(round.result?.value)}</td>
      <td className="align-middle">
        <div
          className="btn btn-danger"
          onClick={() => {
            onCancelRoundPressed(round.id);
          }}
        >
          {locales.statisticsDelete}
        </div>
      </td>
    </tr>
  );
};

type RoundProps = {
  round: GameRound;
  onCancelRoundPressed: (id: string) => void;
  onChangeResultsPressed: (id: string) => void;
  dataTestid?: string;
};
