
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Services from './components/Services';
import Logistics from './components/Logistics';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificar se existe usuário salvo no localStorage (simulado)
    const savedUser = localStorage.getItem('express_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsReady(true);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('express_user', JSON.stringify(userData));
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('express_user');
    setView(AppView.DASHBOARD);
  };

  if (!isReady) return null;

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.MARKETPLACE:
        return <Marketplace />;
      case AppView.SERVICES:
        return <Services />;
      case AppView.LOGISTICS:
        return <Logistics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Navbar currentView={view} setView={setView} user={user} onLogout={handleLogout} />

      <main className="flex-grow md:ml-64 w-full overflow-x-hidden p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Floating Action Button mobile concept for quick listing */}
      {view !== AppView.MARKETPLACE && (
        <button
          className="fixed right-6 bottom-24 md:bottom-6 md:right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl z-40 transform hover:scale-110 active:scale-95 transition-all"
          onClick={() => setView(AppView.MARKETPLACE)}
          title="Novo Item"
        >
          <span className="text-3xl font-light">+</span>
        </button>
      )}
    </div>
  );
};

export default App;
