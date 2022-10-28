import React from 'react';

export const RoundResults = ({
  dice1,
  dice2,
  className,
  dataTestid,
}: RoundResultsProps): JSX.Element => {
  return (
    <div className={className} data-testid={dataTestid}>
      <p className="fs-3">
        {' '}
        <span style={{ color: '#0d6efd' }}>{dice1}</span> <span> / </span>{' '}
        <span style={{ color: '#dc3545' }}>{dice2}</span>
      </p>
    </div>
  );
};

type RoundResultsProps = {
  dice1: string;
  dice2: string;
  className?: string;
  dataTestid?: string;
};
