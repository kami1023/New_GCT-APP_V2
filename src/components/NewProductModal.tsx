import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: string, name: string, price: number) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('125');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && name) {
      onAdd(id, name, parseFloat(price) || 125);
      setId('');
      setName('');
      setPrice('125');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-panel w-full max-w-md p-10 relative animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-white tracking-tight">New Product</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Product ID (e.g. MK7)</label>
            <input 
              className="glass-input w-full font-mono uppercase"
              value={id}
              onChange={e => setId(e.target.value.toUpperCase())}
              placeholder="MK7"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Product Name</label>
            <input 
              className="glass-input w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="MK Series 7"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Base Price (₹)</label>
            <input 
              type="number"
              className="glass-input w-full font-mono"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="125"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 glass-card font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-white text-black rounded-sm font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
