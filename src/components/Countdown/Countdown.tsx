import { observer } from 'mobx-react-lite';
import './Countdown.css';

export const Countdown = observer(
  ({ time, dataTestid }: RoundResultsProps): JSX.Element => {
    return (
      <div data-testid={dataTestid} className={'w-50 text-center countdown'}>
        <span className="fs-3"></span>{' '}
        <span className="fs-4">{time > 0 ? time : ''}</span>
      </div>
    );
  },
);

type RoundResultsProps = {
  time: number;
  dataTestid?: string;
};
