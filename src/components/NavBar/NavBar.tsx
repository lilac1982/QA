import { Link } from 'react-router-dom';
import { locales } from '../../common/locales';
import './NavBar.css';

export const NavBar: (props: NavBarProps) => JSX.Element = ({
  handleLogOut,
}) => {
  return (
    <nav
      className="navbar navbar-dark bg-primary justify-content-start"
      data-testid="navigation-bar"
    >
      <Link className={'mx-3 link'} to="/round">
        {locales.navbarRoundManagement}
      </Link>
      <button className={'ms-auto me-2 btn btn-danger'} onClick={handleLogOut}>
        {locales.navbarLogout}
      </button>
    </nav>
  );
};

type NavBarProps = {
  handleLogOut: () => void;
};
