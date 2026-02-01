
import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, ShoppingBag, Wrench, Truck, UserCircle, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Painel', icon: <LayoutGrid size={20} /> },
    { id: AppView.MARKETPLACE, label: 'Mercado', icon: <ShoppingBag size={20} /> },
    { id: AppView.SERVICES, label: 'Serviços', icon: <Wrench size={20} /> },
    { id: AppView.LOGISTICS, label: 'Logística', icon: <Truck size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 md:left-0 md:top-0 md:bottom-auto md:h-screen md:w-72 md:border-r md:border-slate-800 z-50 shadow-2xl">
      <div className="h-full flex flex-col">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="hidden md:flex items-center space-x-3 p-8 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">e</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter leading-none">e-Xpress</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Industrial Hub</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-1 justify-around md:flex-col md:justify-start md:px-4 md:space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${currentView === item.id
                  ? 'text-white bg-blue-600 shadow-lg shadow-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <span className={`${currentView === item.id ? 'text-white scale-110' : 'text-slate-500 group-hover:text-blue-400'} transition-all duration-300`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 22 })}
                </span>
                <span className="text-[10px] md:text-[15px] font-semibold tracking-wide">{item.label}</span>
                {currentView === item.id && (
                  <div className="hidden md:block absolute right-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                )}
              </button>
            ))}
          </div>

          {/* User Section (Bottom in Sidebar) */}
          <div className="hidden md:flex flex-col p-6 border-t border-slate-800/50 mt-auto bg-slate-900/30">
            <div className="flex items-center justify-between p-1">
              <button
                onClick={() => setView(AppView.PROFILE)}
                className="flex items-center space-x-4 text-slate-300 hover:text-white transition-all group"
              >
                <div className="relative">
                  <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <div className="bg-slate-900 rounded-full p-1.5">
                      <UserCircle size={28} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold tracking-tight group-hover:underline underline-offset-4">{user?.name || 'Perfil'}</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Master User</span>
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
