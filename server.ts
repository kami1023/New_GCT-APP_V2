import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("ganesh_cleantech.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stock_level INTEGER DEFAULT 0,
    price REAL DEFAULT 125.0
  );

  CREATE TABLE IF NOT EXISTS purchasers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gstin TEXT,
    address TEXT,
    contact_person TEXT
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT UNIQUE NOT NULL,
    date TEXT NOT NULL,
    purchaser_id INTEGER,
    subtotal REAL,
    sgst REAL,
    cgst REAL,
    grand_total REAL,
    payment_mode TEXT,
    dispatched_through TEXT,
    buyer_order_no TEXT,
    delivery_terms TEXT,
    status TEXT DEFAULT 'Pending',
    amount_paid REAL DEFAULT 0,
    FOREIGN KEY (purchaser_id) REFERENCES purchasers(id)
  );

  CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    product_id TEXT,
    quantity INTEGER,
    rate REAL,
    amount REAL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS stock_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    change INTEGER,
    reason TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Initialize default settings
const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
insertSetting.run('company_name', 'GANESH CLEAN – TECH');

// Migration for payment tracking
try {
  db.prepare("ALTER TABLE invoices ADD COLUMN status TEXT DEFAULT 'Pending'").run();
  db.prepare("ALTER TABLE invoices ADD COLUMN amount_paid REAL DEFAULT 0").run();
} catch (e) {
  // Columns likely already exist
}
insertSetting.run('company_address', 'Door No. 2 / 561, Plot A-7, 2nd Cross, Nandhavanam Phase III, Hosur — 635109');
insertSetting.run('company_email', 'ganeshcleantech@gmail.com');
insertSetting.run('company_mobile', '9782875319');
insertSetting.run('company_gstin', '33BDNPK5802K1ZF');
insertSetting.run('company_vat_tin', '33403368051 / DT.12.06.2014');
insertSetting.run('company_cst_no', '1821143 / DT.12.06.2014');
insertSetting.run('gst_rate', '9'); // 9% SGST + 9% CGST = 18% total
insertSetting.run('bg_media_url', '');
insertSetting.run('bg_media_type', 'image'); // 'image' or 'video'

// Clean up temp products if they exist
db.prepare("DELETE FROM products WHERE id LIKE 'TEMP-%'").run();

// Seed initial products
const insertProduct = db.prepare("INSERT OR IGNORE INTO products (id, name, stock_level) VALUES (?, ?, ?)");
// Original MK Series
for (let i = 1; i <= 6; i++) {
  insertProduct.run(`MK${i}`, `MK Series ${i}`, 0);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Products
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { id, name, price } = req.body;
    try {
      db.prepare("INSERT INTO products (id, name, stock_level, price) VALUES (?, ?, ?, ?)").run(id, name, 0, price || 125);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id/stock", (req, res) => {
    const { id } = req.params;
    const { change, reason } = req.body;
    
    if (typeof change !== 'number') {
      return res.status(400).json({ error: "Change must be a number" });
    }

    try {
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const updateStock = db.transaction(() => {
        db.prepare("UPDATE products SET stock_level = stock_level + ? WHERE id = ?").run(change, id);
        db.prepare("INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)").run(id, change, reason);
      });
      
      updateStock();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id/price", (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    
    if (typeof price !== 'number') {
      return res.status(400).json({ error: "Price must be a number" });
    }

    try {
      db.prepare("UPDATE products SET price = ? WHERE id = ?").run(price, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const targetId = id.trim();
    console.log(`[DELETE REQUEST] Received ID: "${id}", Trimmed: "${targetId}"`);
    
    try {
      // 1. Try exact match
      let product = db.prepare("SELECT id FROM products WHERE id = ?").get(targetId) as { id: string } | undefined;
      
      // 2. Try case-insensitive trimmed match
      if (!product) {
        console.log(`[DELETE] Exact match failed for "${targetId}", trying fuzzy...`);
        product = db.prepare("SELECT id FROM products WHERE LOWER(TRIM(id)) = LOWER(TRIM(?))").get(targetId) as { id: string } | undefined;
      }
      
      // 3. Try LIKE match as a last resort
      if (!product) {
        console.log(`[DELETE] Fuzzy match failed, trying LIKE...`);
        product = db.prepare("SELECT id FROM products WHERE id LIKE ?").get(`%${targetId}%`) as { id: string } | undefined;
      }
      
      if (!product) {
        console.log(`[DELETE] Product not found at all: "${targetId}"`);
        const all = db.prepare("SELECT id FROM products").all();
        console.log(`[DELETE] Current IDs in DB:`, all.map((p: any) => `"${p.id}"`));
        return res.status(404).json({ error: `Product "${targetId}" not found. Available IDs: ${all.map((p: any) => p.id).join(', ')}` });
      }

      const actualId = product.id;
      console.log(`[DELETE] Final ID to delete: "${actualId}"`);

      const performDelete = db.transaction(() => {
        // Try standard deletion first
        const items = db.prepare("DELETE FROM invoice_items WHERE product_id = ?").run(actualId);
        const logs = db.prepare("DELETE FROM stock_logs WHERE product_id = ?").run(actualId);
        const prod = db.prepare("DELETE FROM products WHERE id = ?").run(actualId);
        
        return { items: items.changes, logs: logs.changes, product: prod.changes };
      });

      let results;
      try {
        results = performDelete();
      } catch (transError: any) {
        console.warn(`[DELETE] Transaction failed, trying PRAGMA fallback:`, transError);
        // Fallback: Disable foreign keys and delete manually
        db.exec("PRAGMA foreign_keys = OFF");
        const items = db.prepare("DELETE FROM invoice_items WHERE product_id = ?").run(actualId);
        const logs = db.prepare("DELETE FROM stock_logs WHERE product_id = ?").run(actualId);
        const prod = db.prepare("DELETE FROM products WHERE id = ?").run(actualId);
        db.exec("PRAGMA foreign_keys = ON");
        results = { items: items.changes, logs: logs.changes, product: prod.changes, fallback: true };
      }
      console.log(`[DELETE SUCCESS]`, results);
      res.json({ success: true, details: results });
    } catch (error: any) {
      console.error(`[DELETE ERROR]`, error);
      res.status(500).json({ error: `Server Error: ${error.message}` });
    }
  });

  app.post("/api/stock-logs/delete", (req, res) => {
    const { ids } = req.body;
    console.log(`[LOG DELETE] Request for:`, ids);
    try {
      let changes = 0;
      if (ids === 'all') {
        const result = db.prepare("DELETE FROM stock_logs").run();
        changes = result.changes;
      } else if (Array.isArray(ids)) {
        const placeholders = ids.map(() => "?").join(",");
        const result = db.prepare(`DELETE FROM stock_logs WHERE id IN (${placeholders})`).run(...ids);
        changes = result.changes;
      }
      console.log(`[LOG DELETE] Success, removed ${changes} rows`);
      res.json({ success: true, changes });
    } catch (error: any) {
      console.error(`[LOG DELETE] Error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Purchasers
  app.get("/api/purchasers", (req, res) => {
    const purchasers = db.prepare("SELECT * FROM purchasers").all();
    res.json(purchasers);
  });

  app.post("/api/purchasers", (req, res) => {
    const { name, gstin, address, contact_person } = req.body;
    const info = db.prepare("INSERT INTO purchasers (name, gstin, address, contact_person) VALUES (?, ?, ?, ?)").run(name, gstin, address, contact_person);
    res.json({ id: info.lastInsertRowid });
  });

  // Invoices
  app.get("/api/invoices", (req, res) => {
    const invoices = db.prepare(`
      SELECT i.*, p.name as purchaser_name 
      FROM invoices i 
      LEFT JOIN purchasers p ON i.purchaser_id = p.id
      ORDER BY i.date DESC, i.invoice_no DESC
    `).all();
    res.json(invoices);
  });

  app.patch("/api/invoices/:id/payment", (req, res) => {
    const { id } = req.params;
    const { status, amount_paid } = req.body;
    try {
      db.prepare("UPDATE invoices SET status = ?, amount_paid = ? WHERE id = ?").run(status, amount_paid, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/invoices", (req, res) => {
    const { 
      invoice_no, date, purchaser_id, items, 
      payment_mode, dispatched_through, buyer_order_no, delivery_terms 
    } = req.body;

    const createInvoice = db.transaction(() => {
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
      const tax = subtotal * 0.09;
      const grand_total = subtotal + (tax * 2);

      const info = db.prepare(`
        INSERT INTO invoices (
          invoice_no, date, purchaser_id, subtotal, sgst, cgst, grand_total,
          payment_mode, dispatched_through, buyer_order_no, delivery_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(invoice_no, date, purchaser_id, subtotal, tax, tax, grand_total, payment_mode, dispatched_through, buyer_order_no, delivery_terms);

      const invoiceId = info.lastInsertRowid;
      const insertItem = db.prepare("INSERT INTO invoice_items (invoice_id, product_id, quantity, rate, amount) VALUES (?, ?, ?, ?, ?)");
      const updateStock = db.prepare("UPDATE products SET stock_level = stock_level - ? WHERE id = ?");
      const logStock = db.prepare("INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)");

      for (const item of items) {
        const amount = item.quantity * item.rate;
        insertItem.run(invoiceId, item.product_id, item.quantity, item.rate, amount);
        updateStock.run(item.quantity, item.product_id);
        logStock.run(item.product_id, -item.quantity, `Invoice #${invoice_no}`);
      }

      return invoiceId;
    });

    try {
      const id = createInvoice();
      res.json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/invoices/:id/items", (req, res) => {
    const { id } = req.params;
    const items = db.prepare("SELECT * FROM invoice_items WHERE invoice_id = ?").all(id);
    res.json(items);
  });

  // Stock Logs
  app.get("/api/stock-logs", (req, res) => {
    const logs = db.prepare(`
      SELECT l.*, p.name as product_name 
      FROM stock_logs l 
      JOIN products p ON l.product_id = p.id 
      ORDER BY l.timestamp DESC
    `).all();
    res.json(logs);
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const updateSetting = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateSetting.run(key, value);
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
