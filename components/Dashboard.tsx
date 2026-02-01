
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Clock, ShieldCheck } from 'lucide-react';

const data = [
  { name: 'Seg', vendas: 400, servicos: 240 },
  { name: 'Ter', vendas: 300, servicos: 139 },
  { name: 'Qua', vendas: 200, servicos: 980 },
  { name: 'Qui', vendas: 278, servicos: 390 },
  { name: 'Sex', vendas: 189, servicos: 480 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="relative p-6 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-purple-400/10 blur-[100px] rounded-full"></div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Comandante</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Seu ecossistema <span className="text-slate-800 font-bold italic">e-Xpress</span> está operando em alta performance.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Geral</p>
            <p className="text-xs font-bold text-slate-700">98% Operacional</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-green-500" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Faturamento Mensal', value: 'R$ 48.920', trend: '+18.5%', icon: <TrendingUp />, color: 'blue' },
          { label: 'Demandas Técnicas', value: '14', trend: '3 urgentes', icon: <Package />, color: 'indigo' },
          { label: 'Janelas Logísticas', value: '06', trend: 'Próxima: 14h', icon: <Clock />, color: 'purple' },
          { label: 'Índice de Confiança', value: '99.4%', trend: 'Estável', icon: <ShieldCheck />, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-${stat.color}-500/10 transition-colors`}></div>

            <div className="relative flex flex-col h-full space-y-4">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-${stat.color}-50 text-${stat.color}-600 uppercase`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Fluxo de Tração</h3>
              <p className="text-sm text-slate-400 font-medium">Desempenho comparativo de Marketplace vs. Logística</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logística</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                />
                <Bar dataKey="vendas" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="servicos" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[80px]"></div>

          <h3 className="text-xl font-black mb-8 tracking-tight relative z-10">Radar de Eventos</h3>
          <div className="space-y-6 relative z-10">
            {[
              { type: 'logistics', title: 'Expedição #4459', desc: 'Em rota: Curitiba para São Paulo', time: 'Agora mesmo', color: 'blue' },
              { type: 'market', title: 'Aporte de Inventário', desc: '12 novas unidades de Sensor Laser', time: 'há 45 min', color: 'purple' },
              { type: 'service', title: 'Audit de Segurança', desc: 'Concluído no setor industrial C1', time: 'há 2h', color: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="group flex space-x-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500 shadow-[0_0_10px_#3b82f6]`}></div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold tracking-tight">{item.title}</p>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
            Ver Log Completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
