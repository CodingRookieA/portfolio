# PostFolio

A PostgreSQL-backed stock portfolio manager built primarily as a **SQL / database engineering showcase**. The Express + vanilla-JS frontend is intentionally thin — the interesting work lives in the schema design and in the analytical SQL that powers trading, risk metrics, and forecasting.

The name is a portmanteau of **Postgres** + **Portfolio**.

> **Focus of this project:** demonstrate idiomatic, non-trivial PostgreSQL — window functions, CTEs, aggregate analytics (`COVAR_POP`, `VAR_POP`, `STDDEV_POP`), `DISTINCT ON`, conflict-aware upserts, composite keys, and cascade-aware referential integrity — applied to a real financial domain.

---

## SQL highlights

Each of the following is a real query from this codebase, used to power a feature in the UI.

### 1. Per-stock **Beta** vs. a synthesized market — CTEs + window functions

For a chosen window, compute each day's stock return with `LAG`, build a *market return* as the cross-sectional average of all symbols' daily returns, join the two series, then derive Beta as `COVAR_POP(r_s, r_m) / VAR_POP(r_m)`.

```sql
WITH StockReturns AS (
    SELECT
        symbol,
        timestamp,
        (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))
            / NULLIF(LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp), 0)
            AS stock_return
    FROM Stocks
    WHERE symbol = $1
      AND timestamp BETWEEN $2 AND $3
),
AllReturns AS (
    SELECT
        symbol,
        timestamp,
        (close - LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp))
            / NULLIF(LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp), 0)
            AS daily_return
    FROM Stocks
    WHERE timestamp BETWEEN $2 AND $3
),
MarketReturns AS (
    SELECT timestamp, AVG(daily_return) AS market_return
    FROM AllReturns
    GROUP BY timestamp
),
JoinedReturns AS (
    SELECT sr.stock_return, mr.market_return
    FROM StockReturns sr
    JOIN MarketReturns mr USING (timestamp)
    WHERE sr.stock_return IS NOT NULL
      AND mr.market_return IS NOT NULL
)
SELECT COVAR_POP(stock_return, market_return)
     / NULLIF(VAR_POP(market_return), 0) AS beta
FROM JoinedReturns;
```

**SQL techniques on display:** four chained CTEs, `LAG ... OVER (PARTITION BY ... ORDER BY ...)`, `NULLIF` to defuse divide-by-zero, `USING` joins, and built-in statistical aggregates.

### 2. Portfolio **covariance matrix** — symbol-pair CTEs + `COVAR_POP`

For each pair of symbols `(i, j)` held in a portfolio, align timestamps and compute the population covariance; the diagonal uses `VAR_POP`.

```sql
WITH S1 AS (
    SELECT close AS close1, timestamp
    FROM Stocks
    WHERE symbol = $1
      AND timestamp BETWEEN $3 AND $4
), S2 AS (
    SELECT close AS close2, timestamp
    FROM Stocks
    WHERE symbol = $2
      AND timestamp BETWEEN $3 AND $4
), Matched AS (
    SELECT S1.close1, S2.close2
    FROM S1
    JOIN S2 ON S1.timestamp = S2.timestamp
)
SELECT COVAR_POP(close1, close2) AS covariance
FROM Matched;
```

```sql
SELECT VAR_POP(close) AS variance
FROM Stocks
WHERE symbol = $1
  AND timestamp BETWEEN $2 AND $3;
```

The application fills the full symmetric matrix by only computing the upper triangle and mirroring it — half the queries, same result.

### 3. **Coefficient of Variation** — single-statement σ / μ

```sql
SELECT std.result
     / (SELECT AVG(close)
        FROM Stocks
        WHERE symbol = $1
          AND timestamp BETWEEN $2 AND $3) AS cov
FROM (
    SELECT STDDEV_POP(close) AS result
    FROM Stocks
    WHERE symbol = $1
      AND timestamp BETWEEN $2 AND $3
) AS std;
```

The source includes a comment with a **deliberately denormalized** earlier version of this query (nested manual variance computation) so you can compare it against the optimized form using Postgres's built-in `STDDEV_POP`. See `routes/stock.mjs`.

### 4. Latest close per symbol — `DISTINCT ON`

A clean Postgres-idiomatic alternative to the classic "max-per-group" join.

```sql
SELECT DISTINCT ON (symbol)
       symbol,
       close AS current_price
FROM Stocks
ORDER BY symbol, timestamp DESC;
```

### 5. Conflict-aware **UPSERTs**

Buying a stock should *accumulate* shares, never overwrite them:

```sql
INSERT INTO holdings (portfolio_id, stock_symbol, shares)
VALUES ($1, $2, $3)
ON CONFLICT (portfolio_id, stock_symbol)
DO UPDATE SET shares = holdings.shares + EXCLUDED.shares;
```

The forecast cache uses the same pattern to memoize predictions per `(symbol, timestamp)`:

```sql
INSERT INTO predic (timestamp, close, symbol)
VALUES ($1, $2, $3)
ON CONFLICT (symbol, timestamp)
DO UPDATE SET close = EXCLUDED.close;
```

### 6. Schema design

- **Identity columns** (`GENERATED ALWAYS AS IDENTITY`) instead of legacy `SERIAL`.
- **Composite primary keys** where they reflect domain truth — `Stocks(symbol, timestamp)`, `holdings(portfolio_id, stock_symbol)`, `predic(symbol, timestamp)`.
- **Referential integrity with cascades** — deleting a user deletes their portfolios, holdings, and transactions in one shot via `ON DELETE CASCADE`.
- **Separation of facts and dimensions** — `Stocks` (immutable price history), `predic` (model output), `transactions` (append-only ledger), `holdings` / `portfolios` (mutable state).

```sql
CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL DEFAULT 'New Portfolio',
    cash_balance NUMERIC DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS holdings (
    portfolio_id INTEGER REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
    stock_symbol TEXT NOT NULL,
    shares       INTEGER DEFAULT 0,
    PRIMARY KEY (portfolio_id, stock_symbol)
);

CREATE TABLE IF NOT EXISTS Stocks (
    timestamp DATE,
    open  REAL, high REAL, low REAL, close REAL,
    volume INT,
    symbol VARCHAR(5),
    PRIMARY KEY (symbol, timestamp)
);
```

### 7. Parameterized queries everywhere

Every query in `routes/` uses `$1, $2, ...` placeholders — no string concatenation, no SQL injection surface.

---

## Application features (what the SQL is in service of)

- **Accounts & sessions** with salted PBKDF2-SHA512 password hashing.
- **Multiple portfolios per user**, each with its own cash balance and holdings.
- **Cash deposit / withdraw** with balance validation.
- **OHLCV ingestion** for arbitrary symbols and dates.
- **Buy / sell** with atomic cash + holdings updates and conflict-aware accumulation.
- **Historical close-price charts** over user-chosen windows.
- **Linear-regression price forecast** computed in Node from the last 30 closes and cached in the `predic` table for reuse.
- **Per-stock analytics page** showing Coefficient of Variation and Beta.
- **Portfolio-wide covariance matrix** across every symbol held.

---

## Tech stack

| Layer | Tech |
| -------- | -------------------------------------------------------------------------- |
| Database | **PostgreSQL 13+** — `LAG`, `VAR_POP`, `COVAR_POP`, `STDDEV_POP`, `DISTINCT ON`, `ON CONFLICT` |
| Backend | Node.js (ESM), Express 4, `express-session`, `pg` |
| Frontend | Vanilla HTML / CSS / ES modules, Chart.js (CDN) |
| Auth | `crypto.pbkdf2Sync` (SHA-512, 100k iterations) |

---

## Project structure

```
.
├── backend.mjs              # Express app, schema bootstrap (initDB), session + route wiring
├── routes/
│   ├── auth.mjs             # /api/auth – signup, login, logout, me
│   ├── portfolio.mjs        # /api/portfolio – CRUD, deposit/withdraw, covariance matrix
│   └── stock.mjs            # /api/stocks  – add/buy/sell, list, detail, history, forecast
├── static/
│   ├── login.html           # Login + signup tabs
│   ├── main.html            # Dashboard: portfolios, trading, covariance matrix
│   ├── stocks.html          # Browse all known symbols
│   ├── detail.html          # Per-stock COV + Beta + history + forecast charts
│   ├── js/                  # Frontend ES modules
│   └── style/               # Page-specific stylesheets
├── package.json
└── README.md
```

---

## Database schema

All tables are created automatically on startup by `initDB()` in `backend.mjs`.

| Table | Primary key | Notes |
| -------------- | --------------------------------- | ------------------------------------------------------------------ |
| `users` | `id` (identity) | `salt`, `password_hash`, unique `username` |
| `portfolios` | `portfolio_id` (identity) | FK to `users(id)` with `ON DELETE CASCADE` |
| `holdings` | `(portfolio_id, stock_symbol)` | FK to `portfolios` with cascade; cumulative `shares` |
| `transactions` | `transaction_id` (identity) | Append-only ledger: BUY / SELL / DEPOSIT / WITHDRAW |
| `Stocks` | `(symbol, timestamp)` | OHLCV bars — the source of truth for analytics |
| `predic` | `(symbol, timestamp)` | Cached forecast output, populated via `ON CONFLICT DO UPDATE` |

---

## Notes & limitations

- Database credentials and session secret are currently hard-coded — move to env vars before deploying.
- Single long-lived `pg.Client` is fine for a demo; production should use `pg.Pool`.
- The forecast model is intentionally simple (OLS on the last 30 closes). Not financial advice.
- The "market" used in the Beta calculation is the cross-sectional average of all symbols in `Stocks` for the window — ingest a representative universe for meaningful betas.
- Sessions are in-memory; restarting the server signs everyone out.
- A natural next step is to swap the per-pair covariance loop for a **single set-based query** that returns the full matrix in one round-trip (e.g. via `CROSS JOIN` over the holdings set and a grouped `COVAR_POP`).

---

## License

ISC.
