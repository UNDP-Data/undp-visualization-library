import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const rootDiv = document.getElementById('root');
if (rootDiv) {
  ReactDOM.createRoot(rootDiv as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
