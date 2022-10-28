import { locales } from '../../common/locales';
import './RoundModal.css';

export const RoundModal = ({
  handleCancel,
  handleConfirm,
  bodyText,
  titleText,
  buttonText,
  dataTestid,
}: ModalProps) => {
  return (
    <div className="modalBackground" data-testid={dataTestid}>
      <div className="modalContainer">
        <div className="titleCloseBtn"></div>
        <div className="title">
          <h3>{titleText || locales.roundManagementConfirmCancelTitle}</h3>
        </div>
        <div className="body">
          <p>{bodyText || locales.roundManagementConfirmCancelAssurance}</p>
        </div>
        <div className="footer">
          <button onClick={handleCancel} className="btn btn-primary">
            {locales.roundManagementCancel}
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            {buttonText || locales.roundManagementConfirmCancel}
          </button>
        </div>
      </div>
    </div>
  );
};

type ModalProps = {
  handleCancel: () => void;
  handleConfirm: () => void;
  bodyText?: string;
  titleText?: string;
  dataTestid?: string;
  buttonText?: string;
};
