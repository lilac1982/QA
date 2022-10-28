import { locales } from '../../common/locales';
import { RoundState } from '../../common/types';

const RoundManagementHeader = (props: RoundManagementHeaderProps) => {
  const texts: Record<RoundState, string> = {
    [RoundState.GETTING_CURRENT_ROUND]: '',
    [RoundState.WAITING_NEW_ROUND]: locales.roundManagementStart,
    [RoundState.SETTING_BETS]: locales.roundManagementSettingBets,
    [RoundState.WAITING_FOR_RESULTS]: locales.roundManagementSettingResults,
  };

  return (
    <h3 data-testid="round-management-header" className="w-50 text-center">
      {texts[props.stateOfRound]}
    </h3>
  );
};

type RoundManagementHeaderProps = {
  stateOfRound: RoundState;
};

export default RoundManagementHeader;
