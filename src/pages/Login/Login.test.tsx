import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App/App';
import { BrowserRouter } from 'react-router-dom';

describe('Login value changes', () => {
  it('changing the login value', () => {
    render(<App />, { wrapper: BrowserRouter });
    const logInInput = screen.getByPlaceholderText<HTMLInputElement>('Логин');
    fireEvent.change(screen.getByPlaceholderText('Логин'), {
      target: { value: 'admin' },
    });
    expect(logInInput.value).toBe('admin');
  });
  it('changing the password value', () => {
    render(<App />, { wrapper: BrowserRouter });
    const passwordInput =
      screen.getByPlaceholderText<HTMLInputElement>('Пароль');
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'admin' },
    });
    expect(passwordInput.value).toBe('admin');
  });
});
