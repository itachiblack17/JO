'use strict';
/* ============================================================
   Full Stack Developer Learning Hub — app.js
   35 skills across 8 categories, all interactive.
   ============================================================ */

/* ── helpers ─────────────────────────────────────────────── */
const esc = s => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const $ = id => document.getElementById(id);
const getCompleted = () => JSON.parse(localStorage.getItem('fsh-completed') || '[]');
const saveCompleted = a => localStorage.setItem('fsh-completed', JSON.stringify(a));
const isCompleted = id => getCompleted().includes(id);

/* ── skill data ──────────────────────────────────────────── */
const CATEGORIES = [
  /* ── 1. FRONTEND ──────────────────────────── */
  {
    id: 'frontend', label: 'Frontend', icon: '⟨/⟩',
    color: '#e2430a', dotClass: 'dot-frontend',
    desc: 'Build fast, accessible, beautiful UIs.',
    skills: [
      {
        id: 'html-semantics', title: 'Semantic HTML & Accessibility',
        desc: 'Use meaningful tags (<article>, <nav>, <main>) and ARIA attributes so browsers, search engines, and assistive tech understand your content.',
        lang: 'html',
        code:
`<article>
  <header>
    <h1>Post Title</h1>
    <time datetime="2024-03-01">Mar 1, 2024</time>
  </header>
  <section aria-label="Content">
    <p>Paragraph text…</p>
  </section>
</article>

<!-- Custom widget with ARIA -->
<div role="tablist">
  <button role="tab" aria-selected="true"
          aria-controls="panel-1">Tab 1</button>
  <div role="tabpanel" id="panel-1">Content</div>
</div>`,
      },
      {
        id: 'css-layout', title: 'CSS Layout: Flexbox & Grid',
        desc: 'Flexbox for 1-D alignment, Grid for 2-D page structure. Together they replace almost every float/table hack.',
        lang: 'css',
        code:
`/* ── Flexbox nav ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* ── CSS Grid page layout ── */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }`,
      },
      {
        id: 'js-es6', title: 'Modern JavaScript (ES6+)',
        desc: 'Arrow functions, destructuring, spread/rest, optional chaining, nullish coalescing, Promises, and async/await.',
        lang: 'js',
        code:
`// Destructuring + defaults
const { name = 'Guest', role = 'user' } = user;

// Optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Unknown';

// Async / Await with error handling
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('fetchUser failed:', err);
    return null;
  }
}

// Array methods
const admins = users
  .filter(u => u.role === 'admin')
  .map(u => ({ ...u, label: u.name.toUpperCase() }));`,
        demo: 'js-eval',
      },
      {
        id: 'typescript', title: 'TypeScript',
        desc: 'Static types, interfaces, generics, and utility types give you autocomplete, refactoring safety, and self-documenting APIs.',
        lang: 'ts',
        code:
`interface User {
  id: number;
  name: string;
  role: 'admin' | 'viewer';
  createdAt: Date;
}

// Generic repository pattern
class Repository<T extends { id: number }> {
  private items: T[] = [];
  findById(id: number): T | undefined {
    return this.items.find(i => i.id === id);
  }
  save(item: T): void { this.items.push(item); }
}

// Utility types
type UserPreview = Pick<User, 'id' | 'name'>;
type PartialUser = Partial<User>;

// Type guard
function isAdmin(user: User): user is User & { role: 'admin' } {
  return user.role === 'admin';
}`,
      },
      {
        id: 'react-concepts', title: 'React & Component Patterns',
        desc: 'Hooks (useState, useEffect, useContext, useMemo), custom hooks, composition, and state management with Context or Zustand.',
        lang: 'jsx',
        code:
`// Custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Component using the hook
function UserList() {
  const { data, loading } = useFetch('/api/users');
  if (loading) return <Spinner />;
  return (
    <ul>
      {data?.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}`,
      },
      {
        id: 'browser-apis', title: 'Browser APIs & Performance',
        desc: 'Intersection Observer, Web Workers, requestAnimationFrame, localStorage/IndexedDB, Service Workers, and the Web Vitals model.',
        lang: 'js',
        code:
`// Lazy-load images with Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('img[data-src]')
  .forEach(img => observer.observe(img));

// Smooth animation with rAF
function animate(timestamp) {
  // update state based on timestamp
  element.style.transform = \`translateX(\${x}px)\`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Cache-first service worker fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached ?? fetch(event.request))
  );
});`,
      },
    ],
  },

  /* ── 2. BACKEND ───────────────────────────── */
  {
    id: 'backend', label: 'Backend', icon: '⚙',
    color: '#16a34a', dotClass: 'dot-backend',
    desc: 'Build scalable APIs, services, and real-time systems.',
    skills: [
      {
        id: 'http-rest', title: 'HTTP Protocol & REST Design',
        desc: 'Understand methods, status codes, headers, and how to design clean, consistent RESTful APIs.',
        demo: 'rest-table',
      },
      {
        id: 'node-express', title: 'Node.js & Express',
        desc: 'Event-driven server with non-blocking I/O. Express provides routing, middleware, and a plugin ecosystem.',
        lang: 'js',
        code:
`import express from 'express';

const app = express();
app.use(express.json());

// Route handler
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);  // forward to error middleware
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    error: err.message ?? 'Internal server error',
  });
});

app.listen(3000, () => console.log('Server on :3000'));`,
      },
      {
        id: 'auth-jwt', title: 'Authentication & JWT',
        desc: 'Stateless auth with JSON Web Tokens. Sign on login, verify on every protected request. Never store secrets in the payload.',
        lang: 'js',
        code:
`import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Login — hash comparison + token issue
async function login(email, password) {
  const user = await db.users.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// Middleware — protect routes
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}`,
        demo: 'jwt-decode',
      },
      {
        id: 'middleware', title: 'Middleware & Error Handling',
        desc: 'Middleware chains let you compose cross-cutting concerns (logging, auth, rate-limiting, validation) without polluting business logic.',
        lang: 'js',
        code:
`// Logging middleware
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(\`\${req.method} \${req.url} \${res.statusCode} \${Date.now()-start}ms\`);
  });
  next();
};

// Rate limiter (simplified)
const rateLimit = (max, windowMs) => {
  const store = new Map();
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const record = store.get(key) ?? { count: 0, reset: now + windowMs };
    if (now > record.reset) { record.count = 0; record.reset = now + windowMs; }
    record.count++;
    store.set(key, record);
    if (record.count > max) return res.status(429).json({ error: 'Too many requests' });
    next();
  };
};

// Validation middleware with Zod
import { z } from 'zod';
const validate = schema => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.issues });
  req.body = result.data;
  next();
};`,
      },
      {
        id: 'websockets', title: 'WebSockets & Real-time',
        desc: 'Full-duplex TCP channel between client and server — ideal for chat, live dashboards, collaboration tools, and multiplayer games.',
        lang: 'js',
        code:
`// Server (ws library)
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === 'join') {
      ws.room = msg.room;
      rooms.set(ws.room, [...(rooms.get(ws.room) ?? []), ws]);
    }
    if (msg.type === 'chat') {
      // broadcast to room
      (rooms.get(ws.room) ?? []).forEach(client => {
        if (client.readyState === WebSocket.OPEN)
          client.send(JSON.stringify({ from: msg.user, text: msg.text }));
      });
    }
  });
});

// Client
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = ({ data }) => renderMessage(JSON.parse(data));
ws.send(JSON.stringify({ type: 'join', room: 'general' }));`,
        demo: 'ws-demo',
      },
      {
        id: 'file-streams', title: 'File I/O & Streams',
        desc: 'Process large files without loading them fully into memory using readable/writable/transform streams and the pipeline API.',
        lang: 'js',
        code:
`import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { parse } from 'csv-parse';

// Stream a CSV, transform rows, compress, write
async function processCsv(inputPath, outputPath) {
  const source = createReadStream(inputPath);
  const parser = parse({ columns: true, skip_empty_lines: true });
  const gzip   = createGzip();
  const dest   = createWriteStream(outputPath);

  let count = 0;
  parser.on('data', row => {
    count++;
    // transform each row here
  });

  await pipeline(source, parser);
  await pipeline(
    createReadStream(inputPath),
    gzip,
    dest
  );
  console.log(\`Processed \${count} rows → \${outputPath}\`);
}`,
      },
    ],
  },

  /* ── 3. DATABASES ─────────────────────────── */
  {
    id: 'databases', label: 'Databases', icon: '🗄',
    color: '#2563eb', dotClass: 'dot-databases',
    desc: 'Store, query, and scale your data reliably.',
    skills: [
      {
        id: 'sql-basics', title: 'SQL Fundamentals',
        desc: 'SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT — the building blocks of every relational query.',
        demo: 'sql-runner',
      },
      {
        id: 'sql-advanced', title: 'PostgreSQL Advanced',
        desc: 'Indexes, transactions, window functions, CTEs, EXPLAIN ANALYZE, and connection pooling with pg-pool.',
        lang: 'sql',
        code:
`-- Window function: running total per user
SELECT
  user_id,
  order_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY order_date
  ) AS running_total
FROM orders;

-- CTE: find top customers
WITH ranked AS (
  SELECT user_id, SUM(amount) AS total,
         RANK() OVER (ORDER BY SUM(amount) DESC) AS rnk
  FROM orders
  GROUP BY user_id
)
SELECT * FROM ranked WHERE rnk <= 10;

-- Partial index (only index active users)
CREATE INDEX idx_users_active_email
  ON users(email)
  WHERE is_active = true;`,
      },
      {
        id: 'mongodb', title: 'MongoDB & NoSQL',
        desc: 'Document store with flexible schema, rich query language, and aggregation pipeline for analytics.',
        lang: 'js',
        code:
`// Insert + find
await db.collection('users').insertOne({
  name: 'Alice', role: 'admin', tags: ['vip'],
  createdAt: new Date(),
});

// Query with projection
const admins = await db.collection('users')
  .find({ role: 'admin' }, { projection: { name: 1, _id: 0 } })
  .sort({ name: 1 })
  .limit(20)
  .toArray();

// Aggregation pipeline
const stats = await db.collection('orders').aggregate([
  { $match: { status: 'completed' } },
  { $group: {
      _id: '$userId',
      total: { $sum: '$amount' },
      count: { $sum: 1 },
  }},
  { $sort: { total: -1 } },
  { $limit: 10 },
]).toArray();`,
      },
      {
        id: 'redis', title: 'Redis & Caching',
        desc: 'In-memory key-value store for caching, session storage, rate limiting, pub/sub, and job queues.',
        demo: 'redis-demo',
      },
      {
        id: 'db-design', title: 'Database Design & Indexing',
        desc: 'Normalization (1NF–3NF), ERDs, foreign keys, composite indexes, and knowing when to denormalize for performance.',
        lang: 'sql',
        code:
`-- Normalized schema example
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index for common query pattern
CREATE INDEX idx_posts_user_published
  ON posts(user_id, published)
  WHERE published = true;

-- Covering index (includes all needed columns)
CREATE INDEX idx_posts_feed
  ON posts(created_at DESC)
  INCLUDE (user_id, title);`,
      },
    ],
  },

  /* ── 4. DEVOPS ────────────────────────────── */
  {
    id: 'devops', label: 'DevOps', icon: '🚀',
    color: '#7c3aed', dotClass: 'dot-devops',
    desc: 'Ship reliably with automation, containers, and cloud.',
    skills: [
      {
        id: 'git', title: 'Git & Version Control',
        desc: 'Branching strategies (GitFlow, trunk-based), interactive rebase, cherry-pick, bisect, hooks, and monorepo tools.',
        demo: 'git-demo',
      },
      {
        id: 'docker', title: 'Docker & Containers',
        desc: 'Images, layers, multi-stage builds, docker-compose, networking, volumes, and scanning for vulnerabilities.',
        demo: 'docker-layers',
      },
      {
        id: 'cicd', title: 'CI/CD Pipelines',
        desc: 'Automate test → build → deploy with GitHub Actions, GitLab CI, or Jenkins. Gate production on green tests.',
        lang: 'yaml',
        code:
`# .github/workflows/deploy.yml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_TOKEN }} | docker login -u ci --password-stdin
          docker push myapp:${{ github.sha }}
      - name: Deploy to cluster
        run: kubectl set image deployment/myapp app=myapp:${{ github.sha }}`,
      },
      {
        id: 'cloud', title: 'Cloud Platforms',
        desc: 'AWS / GCP / Azure core services: compute (EC2/Cloud Run), storage (S3/GCS), managed DBs (RDS/Cloud SQL), CDN, IAM, and serverless (Lambda/Cloud Functions).',
        lang: 'bash',
        code:
`# AWS CLI — common operations

# Upload to S3
aws s3 cp dist/ s3://my-bucket/app/ --recursive \
  --cache-control "max-age=31536000" \
  --exclude "index.html"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id EXAMPLEID \
  --paths "/*"

# Deploy Lambda
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# ECS rolling deploy
aws ecs update-service \
  --cluster production \
  --service api \
  --force-new-deployment`,
      },
      {
        id: 'linux', title: 'Linux & Shell Scripting',
        desc: 'File permissions, processes, cron jobs, SSH, grep/awk/sed, pipes, environment variables, and writing maintainable bash scripts.',
        lang: 'bash',
        code:
`#!/usr/bin/env bash
set -euo pipefail  # exit on error, undefined vars, pipe failures

# Deploy script
APP_DIR="/var/www/app"
BACKUP_DIR="/var/backups/app-\$(date +%Y%m%d-%H%M%S)"

echo "📦 Backing up current version..."
cp -r "\$APP_DIR" "\$BACKUP_DIR"

echo "⬇️  Pulling latest..."
cd "\$APP_DIR" && git pull origin main

echo "📦 Installing deps..."
npm ci --production

echo "🔄 Restarting service..."
systemctl restart myapp

# Health check with retry
for i in {1..5}; do
  if curl -sf http://localhost:3000/health; then
    echo "✅ Deploy successful"
    exit 0
  fi
  sleep 3
done

echo "❌ Health check failed — rolling back"
rm -rf "\$APP_DIR" && cp -r "\$BACKUP_DIR" "\$APP_DIR"
systemctl restart myapp
exit 1`,
      },
    ],
  },

  /* ── 5. SECURITY ──────────────────────────── */
  {
    id: 'security', label: 'Security', icon: '🔒',
    color: '#dc2626', dotClass: 'dot-security',
    desc: 'Protect your app, data, and users from attackers.',
    skills: [
      {
        id: 'owasp', title: 'OWASP Top 10',
        desc: 'The ten most critical web application security risks — understand each attack vector and its countermeasure.',
        demo: 'owasp-list',
      },
      {
        id: 'auth-security', title: 'Secure Authentication',
        desc: 'bcrypt/Argon2 password hashing, MFA (TOTP), secure session management, account lockout, and "forgot password" flows.',
        lang: 'js',
        code:
`import argon2 from 'argon2';
import { authenticator } from 'otplib';

// Hash on registration
async function hashPassword(plaintext) {
  return argon2.hash(plaintext, {
    type: argon2.argon2id,
    memoryCost: 65536,  // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

// Verify on login
async function verifyPassword(hash, plaintext) {
  return argon2.verify(hash, plaintext);
}

// TOTP — generate secret & verify code
function generateTotpSecret() {
  return authenticator.generateSecret();
}

function verifyTotp(secret, token) {
  return authenticator.check(token, secret);
}

// Account lockout (Redis-backed)
async function checkLockout(userId) {
  const attempts = await redis.get(\`lockout:\${userId}\`);
  if (attempts >= 5) throw new Error('Account temporarily locked');
  await redis.incr(\`lockout:\${userId}\`);
  await redis.expire(\`lockout:\${userId}\`, 900); // 15 min
}`,
      },
      {
        id: 'cors-csp', title: 'CORS & Content Security Policy',
        desc: 'Same-origin policy, CORS headers, preflight requests, and CSP directives that prevent XSS even when your app has bugs.',
        lang: 'js',
        code:
`// Express CORS configuration
import cors from 'cors';

app.use(cors({
  origin: (origin, cb) => {
    const allowed = ['https://app.example.com', 'https://admin.example.com'];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,  // cache preflight for 24 h
}));

// Content-Security-Policy header
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'nonce-GENERATED_NONCE'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://cdn.example.com",
    "connect-src 'self' https://api.example.com",
    "frame-ancestors 'none'",
  ].join('; '));
  next();
});`,
      },
      {
        id: 'input-validation', title: 'Input Validation & Sanitization',
        desc: 'Never trust user input. Validate at the boundary, sanitize for the output context, and parameterize all queries.',
        lang: 'js',
        code:
`import { z } from 'zod';
import DOMPurify from 'dompurify';
import { escape as sqlEscape } from 'sqlstring';

// Schema validation
const UserSchema = z.object({
  email: z.string().email().max(254).toLowerCase(),
  age:   z.number().int().min(13).max(120),
  bio:   z.string().max(500).optional(),
});

app.post('/api/users', (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  const user = result.data;  // typed & validated

  // Sanitize HTML output to prevent stored XSS
  const safeBio = DOMPurify.sanitize(user.bio ?? '');

  // Parameterized query — NEVER concatenate user input
  await pool.query(
    'INSERT INTO users(email, age, bio) VALUES($1, $2, $3)',
    [user.email, user.age, safeBio]
  );
});`,
      },
      {
        id: 'https-tls', title: 'HTTPS, TLS & Security Headers',
        desc: 'TLS 1.3, HSTS, certificate management with Let\'s Encrypt, Helmet.js for HTTP security headers, and secrets management.',
        lang: 'js',
        code:
`import helmet from 'helmet';

// Helmet sets 11 security-related HTTP headers
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Secrets — never hardcode, use env or a vault
const secret = process.env.JWT_SECRET;
// Production: AWS Secrets Manager / HashiCorp Vault
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
const client = new SecretsManagerClient({ region: 'us-east-1' });
const { SecretString } = await client.send(
  new GetSecretValueCommand({ SecretId: 'prod/api/jwt' })
);

// Cookie security flags
res.cookie('session', token, {
  httpOnly: true,   // no JS access
  secure: true,     // HTTPS only
  sameSite: 'lax',  // CSRF protection
  maxAge: 900_000,  // 15 min
});`,
      },
    ],
  },

  /* ── 6. TESTING ───────────────────────────── */
  {
    id: 'testing', label: 'Testing', icon: '✓',
    color: '#0891b2', dotClass: 'dot-testing',
    desc: 'Verify correctness, prevent regressions, ship with confidence.',
    skills: [
      {
        id: 'unit-testing', title: 'Unit Testing with Jest',
        desc: 'Test pure functions and individual modules in isolation. Use mocks and stubs for external dependencies.',
        demo: 'test-runner',
      },
      {
        id: 'integration', title: 'Integration & API Testing',
        desc: 'Test multiple layers together — routes, middleware, DB — using Supertest and real (or containerised) databases.',
        lang: 'js',
        code:
`import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db.js';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.query('TRUNCATE users CASCADE');
  });
  afterAll(() => db.end());

  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', password: 'secure123' })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      email: 'test@example.com',
    });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 409 for duplicate email', async () => {
    await request(app).post('/api/users')
      .send({ email: 'dup@example.com', password: 'abc12345' });
    await request(app).post('/api/users')
      .send({ email: 'dup@example.com', password: 'abc12345' })
      .expect(409);
  });
});`,
      },
      {
        id: 'e2e', title: 'End-to-End Testing with Playwright',
        desc: 'Drive a real browser to validate full user flows. Test what users actually experience across Chrome, Firefox, and WebKit.',
        lang: 'js',
        code:
`import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('user can sign up, log in, and log out', async ({ page }) => {
    // Sign up
    await page.goto('/signup');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Secret123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Verify user sees their email
    await expect(page.getByText('test@example.com')).toBeVisible();

    // Log out
    await page.click('[data-testid="logout-btn"]');
    await expect(page).toHaveURL('/login');
  });

  test('shows error on wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  });
});`,
      },
      {
        id: 'tdd', title: 'TDD & Testing Mindset',
        desc: 'Red → Green → Refactor. Write the test first, make it pass with minimal code, then refactor safely. Apply the testing pyramid.',
        lang: 'js',
        code:
`// 1. RED — write a failing test first
test('calculates cart total with discount', () => {
  const cart = new Cart([
    { price: 100, qty: 2 },
    { price: 50,  qty: 1 },
  ]);
  expect(cart.total({ discount: 0.1 })).toBe(225); // 250 - 10%
});

// 2. GREEN — minimal implementation
class Cart {
  constructor(items) { this.items = items; }
  total({ discount = 0 } = {}) {
    const subtotal = this.items.reduce((s, i) => s + i.price * i.qty, 0);
    return subtotal * (1 - discount);
  }
}

// 3. REFACTOR — clean without breaking tests
// Testing pyramid:
//   E2E     ▲  (few, slow, high confidence)
//   Integ   ██
//   Unit    █████████  (many, fast, cheap)`,
      },
    ],
  },

  /* ── 7. SYSTEM DESIGN ─────────────────────── */
  {
    id: 'system-design', label: 'System Design', icon: '⎈',
    color: '#d97706', dotClass: 'dot-system',
    desc: 'Architect scalable, maintainable distributed systems.',
    skills: [
      {
        id: 'api-design', title: 'API Design: REST vs GraphQL',
        desc: 'REST conventions (versioning, pagination, HATEOAS) vs GraphQL (schema, resolvers, N+1 problem, DataLoader).',
        lang: 'js',
        code:
`// REST — resource-based, versioned
// GET  /api/v1/users?page=2&limit=20&sort=createdAt:desc
// POST /api/v1/users
// PUT  /api/v1/users/:id
// DELETE /api/v1/users/:id

// Pagination response envelope
{
  "data": [...],
  "meta": {
    "page": 2, "limit": 20,
    "total": 453,
    "nextCursor": "eyJpZCI6MjB9"
  }
}

// GraphQL — client-driven, single endpoint
const typeDefs = gql\`
  type User { id: ID! name: String! posts: [Post!]! }
  type Post  { id: ID! title: String! author: User! }
  type Query {
    users(first: Int, after: String): UserConnection!
    user(id: ID!): User
  }
\`;

// DataLoader — batch N+1 queries
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findByIds(ids);
  return ids.map(id => users.find(u => u.id === id));
});`,
      },
      {
        id: 'microservices', title: 'Microservices Architecture',
        desc: 'Decompose by business domain, communicate via REST/gRPC/events, use an API gateway, and embrace the strangler fig pattern.',
        demo: 'arch-diagram',
      },
      {
        id: 'caching', title: 'Caching Strategies',
        desc: 'Cache-aside, write-through, write-behind, TTL, cache invalidation, CDN edge caching, and Redis cluster.',
        lang: 'js',
        code:
`// Cache-aside pattern
async function getUser(id) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  if (user) {
    await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user)); // TTL 5 min
  }
  return user;
}

// Cache invalidation on write
async function updateUser(id, data) {
  await db.users.update(id, data);
  await redis.del(\`user:\${id}\`);  // bust cache
}

// HTTP caching headers
res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
res.setHeader('ETag', generateETag(data));

// Conditional request support
if (req.headers['if-none-match'] === currentETag) {
  return res.status(304).end();
}`,
      },
      {
        id: 'scalability', title: 'Scalability & Reliability',
        desc: 'Horizontal scaling, load balancing, circuit breakers, bulkheads, health checks, graceful shutdown, and the CAP theorem.',
        lang: 'js',
        code:
`// Graceful shutdown — drain connections before exit
const server = app.listen(3000);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close(async () => {
    await db.pool.end();
    await redis.quit();
    process.exit(0);
  });
  // Force after 30 s
  setTimeout(() => process.exit(1), 30_000);
});

// Circuit breaker (opossum)
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(callExternalService, {
  timeout: 3000,         // 3 s
  errorThresholdPercentage: 50,
  resetTimeout: 30000,   // try again after 30 s
});
breaker.fallback(() => getCachedResult());

// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled([
    db.query('SELECT 1'), redis.ping(),
  ]);
  const ok = checks.every(c => c.status === 'fulfilled');
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'degraded' });
});`,
      },
    ],
  },

  /* ── 8. PROJECTS ──────────────────────────── */
  {
    id: 'projects', label: 'Projects', icon: '★',
    color: '#059669', dotClass: 'dot-projects',
    desc: 'Apply everything — build real full-stack applications.',
    isProjects: true,
    skills: [
      {
        id: 'proj-rest-api', title: 'Build a REST API',
        desc: 'Node.js + Express + PostgreSQL. Users, auth (JWT), CRUD resources, validation, error handling, and tests.',
        lang: 'bash',
        code:
`# Project structure
my-api/
├── src/
│   ├── app.js          # Express app
│   ├── routes/         # Route handlers
│   │   ├── auth.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js     # JWT verify
│   │   └── validate.js # Zod schemas
│   ├── services/       # Business logic
│   ├── db/             # Pool + migrations
│   └── errors.js       # Custom error classes
├── tests/
│   ├── auth.test.js
│   └── users.test.js
├── Dockerfile
├── docker-compose.yml  # app + postgres + redis
└── .env.example`,
      },
      {
        id: 'proj-fullstack', title: 'Full-Stack Todo Application',
        desc: 'React frontend + Node.js API + PostgreSQL. Real-time updates via WebSocket, user auth, drag-and-drop reorder, and Docker Compose.',
        lang: 'yaml',
        code:
`# docker-compose.yml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: todos
      POSTGRES_PASSWORD: secret
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

  api:
    build: ./server
    environment:
      DATABASE_URL: postgres://postgres:secret@db/todos
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
    depends_on: [db, redis]
    ports: ["3001:3001"]

  client:
    build: ./client
    environment:
      VITE_API_URL: http://localhost:3001
    ports: ["5173:5173"]

volumes:
  pgdata:`,
      },
      {
        id: 'proj-devops', title: 'Deploy to the Cloud',
        desc: 'Containerise your app, push to a registry, deploy to a managed Kubernetes cluster (EKS/GKE), set up CI/CD, monitoring (Prometheus + Grafana), and alerting.',
        lang: 'yaml',
        code:
`# k8s deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: myregistry/api:latest
          ports: [{ containerPort: 3001 }]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef: { name: api-secrets, key: db-url }
          livenessProbe:
            httpGet: { path: /health, port: 3001 }
            initialDelaySeconds: 10
          readinessProbe:
            httpGet: { path: /health, port: 3001 }
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "512Mi" }`,
      },
    ],
  },
];

/* ── Total skill count (exclude project items from "35") ─────── */
const SKILL_IDS = CATEGORIES.flatMap(c => c.skills.map(s => s.id));
const TOTAL = SKILL_IDS.length; // 35 + 3 projects = 38; let's count all

/* ── progress helpers ─────────────────────────────────────────── */
function updateProgress() {
  const done = getCompleted();
  const count = done.length;
  const pct = Math.round((count / TOTAL) * 100);
  $('progressFill').style.width = pct + '%';
  $('progressLabel').textContent = `${count} / ${TOTAL} skills`;

  // stat cards on dashboard
  const sdEl = $('stat-completed');
  const spEl = $('stat-percent');
  const scEl = $('stat-categories');
  if (sdEl) sdEl.textContent = count;
  if (spEl) spEl.textContent = pct + '%';
  if (scEl) {
    const started = CATEGORIES.filter(c =>
      c.skills.some(s => done.includes(s.id))
    ).length;
    scEl.textContent = `${started}/${CATEGORIES.length}`;
  }

  // update nav counts
  CATEGORIES.forEach(cat => {
    const el = $(`nav-count-${cat.id}`);
    if (!el) return;
    const catDone = cat.skills.filter(s => done.includes(s.id)).length;
    el.textContent = `${catDone}/${cat.skills.length}`;
    if (catDone === cat.skills.length) el.style.background = 'var(--success)';
  });

  // roadmap progress bars on dashboard
  CATEGORIES.forEach(cat => {
    const barEl = $(`roadmap-bar-${cat.id}`);
    const cntEl = $(`roadmap-cnt-${cat.id}`);
    if (!barEl) return;
    const catDone = cat.skills.filter(s => done.includes(s.id)).length;
    const pct2 = Math.round((catDone / cat.skills.length) * 100);
    barEl.style.width = pct2 + '%';
    if (cntEl) cntEl.textContent = `${catDone} / ${cat.skills.length} skills`;
  });

  // mark completed cards
  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.skillId;
    if (done.includes(id)) {
      card.classList.add('completed');
      const btn = card.querySelector('.complete-btn');
      if (btn) btn.textContent = '✓ Completed';
    } else {
      card.classList.remove('completed');
      const btn = card.querySelector('.complete-btn');
      if (btn) btn.textContent = 'Mark Complete';
    }
  });

  // section mini-progress bars
  CATEGORIES.forEach(cat => {
    const fillEl = $(`sec-prog-fill-${cat.id}`);
    const txtEl  = $(`sec-prog-txt-${cat.id}`);
    if (!fillEl) return;
    const catDone = cat.skills.filter(s => done.includes(s.id)).length;
    const p = Math.round((catDone / cat.skills.length) * 100);
    fillEl.style.width = p + '%';
    if (txtEl) txtEl.textContent = `${catDone} / ${cat.skills.length} completed`;
  });
}

/* ── code block renderer ───────────────────────────────────────── */
function renderCodeBlock(code, lang) {
  const langLabels = { js:'JavaScript', jsx:'React JSX', ts:'TypeScript',
    html:'HTML', css:'CSS', sql:'SQL', yaml:'YAML', bash:'Shell' };
  return `
    <div class="code-wrap">
      <div class="code-label">
        <span>${langLabels[lang] ?? lang ?? 'Code'}</span>
        <button class="copy-btn">Copy</button>
      </div>
      <pre class="code-block"><code>${esc(code)}</code></pre>
    </div>`;
}

/* ── demo HTML generators ──────────────────────────────────────── */
function demoHtml(type, skillId) {
  switch (type) {
    case 'rest-table': return `
      <div class="demo-area">
        <div class="demo-title">HTTP Methods at a Glance</div>
        <div class="rest-demo">
          ${[
            ['GET',    '/api/users',      'List all users'],
            ['GET',    '/api/users/:id',  'Get one user'],
            ['POST',   '/api/users',      'Create a user'],
            ['PUT',    '/api/users/:id',  'Replace user'],
            ['PATCH',  '/api/users/:id',  'Partial update'],
            ['DELETE', '/api/users/:id',  'Delete user'],
          ].map(([m,p,d]) => `
            <div class="rest-row">
              <span class="method-badge method-${m}">${m}</span>
              <span class="rest-path">${esc(p)}</span>
            </div>
            <div class="rest-desc">${esc(d)}</div>
          `).join('')}
        </div>
      </div>`;

    case 'jwt-decode': return `
      <div class="demo-area">
        <div class="demo-title">JWT Structure</div>
        <div class="jwt-parts">
          <div class="jwt-label">Header (algorithm)</div>
          <div class="jwt-segment jwt-header">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</div>
          <div class="jwt-label">Payload (claims)</div>
          <div class="jwt-segment jwt-payload">eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwOTAwfQ</div>
          <div class="jwt-label">Signature (HMAC-SHA256)</div>
          <div class="jwt-segment jwt-sig">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</div>
          <div class="jwt-label">Decoded payload</div>
          <div class="jwt-decoded">{
  "sub": "user_123",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700000900
}</div>
        </div>
      </div>`;

    case 'sql-runner': return `
      <div class="demo-area">
        <div class="demo-title">Interactive SQL Runner</div>
        <div class="sql-demo">
          <textarea id="sql-input-${skillId}" rows="3">SELECT * FROM users WHERE age > 25 ORDER BY name</textarea>
          <button class="sql-run" onclick="runSql('${skillId}')">▶ Run Query</button>
          <div class="sql-result" id="sql-result-${skillId}"></div>
        </div>
      </div>`;

    case 'git-demo': return `
      <div class="demo-area">
        <div class="demo-title">Common Git Commands</div>
        <div class="git-demo">
          ${[
            ['git switch -c feature/login', 'Switched to a new branch \'feature/login\''],
            ['git add -p', 'Interactively stage hunks'],
            ['git commit -m "feat: add login endpoint"', '[feature/login a1b2c3d] feat: add login endpoint'],
            ['git rebase main --interactive', 'Successfully rebased and updated refs/heads/feature/login'],
            ['git log --oneline --graph --all', '* a1b2c3d (HEAD) feat: add login\n* d4e5f6a (main) chore: deps'],
          ].map(([cmd, out]) => `
            <div class="git-cmd">
              <span class="prompt">$ </span>${esc(cmd)}
              <span class="output">${esc(out)}</span>
            </div>
          `).join('')}
        </div>
      </div>`;

    case 'docker-layers': return `
      <div class="demo-area">
        <div class="demo-title">Dockerfile Layers (multi-stage build)</div>
        <div class="docker-layers">
          ${[
            ['FROM', 'node:20-alpine AS builder', '~50 MB', 'layer-from'],
            ['WORKDIR', '/app', '', 'layer-workdir'],
            ['COPY', 'package*.json ./', '', 'layer-copy'],
            ['RUN', 'npm ci', '+120 MB', 'layer-run'],
            ['COPY', '. .', '+5 MB', 'layer-copy'],
            ['RUN', 'npm run build', '+2 MB', 'layer-run'],
            ['FROM', 'node:20-alpine AS runner', '~50 MB', 'layer-from'],
            ['COPY', '--from=builder /app/dist .', '+2 MB', 'layer-copy'],
            ['EXPOSE', '3000', '', 'layer-expose'],
            ['CMD', '["node", "server.js"]', '', 'layer-cmd'],
          ].map(([inst, args, size, cls]) => `
            <div class="docker-layer ${cls}">
              <span class="layer-badge">${inst}</span>
              <span>${esc(args)}</span>
              ${size ? `<span class="layer-size">${size}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>`;

    case 'owasp-list': return `
      <div class="demo-area">
        <div class="demo-title">OWASP Top 10 (2021)</div>
        <ul class="owasp-list">
          ${[
            ['A01', 'Broken Access Control — enforce least privilege'],
            ['A02', 'Cryptographic Failures — use TLS, Argon2 for passwords'],
            ['A03', 'Injection — parameterize all queries, validate input'],
            ['A04', 'Insecure Design — threat model early'],
            ['A05', 'Security Misconfiguration — disable debug in prod'],
            ['A06', 'Vulnerable Components — audit deps with npm audit'],
            ['A07', 'Auth Failures — MFA, account lockout, secure sessions'],
            ['A08', 'Integrity Failures — verify package signatures'],
            ['A09', 'Logging Failures — log auth events, monitor anomalies'],
            ['A10', 'SSRF — validate/allowlist outbound URLs'],
          ].map(([rank, desc]) => `
            <li class="owasp-item">
              <span class="owasp-rank">${rank}</span>
              <span>${esc(desc)}</span>
            </li>
          `).join('')}
        </ul>
      </div>`;

    case 'test-runner': return `
      <div class="demo-area">
        <div class="demo-title">Jest Test Suite</div>
        <div class="test-demo">
          ${[
            ['pass', 'calculates cart total correctly'],
            ['pass', 'applies percentage discount'],
            ['pass', 'returns 0 for empty cart'],
            ['fail', 'handles negative quantities'],
            ['pass', 'rounds to 2 decimal places'],
            ['skip', 'bulk discount (not yet implemented)'],
          ].map(([status, name]) => `
            <div class="test-case">
              <span class="test-dot ${status}"></span>
              <span>${esc(name)}</span>
            </div>
          `).join('')}
          <div class="test-summary">
            <span class="pass-text">✓ 4 passed</span> &nbsp;
            <span class="fail-text">✗ 1 failed</span> &nbsp;
            <span>○ 1 skipped</span>
          </div>
        </div>
      </div>`;

    case 'arch-diagram': return `
      <div class="demo-area">
        <div class="demo-title">Microservices Architecture</div>
        <div class="arch-diagram">
          <div class="arch-row">
            <div class="arch-box arch-client">Browser / Mobile</div>
          </div>
          <div class="arch-row"><span class="arch-arrow">↓ HTTPS</span></div>
          <div class="arch-row">
            <div class="arch-box arch-gateway">API Gateway<br><small>Auth · Rate limit · Route</small></div>
          </div>
          <div class="arch-row"><span class="arch-arrow">↓ gRPC / REST</span></div>
          <div class="arch-row">
            <div class="arch-box arch-service">User Service</div>
            <div class="arch-box arch-service">Order Service</div>
            <div class="arch-box arch-service">Notify Service</div>
          </div>
          <div class="arch-row"><span class="arch-arrow">↓</span></div>
          <div class="arch-row">
            <div class="arch-box arch-db">PostgreSQL</div>
            <div class="arch-box arch-cache">Redis Cache</div>
            <div class="arch-box arch-queue">Message Queue</div>
          </div>
        </div>
      </div>`;

    case 'ws-demo': return `
      <div class="demo-area">
        <div class="demo-title">WebSocket Message Exchange (simulated)</div>
        <div class="ws-demo">
          <div class="ws-messages" id="ws-messages-${skillId}">
            <div class="ws-msg sys">🔌 Connected to ws://localhost:8080</div>
          </div>
          <div class="ws-input-row">
            <input class="ws-input" id="ws-input-${skillId}" placeholder="Type a message…" />
            <button class="ws-send" onclick="wsSend('${skillId}')">Send</button>
          </div>
        </div>
      </div>`;

    case 'redis-demo': return `
      <div class="demo-area">
        <div class="demo-title">Redis Command Simulator</div>
        <div class="redis-demo">
          <div style="font-size:.75rem;color:var(--muted);margin-bottom:.3rem">
            Try: SET name Alice &nbsp;|&nbsp; GET name &nbsp;|&nbsp; EXPIRE name 60 &nbsp;|&nbsp; DEL name &nbsp;|&nbsp; KEYS *
          </div>
          <div class="redis-cmd-row">
            <input class="redis-input" id="redis-input-${skillId}" placeholder="SET key value" />
            <button class="redis-run" onclick="redisRun('${skillId}')">Run</button>
          </div>
          <div class="redis-output" id="redis-output-${skillId}">redis&gt; </div>
        </div>
      </div>`;

    case 'js-eval': return `
      <div class="demo-area">
        <div class="demo-title">JavaScript Playground</div>
        <div class="ts-demo">
          <div style="font-size:.75rem;color:var(--muted);margin-bottom:.3rem">
            Try: [1,2,3].map(x => x**2) &nbsp;|&nbsp; 'hello'.toUpperCase() &nbsp;|&nbsp; Object.keys({a:1,b:2})
          </div>
          <div class="redis-cmd-row">
            <input class="redis-input" id="js-input-${skillId}" placeholder="Enter a JS expression…" />
            <button class="redis-run" style="background:var(--warn)" onclick="jsEval('${skillId}')">Eval</button>
          </div>
          <div class="ts-result" id="js-result-${skillId}">→ output appears here</div>
        </div>
      </div>`;

    default: return '';
  }
}

/* ── card renderer ─────────────────────────────────────────────── */
function renderCard(skill) {
  const done = isCompleted(skill.id);
  return `
    <article class="card ${done ? 'completed' : ''}" data-skill-id="${skill.id}">
      <div class="card-header">
        <h3>${esc(skill.title)}</h3>
        <span class="check-icon" aria-hidden="true">✓</span>
      </div>
      <p class="card-desc">${esc(skill.desc)}</p>
      ${skill.demo ? demoHtml(skill.demo, skill.id) : ''}
      ${skill.code ? renderCodeBlock(skill.code, skill.lang) : ''}
      <button class="complete-btn" data-skill-id="${skill.id}">
        ${done ? '✓ Completed' : 'Mark Complete'}
      </button>
    </article>`;
}

/* ── section renderer ──────────────────────────────────────────── */
function renderSection(cat) {
  if (cat.isDashboard) return renderDashboard();

  const done = getCompleted();
  const catDone = cat.skills.filter(s => done.includes(s.id)).length;
  const pct = Math.round((catDone / cat.skills.length) * 100);

  return `
    <section id="section-${cat.id}" class="content-section">
      <div class="section-hero">
        <h1 class="section-h2">
          <span class="cat-badge" style="background:${cat.color}">${cat.icon} ${esc(cat.label)}</span>
        </h1>
        <p>${esc(cat.desc)}</p>
      </div>
      <div class="section-meta">
        <div class="section-progress-mini">
          <div class="section-progress-mini-fill" id="sec-prog-fill-${cat.id}"
               style="background:${cat.color};width:${pct}%"></div>
        </div>
        <span class="section-progress-text" id="sec-prog-txt-${cat.id}">
          ${catDone} / ${cat.skills.length} completed
        </span>
      </div>
      <div class="cards-grid">
        ${cat.skills.map(renderCard).join('')}
      </div>
      <footer class="site-footer">
        Built with plain HTML, CSS &amp; JS — no frameworks needed.
      </footer>
    </section>`;
}

/* ── dashboard renderer ────────────────────────────────────────── */
function renderDashboard() {
  const done = getCompleted();
  const count = done.length;
  const pct = Math.round((count / TOTAL) * 100);
  const started = CATEGORIES.filter(c =>
    c.skills.some(s => done.includes(s.id))
  ).length;

  return `
    <section id="section-dashboard" class="content-section">
      <div class="section-hero">
        <h1>Full Stack Developer Roadmap</h1>
        <p>Master frontend, backend, databases, DevOps, security, testing, and system design — one skill at a time.</p>
      </div>
      <div class="dashboard-stats">
        <div class="stat-card"><div class="stat-number" id="stat-completed">${count}</div><div class="stat-label">Skills Completed</div></div>
        <div class="stat-card"><div class="stat-number">${TOTAL}</div><div class="stat-label">Total Skills</div></div>
        <div class="stat-card"><div class="stat-number" id="stat-percent">${pct}%</div><div class="stat-label">Overall Progress</div></div>
        <div class="stat-card"><div class="stat-number" id="stat-categories">${started}/${CATEGORIES.length}</div><div class="stat-label">Categories Started</div></div>
      </div>
      <h2 class="section-h2" style="margin-bottom:1rem">Learning Path</h2>
      <div class="roadmap-grid">
        ${CATEGORIES.map(cat => {
          const catDone = cat.skills.filter(s => done.includes(s.id)).length;
          const p = Math.round((catDone / cat.skills.length) * 100);
          return `
            <div class="roadmap-card" onclick="navigate('${cat.id}')">
              <div class="roadmap-card-header">
                <div class="roadmap-icon" style="background:${cat.color}">${cat.icon}</div>
                <span>${esc(cat.label)}</span>
              </div>
              <div class="roadmap-desc">${esc(cat.desc)}</div>
              <div class="roadmap-progress-bar">
                <div class="roadmap-progress-fill" id="roadmap-bar-${cat.id}"
                     style="background:${cat.color};width:${p}%"></div>
              </div>
              <div class="roadmap-count" id="roadmap-cnt-${cat.id}">${catDone} / ${cat.skills.length} skills</div>
            </div>`;
        }).join('')}
      </div>
      <footer class="site-footer" style="margin-top:2rem">
        Built with plain HTML, CSS &amp; JS — no frameworks needed.
      </footer>
    </section>`;
}

/* ── navigation ────────────────────────────────────────────────── */
let activeSection = 'dashboard';

function navigate(id) {
  // hide all
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

  // show target
  const sec = document.getElementById(`section-${id}`);
  if (sec) sec.classList.add('active');

  const navEl = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (navEl) navEl.classList.add('active');

  activeSection = id;
  updateProgress();

  // close sidebar on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

/* ── build sidebar nav ─────────────────────────────────────────── */
function buildNav() {
  const list = $('navList');
  const groups = [
    { header: null, items: [CATEGORIES.find(c => c.isDashboard)] },
    { header: 'Core Skills', items: CATEGORIES.filter(c => ['frontend','backend','databases'].includes(c.id)) },
    { header: 'Engineering', items: CATEGORIES.filter(c => ['devops','security','testing','system-design'].includes(c.id)) },
    { header: 'Practice', items: CATEGORIES.filter(c => c.id === 'projects') },
  ];

  groups.forEach(({ header, items }) => {
    if (header) {
      const li = document.createElement('li');
      li.className = 'nav-section-header';
      li.textContent = header;
      list.appendChild(li);
    }
    (items || []).forEach(cat => {
      if (!cat) return;
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.dataset.section = cat.id;
      li.innerHTML = `
        <span class="nav-icon ${cat.dotClass ?? ''}">●</span>
        <span class="nav-label">${esc(cat.label)}</span>
        ${!cat.isDashboard ? `<span class="nav-count" id="nav-count-${cat.id}">0/${cat.skills.length}</span>` : ''}
      `;
      li.addEventListener('click', () => navigate(cat.id));
      list.appendChild(li);
    });
  });

  // Activate dashboard initially
  const dashNav = document.querySelector('.nav-item[data-section="dashboard"]');
  if (dashNav) dashNav.classList.add('active');
}

/* ── render all sections into main ────────────────────────────── */
function renderAll() {
  const main = $('main');
  main.innerHTML = CATEGORIES.map(renderSection).join('');
  // activate dashboard
  const dash = $('section-dashboard');
  if (dash) dash.classList.add('active');
}

/* ── copy buttons ──────────────────────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('copy-btn')) {
    const pre = e.target.closest('.code-wrap')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
      e.target.textContent = 'Copied!';
      e.target.classList.add('copied');
      setTimeout(() => { e.target.textContent = 'Copy'; e.target.classList.remove('copied'); }, 2000);
    }).catch(() => {
      e.target.textContent = 'Failed';
      setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
    });
  }
});

/* ── complete buttons ──────────────────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('complete-btn')) {
    const id = e.target.dataset.skillId;
    if (!id) return;
    const completed = getCompleted();
    if (!completed.includes(id)) {
      completed.push(id);
      saveCompleted(completed);
    }
    updateProgress();
  }
});

/* ── SQL runner ────────────────────────────────────────────────── */
const SQL_TABLE = [
  { id:1, name:'Alice',   age:32, role:'admin' },
  { id:2, name:'Bob',     age:24, role:'user'  },
  { id:3, name:'Charlie', age:41, role:'user'  },
  { id:4, name:'Diana',   age:28, role:'admin' },
  { id:5, name:'Eve',     age:35, role:'user'  },
];

window.runSql = function(skillId) {
  const q = ($(`sql-input-${skillId}`)?.value ?? '').trim().toLowerCase();
  const out = $(`sql-result-${skillId}`);
  if (!out) return;

  try {
    let rows = [...SQL_TABLE];

    // WHERE
    const whereM = q.match(/where\s+(.+?)(?:\s+order|\s+limit|$)/);
    if (whereM) {
      const cond = whereM[1].trim();
      const ageM = cond.match(/age\s*([><=!]+)\s*(\d+)/);
      const roleM = cond.match(/role\s*=\s*['"]?(\w+)['"]?/);
      const nameM = cond.match(/name\s*=\s*['"]?(\w+)['"]?/);
      if (ageM) {
        const [,op,val] = ageM;
        rows = rows.filter(r => {
          if (op==='>')  return r.age > +val;
          if (op==='>=') return r.age >= +val;
          if (op==='<')  return r.age < +val;
          if (op==='<=') return r.age <= +val;
          if (op==='=')  return r.age === +val;
          return true;
        });
      }
      if (roleM) rows = rows.filter(r => r.role === roleM[1]);
      if (nameM) rows = rows.filter(r => r.name.toLowerCase() === nameM[1].toLowerCase());
    }

    // ORDER BY
    const orderM = q.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/);
    if (orderM) {
      const col = orderM[1], dir = orderM[2] ?? 'asc';
      rows.sort((a,b) => dir==='desc' ? (b[col]>a[col]?1:-1) : (a[col]>b[col]?1:-1));
    }

    // LIMIT
    const limM = q.match(/limit\s+(\d+)/);
    if (limM) rows = rows.slice(0, +limM[1]);

    // SELECT columns
    const selM = q.match(/^select\s+(.+?)\s+from/);
    let cols = ['id','name','age','role'];
    if (selM && selM[1].trim() !== '*') {
      cols = selM[1].split(',').map(c => c.trim());
    }

    if (!rows.length) { out.innerHTML = '<div class="sql-error">No rows returned.</div>'; return; }

    const thead = `<tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>`;
    const tbody = rows.map(r => `<tr>${cols.map(c=>`<td>${esc(r[c]??'NULL')}</td>`).join('')}</tr>`).join('');
    out.innerHTML = `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>
      <div style="font-size:.72rem;color:var(--muted);margin-top:.3rem">${rows.length} row(s)</div>`;
  } catch(err) {
    out.innerHTML = `<div class="sql-error">Error: ${esc(err.message)}</div>`;
  }
};

/* ── Redis simulator ───────────────────────────────────────────── */
const redisStore = new Map();

window.redisRun = function(skillId) {
  const raw = ($(`redis-input-${skillId}`)?.value ?? '').trim();
  const out = $(`redis-output-${skillId}`);
  if (!out) return;

  const parts = raw.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
  const cmd = (parts[0] ?? '').toUpperCase();
  let response = '(error) Unknown command';

  try {
    if (cmd === 'SET') {
      redisStore.set(parts[1], { val: parts[2] ?? '', ttl: null });
      response = 'OK';
    } else if (cmd === 'GET') {
      const rec = redisStore.get(parts[1]);
      response = rec ? `"${rec.val}"` : '(nil)';
    } else if (cmd === 'DEL') {
      const deleted = redisStore.delete(parts[1]) ? 1 : 0;
      response = `(integer) ${deleted}`;
    } else if (cmd === 'EXPIRE') {
      if (redisStore.has(parts[1])) {
        redisStore.get(parts[1]).ttl = +parts[2];
        response = '(integer) 1';
      } else { response = '(integer) 0'; }
    } else if (cmd === 'TTL') {
      const rec = redisStore.get(parts[1]);
      response = rec ? `(integer) ${rec.ttl ?? -1}` : '(integer) -2';
    } else if (cmd === 'KEYS') {
      const pattern = parts[1] ?? '*';
      const keys = [...redisStore.keys()];
      response = keys.length ? keys.map(k=>`"${k}"`).join('\n') : '(empty array)';
    } else if (cmd === 'FLUSHALL') {
      redisStore.clear();
      response = 'OK';
    } else if (cmd === 'INCR') {
      const rec = redisStore.get(parts[1]) ?? { val: '0', ttl: null };
      rec.val = String(+(rec.val) + 1);
      redisStore.set(parts[1], rec);
      response = `(integer) ${rec.val}`;
    }
  } catch(e) { response = `(error) ${e.message}`; }

  out.textContent = `redis> ${raw}\n${response}`;
  if ($(`redis-input-${skillId}`)) $(`redis-input-${skillId}`).value = '';
};

/* ── JS eval (sandboxed) ───────────────────────────────────────── */
window.jsEval = function(skillId) {
  const expr = ($(`js-input-${skillId}`)?.value ?? '').trim();
  const out = $(`js-result-${skillId}`);
  if (!out || !expr) return;
  try {
    // Basic safety: no document, window, fetch, eval access
    const forbidden = ['document','window','fetch','XMLHttpRequest',
      'localStorage','sessionStorage','indexedDB','eval','Function'];
    if (forbidden.some(f => expr.includes(f))) {
      out.textContent = '→ (restricted: browser API access not allowed in playground)';
      return;
    }
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${expr})`)();
    out.textContent = `→ ${JSON.stringify(result, null, 2)}`;
  } catch(e) {
    out.textContent = `→ Error: ${e.message}`;
  }
};

/* ── WebSocket simulator ───────────────────────────────────────── */
const wsResponses = [
  'Got it! Processing your message…',
  'Server echo: message received ✓',
  'Broadcasting to all connected clients…',
  'Stored in message history.',
];
let wsIdx = 0;

window.wsSend = function(skillId) {
  const input = $(`ws-input-${skillId}`);
  const msgs  = $(`ws-messages-${skillId}`);
  if (!input || !msgs) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const clientMsg = document.createElement('div');
  clientMsg.className = 'ws-msg client';
  clientMsg.textContent = text;
  msgs.appendChild(clientMsg);

  setTimeout(() => {
    const srvMsg = document.createElement('div');
    srvMsg.className = 'ws-msg server';
    srvMsg.textContent = wsResponses[wsIdx % wsResponses.length];
    wsIdx++;
    msgs.appendChild(srvMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 300);

  msgs.scrollTop = msgs.scrollHeight;
};

/* also allow Enter key in ws input */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('ws-input')) {
    const skillId = e.target.id.replace('ws-input-', '');
    window.wsSend(skillId);
  }
  if (e.key === 'Enter' && e.target.classList.contains('redis-input')) {
    const skillId = e.target.id.replace('redis-input-', '');
    window.redisRun(skillId);
  }
  if (e.key === 'Enter' && e.target.id?.startsWith('js-input-')) {
    const skillId = e.target.id.replace('js-input-', '');
    window.jsEval(skillId);
  }
  if (e.key === 'Enter' && e.target.id?.startsWith('sql-input-')) {
    const skillId = e.target.id.replace('sql-input-', '');
    window.runSql(skillId);
  }
  if (e.key === 'Escape') closeModal();
});

/* ── Dark mode ─────────────────────────────────────────────────── */
const themeBtn = $('themeBtn');
if (localStorage.getItem('fsh-theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '☀️';
}
themeBtn?.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  themeBtn.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('fsh-theme', dark ? 'light' : 'dark');
});

/* ── Sidebar toggle ────────────────────────────────────────────── */
const sidebar = $('sidebar');
const main    = $('main');

$('menuBtn')?.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open');
  } else {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('full-width');
  }
});

/* ── Modal ─────────────────────────────────────────────────────── */
function closeModal() {
  $('modalOverlay')?.classList.add('hidden');
}
$('modalClose')?.addEventListener('click', closeModal);
$('modalOverlay')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

/* ── Init ──────────────────────────────────────────────────────── */
buildNav();
renderAll();
updateProgress();
