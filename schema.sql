CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | paid | checkout_failed | refunded
  email TEXT NOT NULL,
  cart_json TEXT NOT NULL,                  -- [{ id, name, size, price, qty }, ...]
  shipping_json TEXT NOT NULL,              -- { name, line1, line2, city, state, zip, country }
  total_cents INTEGER NOT NULL,
  paystack_reference TEXT,                  -- Paystack transaction reference, set once paid
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

