import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Save, X, UserPlus, Download, Eye } from 'lucide-react';
import { Purchaser, Product, InvoiceItem, Invoice } from '../types';
import { InvoiceTemplate } from './InvoiceTemplate';
import { toJpeg } from 'html-to-image';
import { cn } from '../utils';

interface BillingFormProps {
  settings?: Record<string, string>;
}

export const BillingForm: React.FC<BillingFormProps> = ({ settings }) => {
  const [purchasers, setPurchasers] = useState<Purchaser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPurchaser, setSelectedPurchaser] = useState<Purchaser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<(InvoiceItem & { productName?: string })[]>([]);
  const [showAddPurchaser, setShowAddPurchaser] = useState(false);
  const [newPurchaser, setNewPurchaser] = useState({ name: '', gstin: '', address: '', contact_person: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState<{ no: string, name: string } | null>(null);
  const [zoom, setZoom] = useState(0.7);
  
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
    invoice_no: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'Cash/UPI',
    dispatched_through: 'Door Delivery',
    buyer_order_no: '',
    delivery_terms: 'Immediate'
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        setZoom(prev => {
          const zoomSpeed = 0.008;
          const newZoom = prev + delta * zoomSpeed;
          return Math.min(Math.max(newZoom, 0.3), 3.0);
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    fetch('/api/purchasers').then(res => res.json()).then(setPurchasers);
    fetch('/api/products').then(res => res.json()).then(setProducts);
    
    // Auto-suggest next invoice number
    fetch('/api/invoices').then(res => res.json()).then(invoices => {
      if (invoices.length > 0) {
        const lastNo = invoices[0].invoice_no;
        const nextNo = (parseInt(lastNo) + 1).toString().padStart(2, '0');
        setInvoiceData(prev => ({ ...prev, invoice_no: nextNo }));
      } else {
        setInvoiceData(prev => ({ ...prev, invoice_no: '01' }));
      }
    });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: 'MK1', quantity: 1, rate: 125, amount: 125 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setItems(newItems);
  };

  const handleAddPurchaser = async () => {
    if (!newPurchaser.name) return alert('Name is required');
    const response = await fetch('/api/purchasers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPurchaser)
    });
    if (response.ok) {
      const p = await response.json();
      const fullPurchaser = { ...newPurchaser, id: p.id };
      setPurchasers([...purchasers, fullPurchaser]);
      setSelectedPurchaser(fullPurchaser);
      setShowAddPurchaser(false);
      setNewPurchaser({ name: '', gstin: '', address: '', contact_person: '' });
    }
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      const dataUrl = await toJpeg(previewRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      const name = selectedPurchaser?.name || lastGeneratedInvoice?.name || 'Invoice';
      const no = invoiceData.invoice_no || lastGeneratedInvoice?.no || '00';
      link.download = `Invoice_${no}_${name.replace(/\s+/g, '_')}.jpg`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handlePrint = () => {
    if (previewRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          @media print {
            .no-print { display: none; }
            body { -webkit-print-color-adjust: exact; }
          }
          font-family: 'Inter', sans-serif;
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(previewRef.current.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Wait for styles to load
        printWindow.onload = () => {
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        };
      }
    }
  };

  const handleSave = async () => {
    if (!selectedPurchaser) return alert('Please select a purchaser');
    if (items.length === 0) return alert('Please add at least one item');
    if (!invoiceData.invoice_no) return alert('Invoice number is required');

    const paddedNo = invoiceData.invoice_no.padStart(2, '0');

    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...invoiceData,
        invoice_no: paddedNo,
        purchaser_id: selectedPurchaser.id,
        items
      })
    });

    if (response.ok) {
      setLastGeneratedInvoice({ no: paddedNo, name: selectedPurchaser.name });
      setShowSuccessModal(true);
      
      // Refresh state but keep the preview for download/print
      const nextNo = (parseInt(paddedNo) + 1).toString().padStart(2, '0');
      setInvoiceData({ ...invoiceData, invoice_no: nextNo });
    } else {
      const err = await response.json();
      alert(`Error: ${err.error}`);
    }
  };

  const filteredPurchasers = purchasers.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetZoom = () => {
    setZoom(0.7);
  };

  return (
    <div className="flex gap-10 h-[calc(100vh-160px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Side: Input */}
      <div className="w-[45%] overflow-y-auto pr-4 space-y-8 scrollbar-hide">
        {lastGeneratedInvoice && (
          <div className="glass-panel p-6 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-bold text-sm">Invoice #{lastGeneratedInvoice.no} Generated</p>
              <p className="text-zinc-500 text-xs">Ready for export</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="p-2 glass-card text-emerald-400 hover:bg-emerald-500/10"
                aria-label="Download invoice"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 glass-card text-emerald-400 hover:bg-emerald-500/10"
                aria-label="Preview and print invoice"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setLastGeneratedInvoice(null);
                  setItems([]);
                  setSelectedPurchaser(null);
                }}
                className="p-2 glass-card text-zinc-500"
                aria-label="Clear success message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <div className="glass-panel p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Purchaser</h3>
            <button 
              onClick={() => setShowAddPurchaser(true)}
              className="text-[10px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> New Client
            </button>
          </div>
          
          <div className="relative mb-6">
            <input 
              type="text"
              placeholder="Search existing clients..."
              className="glass-input w-full pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 w-5 h-5 text-zinc-600" />
          </div>

          {searchTerm && filteredPurchasers.length > 0 && (
            <div className="mb-6 glass-card overflow-hidden border-white/10">
              {filteredPurchasers.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPurchaser(p);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "w-full text-left px-5 py-3 transition-colors border-b border-white/5 last:border-0",
                    selectedPurchaser?.id === p.id ? "bg-sky-500/30 border-l-4 border-sky-400" : "hover:bg-white/5"
                  )}
                >
                  <p className="font-bold text-sm text-white">{p.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{p.gstin}</p>
                </button>
              ))}
            </div>
          )}

          {selectedPurchaser && (
            <div className="p-6 bg-white/[0.03] rounded-sm border border-white/10 relative group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-black text-white uppercase tracking-tight text-lg">{selectedPurchaser.name}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{selectedPurchaser.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">GSTIN</span>
                    <span className="text-[10px] font-mono font-bold text-sky-400">{selectedPurchaser.gstin}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPurchaser(null)}
                  className="p-2 text-zinc-600 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Logistics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Invoice #</label>
              <input 
                type="text"
                placeholder="e.g. 01"
                className="glass-input w-full font-mono font-bold text-sky-400"
                value={invoiceData.invoice_no}
                onChange={e => setInvoiceData({...invoiceData, invoice_no: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Date</label>
              <input 
                type="date"
                className="glass-input w-full text-zinc-300"
                value={invoiceData.date}
                onChange={e => setInvoiceData({...invoiceData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Payment</label>
              <select 
                className="glass-input w-full text-zinc-300 appearance-none bg-zinc-900"
                value={invoiceData.payment_mode}
                onChange={e => setInvoiceData({...invoiceData, payment_mode: e.target.value})}
              >
                <option value="Cash/UPI" className="bg-zinc-900 text-white">Cash/UPI</option>
                <option value="Bank" className="bg-zinc-900 text-white">Bank</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Dispatch</label>
              <input 
                type="text"
                className="glass-input w-full text-zinc-300"
                value={invoiceData.dispatched_through}
                onChange={e => setInvoiceData({...invoiceData, dispatched_through: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Order Items</h3>
            <button 
              onClick={handleAddItem}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-end p-5 bg-white/[0.02] rounded-sm border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex-1 space-y-2">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Product</label>
                  <select 
                    className="glass-input w-full text-sm appearance-none bg-zinc-900"
                    value={item.product_id}
                    onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-zinc-900 text-white">{p.id} - {p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-20 space-y-2">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Qty</label>
                  <input 
                    type="number"
                    className="glass-input w-full text-sm text-center font-bold"
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rate</label>
                  <input 
                    type="number"
                    className="glass-input w-full text-sm text-center font-bold"
                    value={item.rate}
                    onChange={e => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button 
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-all"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-5 bg-white text-black rounded-sm font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          <Save className="w-5 h-5" /> Finalize & Export
        </button>
      </div>

      <div 
        ref={previewContainerRef}
        onDoubleClick={resetZoom}
        className="w-[55%] glass-panel p-10 overflow-auto flex flex-col items-center bg-zinc-900/50 relative"
        title="Pinch to zoom or Double-click to reset"
      >
        <div className="mb-8 flex justify-between w-full max-w-[210mm] sticky top-0 bg-zinc-900/80 backdrop-blur-md p-4 z-20 rounded-sm border border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">A4 Canvas Engine</h3>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Zoom</span>
              <input 
                type="range" 
                min="0.3" 
                max="3.0" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-32 accent-sky-500"
              />
              <span className="text-[10px] font-mono font-bold text-sky-400">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={resetZoom}
                className="ml-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Reset
              </button>
            </div>
          </div>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">300 DPI Rendering</span>
        </div>
        <div 
          className="transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: '210mm', // Standard A4 width
            minHeight: '297mm' // Standard A4 height
          }}
        >
          <InvoiceTemplate 
            invoice={invoiceData} 
            purchaser={selectedPurchaser || undefined} 
            items={items}
            previewRef={previewRef}
            settings={settings}
          />
        </div>
      </div>

      {/* Add Purchaser Modal */}
      {showAddPurchaser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPurchaser(false)} />
          <div className="glass-panel w-full max-w-md p-10 relative animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">New Client Profile</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Company Name</label>
                <input 
                  className="glass-input w-full"
                  value={newPurchaser.name}
                  onChange={e => setNewPurchaser({...newPurchaser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">GSTIN Number</label>
                <input 
                  className="glass-input w-full font-mono"
                  value={newPurchaser.gstin}
                  onChange={e => setNewPurchaser({...newPurchaser, gstin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Address</label>
                <textarea 
                  className="glass-input w-full min-h-[100px] py-3 resize-none"
                  value={newPurchaser.address}
                  onChange={e => setNewPurchaser({...newPurchaser, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Person</label>
                <input 
                  className="glass-input w-full"
                  value={newPurchaser.contact_person}
                  onChange={e => setNewPurchaser({...newPurchaser, contact_person: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddPurchaser(false)}
                  className="flex-1 py-4 glass-card font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPurchaser}
                  className="flex-1 py-4 bg-white text-black rounded-sm font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Announcement Modal */}
      {showSuccessModal && lastGeneratedInvoice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSuccessModal(false)}></div>
          <div className="glass-panel w-full max-w-md p-12 relative text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Bill Generated!</h2>
            <p className="text-zinc-400 font-medium mb-10">
              Invoice #{lastGeneratedInvoice.no} for {lastGeneratedInvoice.name} has been successfully recorded.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleDownload}
                className="w-full py-4 bg-emerald-500 text-white rounded-sm font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download JPG
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-white text-black rounded-sm font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
