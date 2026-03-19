import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import Groq from "groq-sdk";
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  if (firebaseConfig.projectId) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log('Firebase Admin initialized for project:', firebaseConfig.projectId);
  }
}

const db = new Database("ganesh_cleantech.db");

// Cloud Sync Helpers
const firestore = admin.apps.length > 0 ? admin.firestore() : null;

async function syncToCloud(collectionName: string, id: string, data: any) {
  if (!firestore) return;
  try {
    // Remove null/undefined values for Firestore
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
    );
    await firestore.collection(collectionName).doc(id).set(cleanData);
  } catch (error) {
    console.error(`Error syncing ${collectionName}/${id} to cloud:`, error);
  }
}

async function deleteFromCloud(collectionName: string, id: string) {
  if (!firestore) return;
  try {
    await firestore.collection(collectionName).doc(id).delete();
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${id} from cloud:`, error);
  }
}

// Initial Sync from Cloud if SQLite is empty
async function restoreFromCloud() {
  if (!firestore) return;
  
  const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
  if (productsCount.count === 0) {
    console.log('SQLite is empty, attempting to restore from Firestore...');
    
    // Restore Products
    const productsSnapshot = await firestore.collection('products').get();
    const insertProduct = db.prepare('INSERT INTO products (id, name, stock_level, price) VALUES (?, ?, ?, ?)');
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      insertProduct.run(doc.id, data.name, data.stock_level, data.price);
    });

    // Restore Stock Logs
    const logsSnapshot = await firestore.collection('stock_logs').get();
    const insertLog = db.prepare('INSERT INTO stock_logs (product_id, change, reason, timestamp) VALUES (?, ?, ?, ?)');
    logsSnapshot.forEach(doc => {
      const data = doc.data();
      insertLog.run(data.product_id, data.change, data.reason, data.timestamp);
    });
    
    console.log('Restore complete.');
  } else {
    // If SQLite has data, sync it TO cloud (one-way sync for now to ensure cloud is up to date)
    console.log('SQLite has data, ensuring cloud is in sync...');
    const products = db.prepare('SELECT * FROM products').all() as any[];
    for (const p of products) {
      await syncToCloud('products', p.id, p);
    }
    const logs = db.prepare('SELECT * FROM stock_logs').all() as any[];
    for (const l of logs) {
      await syncToCloud('stock_logs', l.id.toString(), l);
    }
  }
}

restoreFromCloud().catch(console.error);

// Lazy Groq initialization to prevent crash if key is missing
let groq: Groq | null = null;
const getGroq = () => {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

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
      syncToCloud('products', id, { id, name, stock_level: 0, price: price || 125 });
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
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const updateStock = db.transaction(() => {
        db.prepare("UPDATE products SET stock_level = stock_level + ? WHERE id = ?").run(change, id);
        const logResult = db.prepare("INSERT INTO stock_logs (product_id, change, reason) VALUES (?, ?, ?)").run(id, change, reason);
        return { logId: logResult.lastInsertRowid };
      });
      
      const { logId } = updateStock();
      
      // Sync updated product and new log to cloud
      const updatedProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
      syncToCloud('products', id, updatedProduct);
      
      const newLog = db.prepare("SELECT * FROM stock_logs WHERE id = ?").get(logId) as any;
      syncToCloud('stock_logs', logId.toString(), newLog);

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
      const updatedProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
      syncToCloud('products', id, updatedProduct);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const targetId = id.trim();
    console.log(`[DELETE REQUEST] Product ID: "${id}", Trimmed: "${targetId}"`);
    
    try {
      // 1. Find the actual ID in the database
      let product = db.prepare("SELECT id FROM products WHERE id = ?").get(targetId) as { id: string } | undefined;
      
      if (!product) {
        console.log(`[DELETE] Exact match failed for "${targetId}", trying fuzzy...`);
        product = db.prepare("SELECT id FROM products WHERE LOWER(TRIM(id)) = LOWER(TRIM(?))").get(targetId) as { id: string } | undefined;
      }
      
      if (!product) {
        console.log(`[DELETE] Fuzzy match failed, trying LIKE...`);
        product = db.prepare("SELECT id FROM products WHERE id LIKE ?").get(`%${targetId}%`) as { id: string } | undefined;
      }
      
      if (!product) {
        const all = db.prepare("SELECT id FROM products").all();
        console.log(`[DELETE] Product not found: "${targetId}". Available:`, all.map((p: any) => p.id));
        return res.status(404).json({ 
          error: `Product "${targetId}" not found in database.`,
          availableIds: all.map((p: any) => p.id)
        });
      }

      const actualId = product.id;
      console.log(`[DELETE] Found actual ID: "${actualId}". Proceeding with deletion...`);

      // Use a more aggressive deletion strategy
      let results;
      try {
        // Set PRAGMA outside transaction
        db.exec("PRAGMA foreign_keys = OFF");
        
        results = db.transaction(() => {
          const items = db.prepare("DELETE FROM invoice_items WHERE product_id = ?").run(actualId);
          const logs = db.prepare("DELETE FROM stock_logs WHERE product_id = ?").run(actualId);
          const prod = db.prepare("DELETE FROM products WHERE id = ?").run(actualId);
          
          return { 
            itemsDeleted: items.changes, 
            logsDeleted: logs.changes, 
            productDeleted: prod.changes 
          };
        })();
        
        db.exec("PRAGMA foreign_keys = ON");
      } catch (err: any) {
        console.error(`[DELETE TRANSACTION ERROR]`, err);
        // Fallback: try one by one without transaction
        db.exec("PRAGMA foreign_keys = OFF");
        const items = db.prepare("DELETE FROM invoice_items WHERE product_id = ?").run(actualId);
        const logs = db.prepare("DELETE FROM stock_logs WHERE product_id = ?").run(actualId);
        const prod = db.prepare("DELETE FROM products WHERE id = ?").run(actualId);
        db.exec("PRAGMA foreign_keys = ON");
        
        results = { 
          itemsDeleted: items.changes, 
          logsDeleted: logs.changes, 
          productDeleted: prod.changes,
          fallbackUsed: true
        };
      }

      console.log(`[DELETE SUCCESS] Results for "${actualId}":`, results);
      
      if (results.productDeleted === 0) {
        return res.status(500).json({ error: "Database reported 0 rows deleted for the product itself." });
      }

      // Sync deletion to cloud
      deleteFromCloud('products', actualId);
      // Note: We'd ideally also delete related logs from cloud, but for now we'll focus on the main entity
      
      res.json({ success: true, details: results });
    } catch (error: any) {
      console.error(`[DELETE FATAL ERROR]`, error);
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
        // Sync to cloud: This is harder for 'all', maybe just clear the collection if possible
        // For now, we'll let it be.
      } else if (Array.isArray(ids)) {
        if (ids.length === 0) return res.json({ success: true, changes: 0 });
        
        // Ensure IDs are numbers
        const numericIds = ids.map(id => Number(id)).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.json({ success: true, changes: 0 });

        const placeholders = numericIds.map(() => "?").join(",");
        const result = db.prepare(`DELETE FROM stock_logs WHERE id IN (${placeholders})`).run(...numericIds);
        changes = result.changes;

        // Sync deletions to cloud
        numericIds.forEach(id => deleteFromCloud('stock_logs', id.toString()));
      }
      
      console.log(`[LOG DELETE SUCCESS] Deleted ${changes} logs.`);
      res.json({ success: true, changes });
    } catch (error: any) {
      console.error(`[LOG DELETE ERROR]`, error);
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
    const id = info.lastInsertRowid.toString();
    syncToCloud('purchasers', id, { id, name, gstin, address, contact_person });
    res.json({ id });
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
        const itemInfo = insertItem.run(invoiceId, item.product_id, item.quantity, item.rate, amount);
        updateStock.run(item.quantity, item.product_id);
        const logInfo = logStock.run(item.product_id, -item.quantity, `Invoice #${invoice_no}`);
        
        // Sync product and log to cloud
        const updatedProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(item.product_id) as any;
        syncToCloud('products', item.product_id, updatedProduct);
        
        const newLog = db.prepare("SELECT * FROM stock_logs WHERE id = ?").get(logInfo.lastInsertRowid) as any;
        syncToCloud('stock_logs', logInfo.lastInsertRowid.toString(), newLog);
        
        // Sync invoice item to cloud
        const newItem = db.prepare("SELECT * FROM invoice_items WHERE id = ?").get(itemInfo.lastInsertRowid) as any;
        syncToCloud('invoice_items', itemInfo.lastInsertRowid.toString(), newItem);
      }

      return invoiceId;
    });

    try {
      const id = createInvoice();
      const newInvoice = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id) as any;
      syncToCloud('invoices', id.toString(), newInvoice);
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
      LEFT JOIN products p ON l.product_id = p.id 
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
        syncToCloud('settings', key, { key, value });
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // AI Proxy
  app.post("/api/ai/recommendation", async (req, res) => {
    const { prompt } = req.body;
    const groqClient = getGroq();
    if (!groqClient) {
      return res.status(500).json({ error: "GROQ_API_KEY not configured in environment" });
    }
    try {
      const chatCompletion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      res.json({ text: chatCompletion.choices[0]?.message?.content });
    } catch (error: any) {
      console.error("[AI ERROR]", error);
      res.status(500).json({ error: error.message });
    }
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
