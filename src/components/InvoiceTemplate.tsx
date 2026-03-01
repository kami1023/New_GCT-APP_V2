import React from 'react';
import { Invoice, Purchaser, InvoiceItem } from '../types';
import { numberToWords, formatCurrency } from '../utils';
import { format } from 'date-fns';

interface InvoiceTemplateProps {
  invoice: Partial<Invoice>;
  purchaser?: Purchaser;
  items: (InvoiceItem & { productName?: string })[];
  previewRef?: React.RefObject<HTMLDivElement>;
  settings?: Record<string, string>;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, purchaser, items, previewRef, settings }) => {
  const gstRate = parseFloat(settings?.gst_rate || '9');
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (gstRate / 100);
  const grandTotal = subtotal + (tax * 2);

  // Fill empty rows to maintain template height
  const emptyRows = Array.from({ length: Math.max(0, 8 - items.length) });

  return (
    <div 
      ref={previewRef}
      className="bg-white w-[210mm] min-h-[280mm] p-[5mm] mx-auto shadow-2xl text-[10px] font-sans text-black leading-tight print:shadow-none print:m-0 print:min-h-0"
      style={{ fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-xl font-bold tracking-[0.2em] mb-0.5">{settings?.company_name || 'GANESH CLEAN – TECH'}</h1>
        <p className="text-[9px] mb-0.5">{settings?.company_address || 'Door No. 2 / 561, Plot A-7, 2nd Cross, Nandhavanam Phase III, Hosur — 635109'}</p>
        <p className="text-[9px]">E-mail: {settings?.company_email || 'ganeshcleantech@gmail.com'}   Mobile: {settings?.company_mobile || '9782875319'}</p>
      </div>

      <div className="text-center border-y border-black py-1 mb-2">
        <h2 className="text-[11px] font-bold tracking-widest uppercase">Tax Invoice Cum Delivery Challan</h2>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 border-b border-black mb-0">
        <div className="border-r border-black p-1.5 min-h-[80px]">
          <p className="font-bold mb-0.5">To</p>
          {purchaser ? (
            <div className="space-y-0.5">
              <p className="font-bold uppercase text-[11px]">{purchaser.name}</p>
              <p className="whitespace-pre-wrap text-[9px]">{purchaser.address}</p>
              {purchaser.gstin && <p className="text-[9px]">GSTIN: {purchaser.gstin}</p>}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-300 italic">
              Select or enter purchaser details
            </div>
          )}
        </div>
        <div className="divide-y divide-black text-[9px]">
          <div className="grid grid-cols-2 p-0.5 px-1">
            <span className="">Invoice Number:</span>
            <span className="font-bold">{invoice.invoice_no || '-'}</span>
          </div>
          <div className="grid grid-cols-2 p-0.5 px-1">
            <span className="">Dated:</span>
            <span className="font-bold">{invoice.date ? format(new Date(invoice.date), 'dd-MM-yyyy') : '-'}</span>
          </div>
          <div className="grid grid-cols-2 p-0.5 px-1">
            <span className="">Buyer Order Number:</span>
            <span className="font-bold">{invoice.buyer_order_no || '-'}</span>
          </div>
          <div className="grid grid-cols-2 p-0.5 px-1">
            <span className="">Delivery Terms:</span>
            <span className="font-bold">{invoice.delivery_terms || '-'}</span>
          </div>
          <div className="grid grid-cols-2 p-0.5 px-1">
            <span className="">Mode / Payment Terms:</span>
            <span className="font-bold">{invoice.payment_mode || '-'}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-x border-black border-b border-black table-fixed text-[9px]">
        <thead>
          <tr className="bg-black text-white text-[8px] uppercase tracking-wider">
            <th className="w-8 border-r border-white py-0.5">Sl.No</th>
            <th className="border-r border-white py-0.5">Description of Goods</th>
            <th className="w-14 border-r border-white py-0.5">Quantity</th>
            <th className="w-14 border-r border-white py-0.5">Rate</th>
            <th className="w-10 border-r border-white py-0.5">Per</th>
            <th className="w-18 py-0.5">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {items.map((item, idx) => (
            <tr key={idx} className="text-center h-6">
              <td className="border-r border-black">{idx + 1}</td>
              <td className="border-r border-black text-left px-1.5 font-bold">{item.product_id}</td>
              <td className="border-r border-black">{item.quantity}</td>
              <td className="border-r border-black">{item.rate.toFixed(2)}</td>
              <td className="border-r border-black">Nos</td>
              <td className="font-bold">{(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
          {emptyRows.map((_, idx) => (
            <tr key={`empty-${idx}`} className="h-6">
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-black">
          <tr className="h-6">
            <td colSpan={2} className="border-r border-black px-1.5 py-0.5 font-bold">SUB TOTAL</td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="text-center font-bold">{subtotal.toFixed(2)}</td>
          </tr>
          <tr className="h-6">
            <td colSpan={2} className="border-r border-black px-1.5 py-0.5">SGST {settings?.gst_rate || '9'}%</td>
            <td colSpan={3} className="border-r border-black text-right px-1.5">{settings?.gst_rate || '9'}%</td>
            <td className="text-center">{tax.toFixed(2)}</td>
          </tr>
          <tr className="h-6">
            <td colSpan={2} className="border-r border-black px-1.5 py-0.5">CGST {settings?.gst_rate || '9'}%</td>
            <td colSpan={3} className="border-r border-black text-right px-1.5">{settings?.gst_rate || '9'}%</td>
            <td className="text-center">{tax.toFixed(2)}</td>
          </tr>
          <tr className="bg-zinc-50 font-bold border-t border-black h-6">
            <td colSpan={2} className="border-r border-black px-1.5 py-0.5 uppercase">Grand Total</td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="text-center">{grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <div className="mt-2 space-y-2">
        <div className="border-b border-black pb-1">
          <p className="font-bold text-[8px] uppercase">Amount Chargeable (in words):</p>
          <p className="font-bold mt-0.5 text-[9px]">{numberToWords(Math.round(grandTotal))}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[8px]">
          <div className="space-y-0.5">
            <p className="font-bold">GSTIN : {settings?.company_gstin || '33BDNPK5802K1ZF'}</p>
            <p>COMPANY'S VAT TIN NO: {settings?.company_vat_tin || '33403368051 / DT.12.06.2014'}</p>
            <p>COMPANY'S CST NO: {settings?.company_cst_no || '1821143 / DT.12.06.2014'}</p>
            <div className="flex gap-2 items-center">
              <span>BUYERS VAT TIN NO:</span>
              <div className="border-b border-zinc-300 flex-1 h-2.5"></div>
            </div>
            <div className="flex gap-2 items-center">
              <span>BUYERS CST NO:</span>
              <div className="border-b border-zinc-300 flex-1 h-2.5"></div>
            </div>
            <div className="pt-3">
              <p className="uppercase font-bold">Customer's Seal & Signature</p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-between">
            <div>
              <p className="font-bold italic">for <span className="not-italic uppercase">{settings?.company_name || 'Ganesh Clean Tech'}</span></p>
            </div>
            <div className="pt-6">
              <p className="font-bold uppercase">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
