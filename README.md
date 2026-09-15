# Lingerie store — cart + Lemon Squeezy checkout on Cloudflare Pages

## Structure

```
src/
  main.jsx            entry point
  App.jsx             route table only — no UI logic lives here
  pages/               one file per route
    HomePage.jsx        /            product grid
    ProductPage.jsx      /product/:id  size select, add to cart
    CartPage.jsx          /cart        review + edit quantities
    CheckoutPage.jsx      /checkout    shipping form, calls Lemon Squeezy
  components/          reusable, presentational pieces used by pages
    Layout.jsx           header/nav + cart count, wraps every page
    ProductCard.jsx
    CartItem.jsx
    ShippingForm.jsx
  store/
    cart.js             the only piece of global state (Zustand + localStorage)
  data/
    products.js          placeholder catalog — swap for your real source
  lib/
    checkout.js          fetch() wrapper that calls /api/checkout
functions/api/          Cloudflare Pages Functions (server-side)
  checkout.js
  webhook.js
```

Routing is `react-router` (the current package — `react-router-dom` was folded into
it; don't reach for that name in new code). Rule of thumb as this grows: a `pages/*`
file owns a URL and composes components, it doesn't contain markup that's reused
elsewhere; anything reused across two or more pages becomes a `components/*` file;
any state more than one page needs to read goes in `store/`, not local `useState`.
Adding a route (e.g. an order-confirmation page) means one new file in `pages/` and
one new `<Route>` in `App.jsx` — nothing else changes.

**Requires Node 22+** locally and in your Cloudflare Pages build environment
(Settings → Environment variables → `NODE_VERSION=22`) — that's the baseline for
Vite 8 and React Router 8.

## How this fits together

- **Cart** lives entirely in the browser (`src/store/cart.js`, Zustand + localStorage). No backend involved.
- **Checkout** (`functions/api/checkout.js`) is a Cloudflare Pages Function. It writes a
  `pending` row to D1 for the order, then creates a single Lemon Squeezy checkout for the
  cart's total, using your one pre-made variant and passing `order_ref` (our order id) as
  Lemon Squeezy custom checkout data. This is the standard workaround for Lemon Squeezy's
  one-item-per-checkout limit and lack of native shipping fields.
- **Webhook** (`functions/api/webhook.js`) verifies the `X-Signature` header, reads
  `meta.custom_data.order_ref` from the `order_created` event, marks that order `paid` in
  D1, and emails you the order + shipping details to fulfill manually (via Resend — swap
  for any transactional email API).

## One-time setup

1. **Lemon Squeezy**
   - Create the one variant this store will reuse for every checkout (you said you've
     already got this — grab its variant ID and your store ID from the dashboard).
   - Settings → Webhooks → add an endpoint pointing at
     `https://your-site.pages.dev/api/webhook`, subscribed to `order_created`
     (and `order_refunded` if you want refunds tracked). Copy the signing secret.

2. **Cloudflare D1**
   ```bash
   npx wrangler d1 create lingerie-store-db
   # copy the database_id it prints into wrangler.toml
   npx wrangler d1 execute lingerie-store-db --file=./schema.sql --remote
   ```
   Then in the Pages project dashboard → Settings → Functions → D1 database bindings,
   bind variable name `DB` to that database (needed for production; wrangler.toml only
   covers local dev).

3. **Environment variables** — in the Pages dashboard → Settings → Environment variables,
   add everything listed in `.env.example` as encrypted secrets (production and preview).
   Set `LEMONSQUEEZY_TEST_MODE=true` while using Lemon Squeezy test-mode credentials, and
   change it to `false` only after you intentionally switch to live credentials.

4. **Resend (or your email provider of choice)** — create an API key, verify your sending
   domain, drop the key into `RESEND_API_KEY`.

## Local development

```bash
npm install
npm run build
npm run pages:dev   # serves dist/ + functions/ with D1 bound locally
```

Use Lemon Squeezy's test mode and their webhook simulator (dashboard → Webhooks → your
endpoint → Send test event) to fire an `order_created` event at your local tunnel or a
deployed preview URL without needing a real payment.

## Deploy

Connect the repo in the Cloudflare Pages dashboard (build command `npm run build`, output
directory `dist`) or run `npx wrangler pages deploy dist`. Static assets are unmetered on
the free tier; `/api/*` calls draw from the Workers free quota (100k requests/day), which a
small store won't come close to.

## Next steps

- Replace the placeholder `PRODUCTS` array in `src/data/products.js` with your real
  catalog (static JSON is fine, or a `/api/products` Function backed by D1 if you want
  to edit stock without redeploying).
- The current UI is intentionally unstyled — happy to help design the actual storefront
  (product grid, product pages, cart drawer) as a separate pass.
- Consider an `order_refunded` → notify-yourself flow if refunds are likely.
