import { DiceValue } from '../../api/types';

export const RoundStatisticsResults = ({
  dice1,
  dice2,
  dataTestid,
}: RoundStatisticsResultsProps): JSX.Element => {
  return (
    <div className="d-flex flex-row" data-testid={dataTestid}>
      <div className="btn btn-primary me-1">{dice1}</div>
      <div className="btn btn-danger">{dice2}</div>
    </div>
  );
};

type RoundStatisticsResultsProps = {
  dice1: DiceValue;
  dice2: DiceValue;
  dataTestid?: string;
};
