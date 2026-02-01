
import React, { useState, useRef } from 'react';
import { Camera, Search, Plus, Loader2 } from 'lucide-react';
import { analyzeProductImage } from '../services/geminiService';

const Marketplace: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const products = [
    { id: '1', name: 'Motor de Passo NEMA 23', price: 150.00, image: 'https://picsum.photos/seed/motor/400/300', category: 'Eletrônicos' },
    { id: '2', name: 'Controlador PLC Schneider', price: 1200.00, image: 'https://picsum.photos/seed/plc/400/300', category: 'Automação' },
    { id: '3', name: 'Conjunto de Sensores Laser', price: 450.00, image: 'https://picsum.photos/seed/sensor/400/300', category: 'Segurança' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const analysis = await analyzeProductImage(base64);
      if (analysis) {
        setFormData({
          name: analysis.name || '',
          price: analysis.suggestedPrice?.toString() || '',
          description: analysis.description || '',
          category: analysis.category || ''
        });
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mercado Industrial</h1>
          <p className="text-gray-500 text-sm">Encontre equipamentos ou anuncie itens usados.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
        >
          <Plus size={20} />
          <span>Vender Produto</span>
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="O que você está procurando?" 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative h-48 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase text-gray-600">{product.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
              <p className="text-blue-600 font-bold mt-2 text-lg">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">Ver Detalhes</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Novo Anúncio</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-600">IA analisando produto...</span>
                  </div>
                ) : (
                  <>
                    <Camera className="text-blue-600 mb-2" size={32} />
                    <span className="text-sm text-gray-500">Clique para tirar foto ou subir imagem</span>
                    <span className="text-xs text-blue-500 mt-1">Nossa IA preencherá os dados para você!</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nome do Item</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 border border-gray-200 p-2 rounded-lg" placeholder="Ex: Multímetro Digital Fluke" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Preço sugerido</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mt-1 border border-gray-200 p-2 rounded-lg" placeholder="0,00" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 border border-gray-200 p-2 rounded-lg" placeholder="Ex: Ferramentas" />
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 mt-4 transition-all shadow-lg active:scale-95">
                Publicar Anúncio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
