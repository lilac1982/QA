import { createRoot } from 'react-dom/client';
import { App } from './pages/App/App';
import './index.css';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>,
  );
}
