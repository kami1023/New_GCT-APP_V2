import React, { useState, useEffect } from 'react';
import { Plus, Minus, Package, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface InventoryCardProps {
  product: Product;
  onUpdateStock: (id: string, change: number, reason: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onDelete: (id: string) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ product, onUpdateStock, onUpdatePrice, onDelete }) => {
  const [localStock, setLocalStock] = useState(product.stock_level.toString());
  const [localPrice, setLocalPrice] = useState(product.price.toString());

  useEffect(() => {
    setLocalStock(product.stock_level.toString());
  }, [product.stock_level]);

  useEffect(() => {
    setLocalPrice(product.price.toString());
  }, [product.price]);

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStock(product.id, 1, "Manual Restock");
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStock(product.id, -1, "Manual Deduction");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`WARNING: Deleting ${product.id} will also remove it from all existing invoices and logs. This action cannot be undone. Are you sure?`)) {
      onDelete(product.id);
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStock(e.target.value);
  };

  const handleBlur = () => {
    const newVal = parseInt(localStock);
    if (!isNaN(newVal)) {
      const diff = newVal - product.stock_level;
      if (diff !== 0) {
        onUpdateStock(product.id, diff, "Direct Edit");
      }
    } else {
      setLocalStock(product.stock_level.toString());
    }
  };

  const handlePriceBlur = () => {
    const newVal = parseFloat(localPrice);
    if (!isNaN(newVal) && newVal !== product.price) {
      onUpdatePrice(product.id, newVal);
    } else {
      setLocalPrice(product.price.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="glass-panel p-8 group hover:border-white/20 transition-all duration-500 h-full flex flex-col rounded-sm min-h-[420px]">
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-white/5 rounded-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
          <Package className="w-8 h-8 text-sky-400" />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className="p-3 hover:bg-red-500/20 text-zinc-600 hover:text-red-400 rounded-sm transition-all border border-white/5 hover:border-red-500/30"
            title="Delete Product"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleMinus}
            className="p-3 hover:bg-red-500/20 text-red-400 rounded-sm transition-all border border-white/5 hover:border-red-500/30"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button 
            onClick={handlePlus}
            className="p-3 hover:bg-emerald-500/20 text-emerald-400 rounded-sm transition-all border border-white/5 hover:border-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-1 flex-1">
        <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{product.id}</h3>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{product.name}</p>
      </div>

      <div className="flex items-baseline gap-3 my-6">
        <input 
          type="text"
          className="bg-transparent text-6xl font-black text-white tracking-tighter w-32 outline-none border-none cursor-default focus:cursor-text"
          value={localStock}
          onChange={handleStockChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Units</span>
      </div>
      
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Unit Price</span>
          <div className="flex items-center gap-1">
            <span className="text-white font-mono font-bold text-lg">₹</span>
            <input 
              type="text"
              className="bg-transparent text-white font-mono font-bold text-lg w-20 outline-none border-none text-right cursor-default focus:cursor-text"
              value={localPrice}
              onChange={e => setLocalPrice(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Market Value</span>
          <span className="text-white font-mono font-bold text-lg">
            {formatCurrency(product.stock_level * product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};
