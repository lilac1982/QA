import { BetInputPanel } from '../../components/BetInputPanel/BetInputPanel';
import { Countdown } from '../../components/Countdown/Countdown';
import { RoundResults } from '../../components/RoundResults/RoundResults';
import { useEffect, useState } from 'react';
import { roundManagementController } from '../../controllers/RoundManagementController';
import { observer } from 'mobx-react-lite';
import { locales } from '../../common/locales';
import { RoundState } from '../../common/types';
import { RoundModal } from '../../components/RoundModal/RoundModal';
import { DiceValue } from '../../api/types';
import { bets } from '../../common/config';
import RoundManagementHeader from '../../components/RoundManagementHeader/RoundManagementHeader';
import RoundManagementError from '../../components/RoundManagementError/RoundManagementError';

const RoundManagement = observer((): JSX.Element => {
  const [dice1, setDice1] = useState(locales.betsNotChosen);
  const [dice2, setDice2] = useState(locales.betsNotChosen);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { roundState } = roundManagementController;
  const { stateOfRound, timeForBetting, errorMessage } = roundState;

  useEffect(() => {
    roundManagementController.getInitialRoundState();
  }, []);

  const areResultsSet = () =>
    dice1 !== locales.betsNotChosen && dice2 !== locales.betsNotChosen;

  const startRound = () => {
    roundManagementController.startRound();
    reset();
  };

  const finishRound = () => {
    roundManagementController.finishRound(
      dice1 as DiceValue,
      dice2 as DiceValue,
    );
    reset();
  };

  const cancelRound = () => {
    roundManagementController.cancelRound();
    reset();
  };

  const reset = () => {
    setDice1(locales.betsNotChosen);
    setDice2(locales.betsNotChosen);
    setShowCancelModal(false);
    roundManagementController.resetErrors();
  };

  const handleCancelRoundPressed = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancelModal = () => {
    setShowCancelModal(false);
    cancelRound();
  };

  const hideCancelModal = () => {
    setShowCancelModal(false);
  };

  const getNextButton = () => {
    const buttons: Record<
      RoundState,
      {
        callback: () => void;
        disabled: boolean;
        text: string;
        colorClassName: string;
      }
    > = {
      [RoundState.GETTING_CURRENT_ROUND]: {
        callback: () => undefined,
        disabled: false,
        text: '',
        colorClassName: '',
      },
      [RoundState.WAITING_NEW_ROUND]: {
        callback: () => startRound(),
        disabled: false,
        text: locales.roundManagementStartButton,
        colorClassName: 'btn-primary',
      },
      [RoundState.SETTING_BETS]: {
        callback: () => undefined,
        disabled: true,
        text: locales.roundManagementFinishButton,
        colorClassName: 'btn-success',
      },
      [RoundState.WAITING_FOR_RESULTS]: {
        callback: () => finishRound(),
        disabled: !areResultsSet(),
        text: locales.roundManagementFinishButton,
        colorClassName: 'btn-success',
      },
    };

    if (buttons[stateOfRound].text !== '') {
      return (
        <button
          data-testid="next-button"
          className={'btn w-50 ' + buttons[stateOfRound].colorClassName}
          onClick={buttons[stateOfRound].callback}
          disabled={buttons[stateOfRound].disabled}
        >
          {buttons[stateOfRound].text}
        </button>
      );
    }
  };

  return (
    <div className="w-75">
      <RoundManagementHeader stateOfRound={stateOfRound} />
      <RoundManagementError errorMessage={errorMessage} />
      <Countdown data-testid="countdown" time={timeForBetting} />
      <RoundResults
        data-testid="round-results"
        dice1={dice1}
        dice2={dice2}
        className="w-50 d-flex justify-content-center"
      />
      <div className="mb-3 w-50 d-flex flex-column  align-items-center">
        <BetInputPanel
          data-testid="bet-input-panel-red"
          bets={bets}
          disabled={stateOfRound !== RoundState.WAITING_FOR_RESULTS}
          onBetChoice={setDice1}
          btnStyle={{ color: '#0057FF', textColor: '#FFFFFF' }}
          className="mb-1"
        />
        <BetInputPanel
          data-testid="bet-input-panel-blue"
          bets={bets}
          disabled={stateOfRound !== RoundState.WAITING_FOR_RESULTS}
          onBetChoice={setDice2}
          btnStyle={{ color: '#FF0000', textColor: '#FFFFFF' }}
        />
      </div>
      <div className="d-flex justify-content-between w-50 flex-row">
        {getNextButton()}
        <button
          data-testid="cancel-button"
          disabled={stateOfRound === RoundState.WAITING_NEW_ROUND}
          className="btn btn-danger w-50 ms-2"
          onClick={handleCancelRoundPressed}
        >
          {locales.roundManagementCancelButton}
        </button>
      </div>
      {showCancelModal && (
        <RoundModal
          data-testid="cancel-round-modal"
          handleCancel={hideCancelModal}
          handleConfirm={handleConfirmCancelModal}
        />
      )}
    </div>
  );
});

export default RoundManagement;
