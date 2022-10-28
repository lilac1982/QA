import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: (props: IProtectedProps) => JSX.Element = ({
  ...props
}) => {
  const { loggedIn } = props;
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

interface IProtectedProps {
  loggedIn: boolean;
}
