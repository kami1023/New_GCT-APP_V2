import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ExternalLink, FolderOpen, Eye, X, Download, CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { formatCurrency, cn } from '../utils';
import { format } from 'date-fns';
import { InvoiceTemplate } from './InvoiceTemplate';
import { toJpeg } from 'html-to-image';

interface InvoiceLogProps {
  settings?: Record<string, string>;
}

export const InvoiceLog: React.FC<InvoiceLogProps> = ({ settings }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [updatingPayment, setUpdatingPayment] = useState<Invoice | null>(null);
  const [paymentForm, setPaymentForm] = useState({ status: 'Pending', amount_paid: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = () => {
    fetch('/api/invoices').then(res => res.json()).then(setInvoices);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleUpdatePayment = async () => {
    if (!updatingPayment) return;
    const res = await fetch(`/api/invoices/${updatingPayment.id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentForm)
    });
    if (res.ok) {
      fetchInvoices();
      setUpdatingPayment(null);
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    const res = await fetch(`/api/invoices/${invoice.id}/items`);
    if (res.ok) {
      const items = await res.json();
      setInvoiceItems(items);
      setViewingInvoice(invoice);
    }
  };

  const handleDownload = async () => {
    if (previewRef.current && viewingInvoice) {
      const dataUrl = await toJpeg(previewRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Invoice_${viewingInvoice.invoice_no}_${viewingInvoice.purchaser_name?.replace(/\s+/g, '_')}.jpg`;
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

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.purchaser_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Paid') return matchesSearch && inv.status === 'Paid';
    if (statusFilter === 'Unpaid') return matchesSearch && (inv.status === 'Pending' || inv.status === 'Partial' || !inv.status);
    
    return matchesSearch;
  });

  const totals = invoices.reduce((acc, inv) => {
    const isPaid = inv.status === 'Paid';
    if (isPaid) acc.paid += inv.grand_total;
    else acc.unpaid += inv.grand_total;
    return acc;
  }, { paid: 0, unpaid: 0 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex items-center gap-6 bg-emerald-500/5 border-emerald-500/10">
          <div className="w-12 h-12 rounded-sm bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-1">Total Collections</p>
            <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(totals.paid)}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-6 bg-amber-500/5 border-amber-500/10">
          <div className="w-12 h-12 rounded-sm bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.2em] mb-1">Total Outstanding (Unpaid)</p>
            <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(totals.unpaid)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Search by Invoice # or Buyer Name..."
              className="glass-input w-full pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 w-5 h-5 text-zinc-600" />
          </div>

          <div className="flex p-1 glass-panel border-white/5 bg-white/[0.02] rounded-sm">
            {(['All', 'Paid', 'Unpaid'] as const).map((f) => {
              const count = f === 'All' ? invoices.length :
                f === 'Paid' ? invoices.filter(i => i.status === 'Paid').length :
                invoices.filter(i => i.status !== 'Paid').length;
              
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-2",
                    statusFilter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {f}
                  <span className={cn(
                    "text-[8px] px-1.5 py-0.5 rounded-full",
                    statusFilter === f ? "bg-black/10 text-black" : "bg-white/5 text-zinc-600"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-6 py-3 glass-panel text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
          <FolderOpen className="w-4 h-4" /> Open Bills Folder
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Invoice #</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Buyer Name</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 font-mono font-bold text-sky-400 tracking-tighter">#{inv.invoice_no}</td>
                <td className="px-8 py-5 text-zinc-400 text-sm">{format(new Date(inv.date), 'dd MMM yyyy')}</td>
                <td className="px-8 py-5 font-bold text-white uppercase tracking-tight">{inv.purchaser_name}</td>
                <td className="px-8 py-5 font-mono font-bold text-white">{formatCurrency(inv.grand_total)}</td>
                <td className="px-8 py-5">
                  <button 
                    onClick={() => {
                      setUpdatingPayment(inv);
                      setPaymentForm({ status: inv.status || 'Pending', amount_paid: inv.amount_paid || 0 });
                    }}
                    className={cn(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border flex items-center gap-2 transition-all",
                      inv.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      inv.status === 'Partial' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    )}
                  >
                    {inv.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> :
                     inv.status === 'Partial' ? <Clock className="w-3 h-3" /> :
                     <AlertCircle className="w-3 h-3" />}
                    {inv.status || 'Pending'}
                  </button>
                </td>
                <td className="px-8 py-5">
                  <button 
                    onClick={() => handleViewInvoice(inv)}
                    className="p-2 text-zinc-600 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">View</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-zinc-600 italic font-medium">
                  No records found in the vault.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewingInvoice(null)} />
          <div className="glass-panel w-full max-w-5xl h-[90vh] p-10 relative animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Invoice Archive</h3>
                <p className="text-zinc-500 text-sm">Viewing historical record for #{viewingInvoice.invoice_no}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 px-6 py-3 glass-panel border-white/10">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Payment Status</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm",
                    viewingInvoice.status === 'Paid' ? "text-emerald-400 bg-emerald-400/10" :
                    viewingInvoice.status === 'Partial' ? "text-amber-400 bg-amber-400/10" :
                    "text-zinc-400 bg-zinc-400/10"
                  )}>
                    {viewingInvoice.status || 'Pending'}
                  </span>
                </div>
                <button 
                  onClick={handleDownload}
                  className="px-6 py-3 glass-panel text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-6 py-3 glass-panel text-sky-400 text-xs font-black uppercase tracking-widest hover:bg-sky-500/10 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Print
                </button>
                <button 
                  onClick={() => setViewingInvoice(null)}
                  className="p-3 glass-card hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-zinc-900/50 rounded-md p-10 flex justify-center">
              <div className="scale-[0.85] origin-top">
                <InvoiceTemplate 
                  invoice={viewingInvoice}
                  items={invoiceItems}
                  purchaser={{ name: viewingInvoice.purchaser_name || '', address: '', gstin: '', contact_person: '', id: viewingInvoice.purchaser_id }}
                  previewRef={previewRef}
                  settings={settings}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Modal */}
      {updatingPayment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUpdatingPayment(null)} />
          <div className="glass-panel w-full max-w-md p-10 relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <CreditCard className="w-6 h-6 text-sky-400" />
              <h3 className="text-2xl font-black text-white tracking-tight">Track Payment</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/[0.03] rounded-sm border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Invoice Total</span>
                  <span className="text-white font-mono font-bold">{formatCurrency(updatingPayment.grand_total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Balance Due</span>
                  <span className="text-red-400 font-mono font-bold">{formatCurrency(updatingPayment.grand_total - paymentForm.amount_paid)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Payment Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Pending', 'Partial', 'Paid'].map(s => (
                    <button
                      key={s}
                      onClick={() => setPaymentForm({ ...paymentForm, status: s as any, amount_paid: s === 'Paid' ? updatingPayment.grand_total : paymentForm.amount_paid })}
                      className={cn(
                        "py-3 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all",
                        paymentForm.status === s ? "bg-sky-500/20 border-sky-500/50 text-sky-400" : "glass-card text-zinc-500 border-white/5 hover:border-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Amount Paid (₹)</label>
                <input 
                  type="number"
                  className="glass-input w-full font-mono font-bold text-white"
                  value={paymentForm.amount_paid}
                  onChange={e => setPaymentForm({ ...paymentForm, amount_paid: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setUpdatingPayment(null)}
                  className="flex-1 py-4 glass-card font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePayment}
                  className="flex-1 py-4 bg-white text-black rounded-sm font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all"
                >
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
