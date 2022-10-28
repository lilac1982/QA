const RoundManagementError = ({ errorMessage }: RoundManagementErrorProps) => (
  <h4 data-testid="error-message" className="text-danger">
    {errorMessage}
  </h4>
);

type RoundManagementErrorProps = {
  errorMessage: string;
};

export default RoundManagementError;
