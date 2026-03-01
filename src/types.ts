export interface Product {
  id: string;
  name: string;
  stock_level: number;
  price: number;
}

export interface Purchaser {
  id: number;
  name: string;
  gstin: string;
  address: string;
  contact_person: string;
}

export interface InvoiceItem {
  product_id: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id?: number;
  invoice_no: string;
  date: string;
  purchaser_id: number;
  purchaser_name?: string;
  subtotal: number;
  sgst: number;
  cgst: number;
  grand_total: number;
  payment_mode: string;
  dispatched_through: string;
  buyer_order_no: string;
  delivery_terms: string;
  status?: 'Pending' | 'Paid' | 'Partial';
  amount_paid?: number;
  items?: InvoiceItem[];
}
