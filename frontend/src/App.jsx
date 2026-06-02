import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import BoardsPage from './pages/BoardsPage';
import { connectSocket, disconnectSocket } from './utils/socket';

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <BoardsPage onLogout={logout} />;
}
