import { BetInput, BetInputStyle } from '../BetInput/BetInput';

export const BetInputPanel = ({
  bets,
  disabled = false,
  onBetChoice,
  btnStyle,
  className,
  dataTestid,
}: BetInputPanelProps): JSX.Element => {
  return (
    <div data-testid={dataTestid}>
      <div className={'d-flex flex-row justify-content-around ' + className}>
        {bets.map(bet => (
          <BetInput
            className={'me-1 ' + className}
            disabled={disabled}
            value={bet}
            key={bet + 'key'}
            onClick={() => onBetChoice(bet)}
            style={btnStyle}
            data-testid={'bet-input' + bet}
          />
        ))}
      </div>
    </div>
  );
};

type BetInputPanelProps = {
  bets: string[];
  disabled?: boolean;
  btnStyle: BetInputStyle;
  onBetChoice: (value: string) => void;
  className?: string;
  dataTestid?: string;
};
