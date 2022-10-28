import { GameRound } from '../../api/types';
import { locales } from '../../common/locales';
import { Round } from '../Round/Round';
import './RoundList.css';

export const RoundList = ({
  rounds,
  onCancelRoundPressed,
  onChangeResultsPressed,
  dataTestid,
}: RoundListProps): JSX.Element => {
  const fillEmptyRows = (rows: Array<JSX.Element>) => {
    const style = { height: '55px' };
    for (let i = 0; i < 5 - rounds.length; i++) {
      rows.push(
        <tr className="w-100" style={style} key={'empty-row ' + i}>
          <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>
        </tr>,
      );
    }
    return rows;
  };

  const getRoundsTable = (): Array<JSX.Element> => {
    const roundRows = rounds.map(round => {
      return (
        <Round
          key={round.id}
          round={round}
          onCancelRoundPressed={onCancelRoundPressed}
          onChangeResultsPressed={onChangeResultsPressed}
          data-testid={'round-info ' + round.id}
        />
      );
    });
    return fillEmptyRows(roundRows);
  };

  return (
    <table className="table table-striped" data-testid={dataTestid}>
      <thead>
        <tr>
          <th scope="col" className="col-2">
            {locales.statisticsHeaderStarted}
          </th>
          <th scope="col" className="col-2">
            {locales.statisticsHeaderClosed}
          </th>
          <th scope="col" className="col-2">
            {locales.statisticsHeaderFinished}
          </th>
          <th scope="col" className="col-2">
            {locales.statisticsHeaderStatus}
          </th>
          <th scope="col" className="col-2">
            {locales.statisticsHeaderResults}
          </th>
        </tr>
      </thead>
      <tbody>{getRoundsTable()}</tbody>
    </table>
  );
};

type RoundListProps = {
  rounds: Array<GameRound>;
  onCancelRoundPressed: (id: string) => void;
  onChangeResultsPressed: (id: string) => void;
  dataTestid?: string;
};
