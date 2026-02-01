
import React, { useState } from 'react';
import { Truck, MapPin, ArrowRight, ShieldCheck, Scan } from 'lucide-react';

const Logistics: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const activeDeliveries = [
    { id: 'TRK-99201', status: 'Em Rota', from: 'Matriz - SP', to: 'Unidade Industrial - MG', progress: 65 },
    { id: 'TRK-99245', status: 'Aguardando Coleta', from: 'CD Santos', to: 'Laboratório Central', progress: 5 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Logística e Entregas</h1>
          <p className="text-gray-500 text-sm">Monitoramento em tempo real de cargas e peças.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg">
          <Truck size={20} />
          <span>Solicitar Nova Entrega</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center space-x-2 mb-6 text-indigo-600">
           <Scan size={24} />
           <h2 className="text-lg font-bold">Monitoramento de Ponto de Controle (NFC)</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block"></div>
          {[
            { step: 1, label: 'Coleta Efetuada', time: '08:45', done: true },
            { step: 2, label: 'Centro de Triagem', time: '13:20', done: true },
            { step: 3, label: 'Em Trânsito', time: '--:--', done: false, active: true },
            { step: 4, label: 'Entrega Final', time: '--:--', done: false },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 ${
                s.done ? 'bg-indigo-600 text-white border-indigo-100' : 
                s.active ? 'bg-white text-indigo-600 border-indigo-600 animate-pulse' : 
                'bg-gray-100 text-gray-400 border-white'
              }`}>
                {s.step}
              </div>
              <p className={`mt-2 text-xs font-bold ${s.active ? 'text-indigo-600' : 'text-gray-500'}`}>{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" />
            Minhas Entregas Ativas
          </h3>
          <div className="space-y-4">
            {activeDeliveries.map(delivery => (
              <div key={delivery.id} className="border border-gray-100 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{delivery.id}</span>
                  <span className="text-xs font-medium text-green-600">{delivery.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium">{delivery.from}</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 mx-2" />
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium">{delivery.to}</span>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${delivery.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <Truck className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
          <h3 className="text-xl font-bold mb-2">OmniLoggi Pro</h3>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            Habilite o monitoramento biométrico e rastreamento via etiquetas NFC em sua conta comercial para maior segurança.
          </p>
          <button className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
