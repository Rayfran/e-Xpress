
import React from 'react';
import { Star, MapPin, ShieldCheck, Calendar } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    { id: '1', provider: 'João Silva', specialty: 'Assistência Técnica de Inversores', rating: 4.8, price: 80, location: 'Barueri, SP', jobs: 154 },
    { id: '2', provider: 'TechIndustrial LTDA', specialty: 'Manutenção Preventiva CNC', rating: 4.9, price: 150, location: 'Curitiba, PR', jobs: 2450 },
    { id: '3', provider: 'EletroPro', specialty: 'Instalações Elétricas Industriais', rating: 4.7, price: 95, location: 'Joinville, SC', jobs: 420 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Encontrar Profissionais</h1>
        <p className="text-gray-500 text-sm">Especialistas prontos para atender suas necessidades técnicas.</p>
      </header>

      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
        {['Manutenção', 'Elétrica', 'Mecânica', 'Software/PLC', 'Instalação'].map(cat => (
          <button key={cat} className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {services.map(service => (
          <div key={service.id} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${service.id}/100/100`} alt={service.provider} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{service.specialty}</h3>
                  <p className="text-sm font-medium text-blue-600">{service.provider}</p>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-gray-800">{service.rating}</span>
                  <span className="text-xs text-gray-400">({service.jobs})</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 py-1">
                <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{service.location}</span></span>
                <span className="flex items-center space-x-1"><ShieldCheck size={14} className="text-green-500" /> <span>Verificado</span></span>
                <span className="flex items-center space-x-1"><Calendar size={14} /> <span>Próx. Disponibilidade: Amanhã</span></span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <p className="text-xs text-gray-400">Preço/Hora</p>
              <p className="text-xl font-bold text-gray-800">R$ {service.price}</p>
              <button className="mt-4 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                Contratar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
