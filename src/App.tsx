import React, { useState, useEffect, useId, useRef } from 'react';
import { LayoutDashboard, ReceiptText, History, PlusCircle, Search, Settings as SettingsIcon, PackageSearch, AlertTriangle, Sparkles, XCircle } from 'lucide-react';
import { Product } from './types';
import { InventoryCard } from './components/InventoryCard';
import { BillingForm } from './components/BillingForm';
import { InvoiceLog } from './components/InvoiceLog';
import { StockLogs } from './components/StockLogs';
import { Settings } from './components/Settings';
import { NewProductModal } from './components/NewProductModal';
import { cn } from './utils';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const searchInputId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'billing' | 'logs' | 'stock-logs' | 'settings'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  };

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings);
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setActiveTab('dashboard');
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateStock = async (id: string, change: number, reason: string) => {
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change, reason })
      });
      if (response.ok) {
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update stock');
      }
    } catch (err) {
      alert('Network error while updating stock');
    }
  };

  const handleUpdatePrice = async (id: string, price: number) => {
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      });
      if (response.ok) {
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update price');
      }
    } catch (err) {
      alert('Network error while updating price');
    }
  };

  const handleAddProduct = async (id: string, name: string, price: number) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, price })
    });
    const data = await response.json();
    if (data.success) {
      fetchProducts();
    } else {
      alert(data.error || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      } else {
        let errorMsg = data.error || 'Failed to delete product';
        if (data.availableIds) {
          errorMsg += `\n\nAvailable IDs in database: ${data.availableIds.join(', ')}`;
        }
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Network error: Could not connect to server to delete product.');
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = settings.bg_media_url ? getYouTubeId(settings.bg_media_url) : null;

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-sky-500/30 relative">
      {/* Background Media */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0a0c10]">
        {settings.bg_media_url ? (
          <div className="w-full h-full opacity-40 animate-in fade-in duration-1000">
            {youtubeId ? (
              <div className="absolute inset-0 w-full h-full scale-[1.3] -translate-y-[5%]">
                <iframe
                  className="w-full h-full pointer-events-none"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&rel=0&iv_load_policy=3&disablekb=1`}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                />
              </div>
            ) : settings.bg_media_type === 'video' ? (
              <video 
                src={settings.bg_media_url} 
                className="w-full h-full object-cover" 
                muted loop autoPlay playsInline 
              />
            ) : (
              <img 
                src={settings.bg_media_url} 
                className="w-full h-full object-cover" 
                alt="Background" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10]/80 via-transparent to-[#0a0c10]" />
          </div>
        ) : (
          <>
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
        <div className="glass-panel px-8 h-16 flex items-center justify-center">
          <div className="flex gap-1">
            <TabButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Inventory"
            />
            <TabButton 
              active={activeTab === 'billing'} 
              onClick={() => setActiveTab('billing')}
              icon={<ReceiptText className="w-4 h-4" />}
              label="Billing"
            />
            <TabButton 
              active={activeTab === 'stock-logs'} 
              onClick={() => setActiveTab('stock-logs')}
              icon={<PackageSearch className="w-4 h-4" />}
              label="Qty Log"
            />
            <TabButton 
              active={activeTab === 'logs'} 
              onClick={() => setActiveTab('logs')}
              icon={<History className="w-4 h-4" />}
              label="Bills"
            />
            <TabButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
              icon={<SettingsIcon className="w-4 h-4" />}
              label="Settings"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 pt-32 pb-12 relative z-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-24 h-24 rounded-sm bg-gradient-to-br from-sky-400 to-blue-600 p-[2px] shadow-[0_0_50px_rgba(56,189,248,0.2)] mb-6">
                <div className="w-full h-full bg-[#0a0c10] rounded-none flex items-center justify-center">
                  <span className="text-4xl font-black tracking-tighter text-white">GCT</span>
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2 uppercase">Ganesh Clean Tech</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Industrial Inventory Management System</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="relative w-full md:w-96 group">
                <label htmlFor={searchInputId} className="sr-only">Search products by name or ID</label>
                <input 
                  id={searchInputId}
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products... (Press /)"
                  className="glass-input w-full pl-10 pr-12 text-sm h-[56px] focus:ring-1 focus:ring-sky-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end w-full md:w-auto">
                <div className="glass-panel px-6 py-2 flex flex-col items-end min-w-[220px] h-[56px] justify-center">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Total Assets Value</p>
                  <p className="text-xl font-mono font-bold text-white">
                    ₹{products.reduce((sum, p) => sum + (p.stock_level * p.price), 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <button 
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="px-8 h-[56px] glass-panel text-sky-400 text-xs font-black uppercase tracking-widest hover:bg-sky-500/10 hover:border-sky-500/40 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.05)] active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> New Product
                </button>
              </div>
            </div>

            <NewProductModal 
              isOpen={isNewProductModalOpen} 
              onClose={() => setIsNewProductModalOpen(false)} 
              onAdd={handleAddProduct} 
            />

            {(() => {
              const filtered = products.filter(p =>
                p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (products.length > 0 && filtered.length === 0) {
                return (
                  <div className="glass-panel p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                      <Search className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">No matching products</h3>
                    <p className="text-zinc-500 text-sm mb-8 max-w-xs">We couldn't find any products matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="px-6 py-3 glass-card text-[10px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-all"
                    >
                      Clear search filters
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {filtered.map(product => (
                    <div key={product.id} className="h-full flex flex-col gap-4">
                      <InventoryCard
                        product={product}
                        onUpdateStock={handleUpdateStock}
                        onUpdatePrice={handleUpdatePrice}
                        onDelete={handleDeleteProduct}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'billing' && <BillingForm settings={settings} />}
        
        {activeTab === 'stock-logs' && <StockLogs products={products} onRefreshProducts={fetchProducts} />}

        {activeTab === 'logs' && <InvoiceLog settings={settings} />}

        {activeTab === 'settings' && <Settings onSettingsUpdate={fetchSettings} />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-300",
        active 
          ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
