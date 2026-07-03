import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        flexDirection: 'column',
      }}
    >
      <h1>⚙️ Admin Portal</h1>
      <p style={{ color: '#666' }}>This is the admin backoffice entrypoint.</p>
    </div>
  );
};

const rootElement = document.getElementById('app');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
