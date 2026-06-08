import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      color: '#333',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1a365d' }}>💻 PC Web Portal</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568', lineHeight: '1.6', margin: '20px 0' }}>
          본 서비스는 <strong>모바일 전용</strong>으로 최적화되어 있습니다.<br />
          모바일 기기로 접속하시거나 브라우저 창 크기를 모바일 크기로 축소하여 확인해 주시기 바랍니다.
        </p>
        <div style={{ fontSize: '0.9rem', color: '#718096', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          포트 3001번의 Mobile Web 대시보드를 연동하여 개발 및 테스트를 진행할 수 있습니다.
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('app');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
