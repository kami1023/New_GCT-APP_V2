import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, History, Package, Calendar, Trash2, CheckSquare, Square, AlertTriangle, Sparkles, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { Product } from '../types';
import { cn } from '../utils';
import { GoogleGenAI } from "@google/genai";

interface StockLog {
  id: number;
  product_id: string;
  product_name: string;
  change: number;
  reason: string;
  timestamp: string;
}

interface StockLogsProps {
  products: Product[];
  onRefreshProducts: () => void;
}

export const StockLogs: React.FC<StockLogsProps> = ({ products, onRefreshProducts }) => {
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Record<string, string>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState<Record<string, boolean>>({});

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/stock-logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const generateAiRecommendation = async (product: Product) => {
    if (isGeneratingAi[product.id]) return;
    setIsGeneratingAi(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Get recent logs for this product to analyze trends
      const productLogs = logs
        .filter(l => l.product_id === product.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15);
        
      const logSummary = productLogs.map(l => 
        `${format(new Date(l.timestamp), 'MMM dd')}: ${l.change > 0 ? '+' : ''}${l.change} (${l.reason})`
      ).join('\n');

      const prompt = `
        Product: ${product.id} (${product.name})
        Current Stock: ${product.stock_level}
        
        Recent Stock Movements:
        ${logSummary || "No recent movements recorded."}
        
        Context:
        - Delivery takes 1-3 business days.
        - Analyze the usage trend above.
        - Suggest a minimum restocking quantity to avoid stockouts.
        
        Requirements:
        - Bulleted list.
        - Extremely concise (max 12 words total).
        - No filler text.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setAiRecommendations(prev => ({ ...prev, [product.id]: response.text || "• Order 20 units\n• 3-day buffer" }));
    } catch (error) {
      setAiRecommendations(prev => ({ ...prev, [product.id]: `• Order 15 units\n• Safety buffer` }));
    } finally {
      setIsGeneratingAi(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleClearLogs = async () => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      return;
    }

    if (selectedIds.length === 0) {
      setIsSelectionMode(false);
      return;
    }

    if (confirm(`Delete ${selectedIds.length} selected logs?`)) {
      try {
        const response = await fetch('/api/stock-logs/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (response.ok) {
          fetchLogs();
          setSelectedIds([]);
          setIsSelectionMode(false);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete logs');
        }
      } catch (err) {
        alert('Network error while deleting logs');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm("CRITICAL: This will permanently delete ALL movement logs from the database. This cannot be undone. Proceed?")) {
      try {
        const response = await fetch('/api/stock-logs/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: 'all' })
        });
        if (response.ok) {
          fetchLogs();
          setSelectedIds([]);
          setIsSelectionMode(false);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete all logs');
        }
      } catch (err) {
        alert('Network error while deleting all logs');
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLogs.map(l => l.id));
    }
  };

  const filteredLogs = logs.filter(log => 
    log.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock_level <= 5);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">Quantity Logs</h2>
          <p className="text-zinc-500 mt-2 text-lg">Inventory movement & stock alerts.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text"
              placeholder="Search logs..."
              className="glass-input w-full pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 w-5 h-5 text-zinc-600" />
          </div>
          <button 
            onClick={fetchLogs}
            className="p-4 glass-panel text-zinc-400 hover:text-white transition-all"
            title="Refresh Logs"
          >
            <RefreshCcw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={cn(
              "px-6 h-[52px] rounded-sm font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all",
              isSelectionMode ? "bg-sky-500 text-white" : "glass-panel text-zinc-400 hover:text-white"
            )}
          >
            <CheckSquare className="w-4 h-4" />
            {isSelectionMode ? "Exit Selection" : "Select Logs"}
          </button>
          {isSelectionMode && (
            <>
              <button 
                onClick={handleClearLogs}
                disabled={selectedIds.length === 0}
                className={cn(
                  "px-6 h-[52px] rounded-sm font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all",
                  selectedIds.length > 0 ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500/40 cursor-not-allowed"
                )}
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </button>
              <button 
                onClick={handleDeleteAll}
                className="px-6 h-[52px] rounded-sm font-black uppercase tracking-widest text-xs flex items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all border border-red-500/30"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete All
              </button>
            </>
          )}
        </div>
      </div>

      {/* ASAP Restock List */}
      {lowStockProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Stock ASAP</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="glass-panel p-6 border-red-500/30 bg-red-500/5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-white uppercase tracking-tight text-lg">{product.id}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Current Stock</p>
                    <p className="text-2xl font-mono font-black text-white">{product.stock_level}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  {aiRecommendations[product.id] ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> AI Recommendation
                      </p>
                      <div className="text-xs text-zinc-300 leading-relaxed font-medium whitespace-pre-line">
                        {aiRecommendations[product.id]}
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => generateAiRecommendation(product)}
                      disabled={isGeneratingAi[product.id]}
                      className="w-full py-3 glass-card text-[10px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className={cn("w-3.5 h-3.5", isGeneratingAi[product.id] && "animate-spin")} />
                      {isGeneratingAi[product.id] ? "Analyzing..." : "Get Restock Plan"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden relative">
        {isSelectionMode && (
          <div className="bg-white/[0.05] border-b border-white/5 px-8 py-4 flex justify-between items-center animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selection Mode Active</p>
            <button 
              onClick={handleSelectAll}
              className="text-[10px] font-black text-sky-400 hover:text-sky-300 uppercase tracking-widest flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              {selectedIds.length === filteredLogs.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        )}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="w-12 px-8 py-5">
                <button 
                  onClick={handleSelectAll}
                  className="text-zinc-600 hover:text-sky-400 transition-colors"
                  title={selectedIds.length === filteredLogs.length ? "Deselect All" : "Select All"}
                >
                  {selectedIds.length === filteredLogs.length && filteredLogs.length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Timestamp (IST)</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Product</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Movement</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Change</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Reason</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <tr 
                key={log.id} 
                className={cn(
                  "hover:bg-white/[0.02] transition-colors group cursor-pointer",
                  selectedIds.includes(log.id) && "bg-white/[0.05]"
                )}
                onClick={() => {
                  setSelectedIds(prev => 
                    prev.includes(log.id) ? prev.filter(id => id !== log.id) : [...prev, log.id]
                  );
                  if (!isSelectionMode) setIsSelectionMode(true);
                }}
              >
                <td className="px-8 py-5">
                  {selectedIds.includes(log.id) ? (
                    <CheckSquare className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-zinc-400 text-xs">
                      {format(new Date(log.timestamp), 'dd MMM yyyy hh:mm a')}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="font-bold text-white uppercase tracking-tight text-sm">{log.product_id}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{log.product_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  {log.change > 0 ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Inbound</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <ArrowDownLeft className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Outbound</span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-5">
                  <span className={`font-mono font-bold text-lg ${log.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {log.change > 0 ? `+${log.change}` : log.change}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-zinc-400 text-sm font-medium">{log.reason}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this log?")) {
                        fetch('/api/stock-logs/delete', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ids: [log.id] })
                        }).then(res => {
                          if (res.ok) fetchLogs();
                        });
                      }
                    }}
                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={isSelectionMode ? 6 : 5} className="px-8 py-20 text-center text-zinc-600 italic font-medium">
                  {loading ? "Loading logs..." : "No movement logs found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
