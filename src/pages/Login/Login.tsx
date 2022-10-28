import { useFormWithValidation } from '../../utils/validator';

const Login: (props: LoginProps) => JSX.Element = ({
  handleLogIn,
  errorMessage,
}) => {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation<{
      login: string;
      password: string;
    }>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { login, password } = values;
    handleLogIn(login, password);
    resetForm();
  };

  return (
    <section className="d-flex justify-content-center align-items-center">
      <form className="w-25 mt-5" onSubmit={handleSubmit}>
        <p className="text-danger">{errorMessage}</p>
        <div className="input-group mb-3">
          <span className="input-group-text w-25" id="basic-addon1">
            Логин
          </span>
          <input
            type="login"
            className="form-control"
            aria-describedby="basic-addon1"
            placeholder="Логин"
            name="login"
            id="field-login"
            required
            minLength={2}
            maxLength={30}
            value={values.login || ''}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger" id="field-login-error">
          {errors.login}
        </p>
        <div className="input-group mb-3">
          <span className="input-group-text w-25" id="basic-addon2">
            Пароль
          </span>
          <input
            type="password"
            className="form-control"
            aria-describedby="basic-addon2"
            placeholder="Пароль"
            name="password"
            id="field-password"
            required
            minLength={2}
            maxLength={30}
            value={values.password || ''}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger" id="field-password-error">
          {errors.password}
        </p>
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Войти
        </button>
      </form>
    </section>
  );
};

export default Login;

type LoginProps = {
  handleLogIn: (login: string, password: string) => void;
  errorMessage: string;
};
