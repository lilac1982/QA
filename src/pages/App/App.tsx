import RoundManagement from '../RoundManagement/RoundManagement';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import Login from '../Login/Login';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

export const App = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogIn = (login: string, password: string) => {
    if (login === 'admin' && password === 'admin') {
      setErrorMessage('');
      setLoggedIn(true);
      localStorage.setItem('token', 'token');
      navigate('/round');
    } else {
      setErrorMessage('Неверные логин или пароль');
    }
  };

  const handleLogOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      navigate('/');
    }
  }, []);

  return (
    <div data-testid="parent-container" className="container">
      {loggedIn ? <NavBar handleLogOut={handleLogOut} /> : ''}
      <Routes>
        <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/round" element={<RoundManagement />} />
        </Route>
        <Route
          path="/login"
          element={
            <Login errorMessage={errorMessage} handleLogIn={handleLogIn} />
          }
        />
        <Route
          path="*"
          element={<Navigate to={loggedIn ? '/round' : '/login'} />}
        />
      </Routes>
    </div>
  );
};
