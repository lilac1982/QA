export const BetInput = ({
  value,
  disabled,
  onClick,
  style,
  className,
  dataTestid,
}: BetInputProps): JSX.Element => {
  return (
    <div data-testid={dataTestid}>
      <button
        type="button"
        className={'btn btn-lg ' + className}
        style={{ backgroundColor: style.color, color: style.textColor }}
        onClick={() => {
          onClick(value);
        }}
        disabled={disabled}
      >
        {value}
      </button>
    </div>
  );
};

type BetInputProps = {
  value: string;
  disabled: boolean;
  style: BetInputStyle;
  onClick: (value: string) => void;
  className?: string;
  dataTestid?: string;
};

export type BetInputStyle = {
  color?: string;
  textColor?: string;
};
