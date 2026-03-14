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

  /* ── 9. COMMERCE & FINANCE ────────────────── */
  {
    id: 'commerce', label: 'Purchase & Finance', icon: '🏢',
    color: '#0f766e', dotClass: 'dot-commerce',
    desc: 'Theo dõi đơn mua hàng công ty, ngân sách, nhà cung cấp và báo cáo tài chính.',
    skills: [
      {
        id: 'tanstack-query', title: 'TanStack Query (React Query)',
        desc: 'Quản lý server state: caching tự động, background refetch, optimistic updates — dùng để fetch danh sách đơn mua hàng, ngân sách, báo cáo realtime.',
        lang: 'jsx',
        code:
`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch products with caching + auto-refetch
function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],   // cache key
    queryFn: () => api.get('/products', { params: filters }),
    staleTime: 60_000,                 // fresh for 1 min
    select: data => data.items,        // transform response
  });
}

// Mutation with optimistic update
function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, qty }) => api.patch(\`/products/\${id}\`, { qty }),
    onMutate: async ({ id, qty }) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const prev = qc.getQueryData(['products']);
      qc.setQueryData(['products'], old =>
        old.map(p => p.id === id ? { ...p, qty } : p)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(['products'], ctx.prev); // rollback
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}`,
      },
      {
        id: 'tanstack-table', title: 'TanStack Table (Data Grid)',
        desc: 'Headless table engine for sortable, filterable, paginated, and virtualized data grids — perfect for order lists and product catalogs.',
        lang: 'jsx',
        code:
`import {
  useReactTable, getCoreRowModel,
  getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender,
} from '@tanstack/react-table';

const columns = [
  { accessorKey: 'orderId',   header: 'Order #', enableSorting: true },
  { accessorKey: 'customer',  header: 'Customer' },
  { accessorKey: 'amount',    header: 'Amount',
    cell: ({ getValue }) => formatVND(getValue()) },
  { accessorKey: 'status',    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  { accessorKey: 'createdAt', header: 'Date',
    cell: ({ getValue }) => format(new Date(getValue()), 'dd/MM/yyyy') },
];

function OrderTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  // render table.getRowModel().rows ...
}`,
      },
      {
        id: 'react-hook-form', title: 'React Hook Form + Zod',
        desc: 'Performant forms with minimal re-renders. Zod schema provides type-safe validation shared between client and server.',
        lang: 'jsx',
        code:
`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ProductSchema = z.object({
  name:     z.string().min(1).max(120),
  price:    z.number().positive(),
  stock:    z.number().int().min(0),
  category: z.enum(['electronics','clothing','food']),
  imageUrl: z.string().url().optional(),
});

function AddProductForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(ProductSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Product name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('price', { valueAsNumber: true })}
             type="number" step="0.01" />
      {errors.price && <span>{errors.price.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add Product'}
      </button>
    </form>
  );
}`,
      },
      {
        id: 'charts', title: 'Data Visualization (Chart.js)',
        desc: 'Render revenue trends, expense breakdowns, and KPI charts. Use Chart.js for quick wins or Recharts for React-native integration.',
        demo: 'canvas-chart',
      },
      {
        id: 'purchase-order', title: 'Purchase Order Workflow',
        desc: 'Thiết kế luồng PO: tạo yêu cầu → phê duyệt theo cấp → gửi nhà cung cấp → nhận hàng → đối soát hóa đơn. Lưu audit trail đầy đủ.',
        lang: 'js',
        code:
`// Purchase Order state machine
const PO_STATES = {
  DRAFT:     { next: ['PENDING_APPROVAL'] },
  PENDING_APPROVAL: { next: ['APPROVED', 'REJECTED'] },
  APPROVED:  { next: ['ORDERED', 'CANCELLED'] },
  ORDERED:   { next: ['PARTIALLY_RECEIVED', 'RECEIVED'] },
  PARTIALLY_RECEIVED: { next: ['RECEIVED'] },
  RECEIVED:  { next: ['INVOICED'] },
  INVOICED:  { next: ['PAID'] },
  PAID:      { next: [] },
  REJECTED:  { next: ['DRAFT'] },
  CANCELLED: { next: [] },
};

// Auto-approval by amount threshold
async function submitForApproval(poId, requesterId) {
  const po = await db.purchaseOrders.findById(poId);

  // Under 5M VND → auto-approve by department head
  // 5M–50M VND  → requires manager
  // Over 50M VND → requires director
  const approver =
    po.totalAmount < 5_000_000  ? 'dept_head' :
    po.totalAmount < 50_000_000 ? 'manager'   : 'director';

  await db.purchaseOrders.update(poId, {
    status: 'PENDING_APPROVAL',
    approverRole: approver,
    submittedAt: new Date(),
    submittedBy: requesterId,
  });

  await notifyApprover(approver, po);
}

// 3-way match: PO ↔ Goods Receipt ↔ Invoice
async function threeWayMatch(poId) {
  const [po, receipts, invoice] = await Promise.all([
    db.purchaseOrders.findById(poId),
    db.goodsReceipts.findByPoId(poId),
    db.invoices.findByPoId(poId),
  ]);
  const receivedQty = receipts.reduce((s, r) => s + r.qty, 0);
  const matched = receivedQty === po.qty && invoice.amount === po.totalAmount;
  return { matched, receivedQty, invoiceAmount: invoice.amount };
}`,
        demo: 'po-flow',
      },
      {
        id: 'budget-tracking', title: 'Budget & Spending Tracker',
        desc: 'Phân bổ ngân sách theo phòng ban và danh mục, theo dõi chi tiêu thực tế vs kế hoạch, cảnh báo khi vượt ngưỡng.',
        lang: 'sql',
        code:
`-- Budget vs Actual by department & category
SELECT
  b.department,
  b.category,
  b.allocated_amount,
  COALESCE(SUM(po.total_amount), 0)       AS spent,
  b.allocated_amount
    - COALESCE(SUM(po.total_amount), 0)   AS remaining,
  ROUND(
    COALESCE(SUM(po.total_amount), 0)
    / b.allocated_amount * 100, 1
  )                                        AS pct_used
FROM budgets b
LEFT JOIN purchase_orders po
  ON  po.department = b.department
  AND po.category   = b.category
  AND po.status     NOT IN ('DRAFT','REJECTED','CANCELLED')
  AND DATE_TRUNC('month', po.created_at) = DATE_TRUNC('month', NOW())
WHERE b.period = DATE_TRUNC('month', NOW())
GROUP BY b.department, b.category, b.allocated_amount
ORDER BY pct_used DESC;

-- Alert: departments over 80% budget used
SELECT department, pct_used
FROM budget_summary_view
WHERE pct_used >= 80
ORDER BY pct_used DESC;`,
        demo: 'budget-demo',
      },
      {
        id: 'vendor-mgmt', title: 'Vendor Management',
        desc: 'Quản lý danh sách nhà cung cấp, đánh giá hiệu suất (on-time delivery, quality), lịch sử giao dịch, và hợp đồng hết hạn.',
        lang: 'js',
        code:
`// Vendor scorecard — tính điểm đánh giá nhà cung cấp
async function calcVendorScore(vendorId, period = 90) {
  const since = subDays(new Date(), period);
  const orders = await db.purchaseOrders.findAll({
    vendorId, status: 'RECEIVED',
    createdAt: { gte: since },
  });

  if (!orders.length) return null;

  // On-time delivery rate
  const onTime = orders.filter(o =>
    new Date(o.receivedAt) <= new Date(o.expectedAt)
  ).length;
  const deliveryScore = (onTime / orders.length) * 100;

  // Quality score (from inspection reports)
  const avgQuality = orders.reduce((s, o) => s + (o.qualityScore ?? 80), 0)
                     / orders.length;

  // Price competitiveness (vs market avg)
  const priceScore = await comparePriceToMarket(vendorId);

  // Weighted total
  const total = deliveryScore * 0.4 + avgQuality * 0.4 + priceScore * 0.2;

  return {
    vendorId,
    deliveryScore: Math.round(deliveryScore),
    qualityScore:  Math.round(avgQuality),
    priceScore:    Math.round(priceScore),
    totalScore:    Math.round(total),
    grade: total >= 85 ? 'A' : total >= 70 ? 'B' : total >= 55 ? 'C' : 'D',
    ordersAnalyzed: orders.length,
  };
}`,
      },
      {
        id: 'currency', title: 'Currency & Number Formatting',
        desc: 'Use Intl.NumberFormat for locale-aware formatting. Use Decimal.js for financial arithmetic to avoid IEEE 754 floating-point errors.',
        demo: 'currency-demo',
      },
      {
        id: 'date-handling', title: 'Date & Time with date-fns',
        desc: 'Financial periods, invoice dates, recurring billing, and timezone-safe reporting using date-fns or Temporal API.',
        lang: 'js',
        code:
`import {
  format, startOfMonth, endOfMonth,
  eachMonthOfInterval, subMonths, isWithinInterval,
} from 'date-fns';
import { vi } from 'date-fns/locale';

// Last 6 months revenue buckets
function buildMonthlyRevenue(transactions) {
  const end   = new Date();
  const start = subMonths(end, 5);
  const months = eachMonthOfInterval({ start, end });

  return months.map(month => {
    const from = startOfMonth(month);
    const to   = endOfMonth(month);
    const total = transactions
      .filter(t => isWithinInterval(new Date(t.date), { start: from, end: to }))
      .reduce((s, t) => s + t.amount, 0);
    return {
      label: format(month, 'MMM yyyy', { locale: vi }),
      total,
    };
  });
}

// Format: "Thứ Hai, 14 tháng 3, 2026"
format(new Date(), 'EEEE, d MMMM, yyyy', { locale: vi });`,
      },
      {
        id: 'pdf-export', title: 'PDF & Excel Export',
        desc: 'Generate invoices as PDF with jsPDF + autoTable. Export financial reports to .xlsx with the SheetJS library.',
        lang: 'js',
        code:
`import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ── PDF Invoice ───────────────────────────────
function exportInvoicePdf(order) {
  const doc = new jsPDF();
  doc.setFontSize(20).text('INVOICE', 14, 22);
  doc.setFontSize(11).text(\`Order: #\${order.id}\`, 14, 32);
  doc.text(\`Date: \${format(new Date(), 'dd/MM/yyyy')}\`, 14, 39);

  autoTable(doc, {
    startY: 50,
    head: [['Product', 'Qty', 'Unit Price', 'Total']],
    body: order.items.map(i => [
      i.name, i.qty,
      formatVND(i.price),
      formatVND(i.price * i.qty),
    ]),
    foot: [['', '', 'Grand Total', formatVND(order.total)]],
  });

  doc.save(\`invoice-\${order.id}.pdf\`);
}

// ── Excel Report ──────────────────────────────
function exportTransactionsXlsx(transactions) {
  const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
    'Date':        format(new Date(t.date), 'dd/MM/yyyy'),
    'Description': t.desc,
    'Category':    t.category,
    'Amount (VND)': t.amount,
    'Type':         t.amount > 0 ? 'Income' : 'Expense',
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, 'financial-report.xlsx');
}`,
      },
      {
        id: 'rbac', title: 'Role-Based Access Control (RBAC)',
        desc: 'Grant/deny UI features and API endpoints based on roles (admin, staff, viewer). Enforce on both client and server — never trust client alone.',
        demo: 'rbac-demo',
      },
      {
        id: 'spend-analytics', title: 'Spend Analytics & Reporting',
        desc: 'Phân tích chi tiêu theo thời gian, danh mục, phòng ban. Tạo báo cáo tổng hợp tháng/quý/năm, so sánh kỳ trước và dự báo.',
        lang: 'sql',
        code:
`-- Monthly spend summary with YoY comparison
WITH monthly AS (
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    category,
    department,
    SUM(total_amount) AS total
  FROM purchase_orders
  WHERE status = 'PAID'
  GROUP BY 1, 2, 3
),
yoy AS (
  SELECT
    m1.month, m1.category, m1.department,
    m1.total AS current_period,
    m2.total AS prior_year,
    ROUND((m1.total - m2.total) / NULLIF(m2.total, 0) * 100, 1) AS yoy_pct
  FROM monthly m1
  LEFT JOIN monthly m2
    ON m2.month = m1.month - INTERVAL '1 year'
    AND m2.category = m1.category
    AND m2.department = m1.department
)
SELECT * FROM yoy
ORDER BY month DESC, current_period DESC;

-- Top 10 highest spend categories this quarter
SELECT
  category,
  COUNT(*)           AS num_orders,
  SUM(total_amount)  AS total_spend,
  AVG(total_amount)  AS avg_order,
  MAX(total_amount)  AS largest_order
FROM purchase_orders
WHERE status NOT IN ('DRAFT','REJECTED','CANCELLED')
  AND created_at >= DATE_TRUNC('quarter', NOW())
GROUP BY category
ORDER BY total_spend DESC
LIMIT 10;`,
      },
    ],
  },

  /* ── 10. EXCEL & DATA PROCESSING ─────────── */
  {
    id: 'excel', label: 'Excel & Data', icon: '📊',
    color: '#217346', dotClass: 'dot-excel',
    desc: 'Thành thạo Excel nâng cao và xử lý dữ liệu từ web app.',
    skills: [
      {
        id: 'excel-formulas', title: 'Excel Formulas Nâng Cao',
        desc: 'VLOOKUP/XLOOKUP, INDEX-MATCH, SUMIFS, COUNTIFS, IFERROR, dynamic arrays (FILTER, SORT, UNIQUE) — công thức nền tảng cho báo cáo tài chính.',
        demo: 'excel-formula-demo',
      },
      {
        id: 'excel-pivot', title: 'Pivot Table & Power Query',
        desc: 'Pivot Table tổng hợp dữ liệu mua hàng theo nhiều chiều. Power Query (Get & Transform) để làm sạch và gộp nhiều file Excel/CSV tự động.',
        lang: 'text',
        code:
`── Pivot Table: Chi tiêu theo Phòng ban × Danh mục ──────

Rows:    Department (IT, HR, Operations, Marketing)
Columns: Category   (Equipment, Services, Materials, Travel)
Values:  SUM of Amount   → số tiền
         COUNT of OrderID → số đơn

── Power Query: Gộp 12 file báo cáo tháng ──────────────

let
  Source = Folder.Files("C:\\Reports\\2024"),
  FilteredExcel = Table.SelectRows(Source,
    each [Extension] = ".xlsx"),
  AddedContent = Table.AddColumn(FilteredExcel,
    "Data", each Excel.Workbook([Content])),
  ExpandedData = Table.ExpandTableColumn(
    AddedContent, "Data", {"Name","Data"}),
  FilteredSheets = Table.SelectRows(ExpandedData,
    each [Name] = "PurchaseData"),
  Combined = Table.Combine(
    FilteredSheets[Data])
in
  Combined`,
      },
      {
        id: 'excel-vba', title: 'VBA & Macro Automation',
        desc: 'Tự động hoá tác vụ lặp lại: gửi email từ Excel, tạo báo cáo PDF theo lịch, validate dữ liệu nhập, tô màu theo điều kiện phức tạp.',
        lang: 'vba',
        code:
`' ── Tạo báo cáo PO hàng tháng tự động ──────────────────
Sub GenerateMonthlyReport()
    Dim wsData As Worksheet, wsReport As Worksheet
    Dim lastRow As Long, i As Long
    Dim totalSpend As Double, poCount As Long

    Set wsData   = ThisWorkbook.Sheets("PurchaseOrders")
    Set wsReport = ThisWorkbook.Sheets("MonthlyReport")

    ' Xác định tháng hiện tại
    Dim targetMonth As Integer
    targetMonth = Month(Date)

    lastRow = wsData.Cells(wsData.Rows.Count, 1).End(xlUp).Row
    totalSpend = 0 : poCount = 0

    ' Lọc và tổng hợp theo tháng
    For i = 2 To lastRow
        If Month(wsData.Cells(i, 3).Value) = targetMonth _
           And wsData.Cells(i, 6).Value = "PAID" Then
            totalSpend = totalSpend + wsData.Cells(i, 5).Value
            poCount = poCount + 1
        End If
    Next i

    ' Ghi kết quả vào sheet báo cáo
    wsReport.Cells(2, 2).Value = poCount
    wsReport.Cells(3, 2).Value = totalSpend
    wsReport.Cells(4, 2).Value = totalSpend / poCount

    ' Xuất PDF
    wsReport.ExportAsFixedFormat Type:=xlTypePDF, _
        Filename:="Report_" & Format(Date, "YYYY_MM") & ".pdf"

    MsgBox "Báo cáo tháng " & targetMonth & " đã tạo xong!", vbInformation
End Sub`,
      },
      {
        id: 'sheetjs', title: 'SheetJS — Đọc/Ghi Excel từ Web',
        desc: 'Import file Excel từ người dùng upload, xử lý dữ liệu, rồi export lại — không cần backend. Dùng cho form nhập liệu hàng loạt và báo cáo.',
        lang: 'js',
        code:
`import * as XLSX from 'xlsx';

// ── Import: đọc file Excel người dùng upload ──
async function importPurchaseOrders(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(ws, {
    header: ['date','department','vendor','item','qty','unitPrice','total','status'],
    range: 1,          // skip header row
    defval: '',        // default for empty cells
  });

  // Validate & transform
  return rows
    .filter(r => r.vendor && r.total > 0)
    .map(r => ({
      date:       new Date(r.date),
      department: r.department.trim(),
      vendor:     r.vendor.trim(),
      item:       r.item,
      qty:        Number(r.qty),
      unitPrice:  Number(r.unitPrice),
      total:      Number(r.total),
      status:     r.status || 'DRAFT',
    }));
}

// ── Export: tạo file Excel có style ──────────
function exportBudgetReport(data) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: raw data
  const ws1 = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws1['!cols'] = [
    { wch: 12 }, { wch: 16 }, { wch: 22 },
    { wch: 30 }, { wch: 8  }, { wch: 14 }, { wch: 14 },
  ];

  // Sheet 2: summary pivot
  const summary = summarizeByDept(data);
  const ws2 = XLSX.utils.json_to_sheet(summary);

  XLSX.utils.book_append_sheet(wb, ws1, 'Chi tiết');
  XLSX.utils.book_append_sheet(wb, ws2, 'Tổng hợp');
  XLSX.writeFile(wb, \`BaoCaoMuaHang_\${format(new Date(),'yyyy_MM')}.xlsx\`);
}`,
      },
      {
        id: 'data-cleaning', title: 'Data Cleaning & Validation',
        desc: 'Chuẩn hoá dữ liệu nhập từ nhiều nguồn: loại khoảng trắng thừa, chuẩn hoá tên nhà cung cấp, phát hiện trùng lặp, validate số tiền và ngày tháng.',
        lang: 'js',
        code:
`// Pipeline làm sạch dữ liệu mua hàng từ Excel import
function cleanPurchaseRow(raw) {
  return {
    // chuẩn hoá tên
    vendor:     normalizeVendorName(raw.vendor),
    department: raw.department?.trim().toUpperCase(),

    // parse số tiền — chấp nhận "1.500.000" hoặc "1,500,000"
    amount: parseVND(raw.amount),

    // parse ngày — chấp nhận dd/MM/yyyy hoặc MM/dd/yyyy
    date: parseFlexibleDate(raw.date),

    // chuẩn hoá trạng thái
    status: raw.status?.toUpperCase().replace(/\\s+/g, '_') ?? 'DRAFT',
  };
}

function normalizeVendorName(name) {
  if (!name) return '';
  return name
    .trim()
    .replace(/\\s+/g, ' ')                    // nhiều space → 1 space
    .replace(/\\bCO\\.?\\s*LTD\\.?$/i, 'Co. Ltd')  // chuẩn hoá hậu tố
    .replace(/\\bCTY\\s*TNHH/i, 'Cty TNHH');
}

function parseVND(val) {
  if (typeof val === 'number') return val;
  return Number(String(val).replace(/[^0-9]/g, '')) || 0;
}

// Phát hiện đơn hàng trùng lặp
function findDuplicates(rows) {
  const seen = new Map();
  return rows.filter(row => {
    const key = \`\${row.vendor}|\${row.amount}|\${row.date}\`;
    if (seen.has(key)) return true;
    seen.set(key, true);
    return false;
  });
}`,
      },
    ],
  },

  /* ── 11. UX / UI PATTERNS ─────────────────── */
  {
    id: 'uiux', label: 'UX/UI Patterns', icon: '🎨',
    color: '#7c3aed', dotClass: 'dot-uiux',
    desc: 'Các pattern UI/UX nổi tiếng dùng trong dashboard và ứng dụng doanh nghiệp.',
    skills: [
      {
        id: 'dashboard-layout', title: 'Dashboard Layout Patterns',
        desc: 'KPI card grid, sidebar navigation, breadcrumb, collapsible panels, và data-ink ratio — nguyên tắc thiết kế dashboard hiệu quả.',
        demo: 'dashboard-pattern',
      },
      {
        id: 'data-table-ux', title: 'Data Table UX',
        desc: 'Sort, multi-filter, bulk actions, inline edit, row expand, frozen columns, virtual scroll — các pattern cho bảng dữ liệu doanh nghiệp.',
        demo: 'table-pattern',
      },
      {
        id: 'form-ux', title: 'Form UX Patterns',
        desc: 'Multi-step wizard, inline validation, auto-save draft, dependent fields, smart defaults — thiết kế form ít lỗi nhập liệu nhất.',
        lang: 'jsx',
        code:
`// Multi-step form với progress indicator
function PurchaseRequestWizard() {
  const [step, setStep] = useState(0);
  const steps = ['Thông tin chung', 'Chi tiết hàng hóa', 'Phê duyệt & Gửi'];

  return (
    <div>
      {/* Progress stepper */}
      <div className="stepper">
        {steps.map((label, i) => (
          <div key={i} className={\`step \${i <= step ? 'active' : ''}\`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && <StepBasicInfo onNext={() => setStep(1)} />}
      {step === 1 && <StepItemDetail onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <StepReview onBack={() => setStep(1)} onSubmit={submitPO} />}
    </div>
  );
}

// Auto-save draft mỗi 30 giây
useEffect(() => {
  const id = setInterval(() => {
    saveDraft(formValues);
    showToast('Đã lưu nháp tự động', 'info');
  }, 30_000);
  return () => clearInterval(id);
}, [formValues]);`,
      },
      {
        id: 'feedback-states', title: 'Feedback & Loading States',
        desc: 'Skeleton loader, toast notification, progress indicator, empty state, error boundary — không để user bao giờ tự hỏi "app đang làm gì?".',
        demo: 'feedback-demo',
      },
      {
        id: 'design-tokens', title: 'Design Tokens & Component System',
        desc: 'Xây dựng design system với CSS variables (tokens), consistent spacing scale, typography ramp, và colour with accessibility contrast ratio.',
        lang: 'css',
        code:
`/* ── Design Tokens ── */
:root {
  /* Spacing scale (4px base) */
  --space-1: 4px;   --space-2: 8px;
  --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px;

  /* Typography scale */
  --text-xs: .75rem;   --text-sm: .875rem;
  --text-base: 1rem;   --text-lg: 1.125rem;
  --text-xl: 1.25rem;  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Brand colours */
  --color-primary-50:  #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  /* Semantic colours */
  --color-success: #059669;
  --color-warning: #d97706;
  --color-danger:  #dc2626;
  --color-info:    #0891b2;

  /* Elevation (box shadows) */
  --shadow-sm:  0 1px 2px rgba(0,0,0,.05);
  --shadow-md:  0 4px 6px rgba(0,0,0,.07);
  --shadow-lg:  0 10px 15px rgba(0,0,0,.10);
  --shadow-xl:  0 20px 25px rgba(0,0,0,.15);

  /* Border radius scale */
  --radius-sm: 4px; --radius-md: 8px;
  --radius-lg: 12px; --radius-full: 9999px;
}

/* Component using tokens */
.btn-primary {
  background: var(--color-primary-500);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  box-shadow: var(--shadow-sm);
}`,
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

    case 'po-flow': return `
      <div class="demo-area">
        <div class="demo-title">Purchase Order — Luồng Trạng Thái</div>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem;align-items:center">
          ${[
            ['DRAFT','#64748b'],['PENDING_APPROVAL','#d97706'],
            ['APPROVED','#2563eb'],['ORDERED','#7c3aed'],
            ['RECEIVED','#0891b2'],['INVOICED','#dc2626'],['PAID','#059669'],
          ].map(([s,c],i,arr) => `
            <span style="background:${c}22;color:${c};border:1px solid ${c}55;
                          border-radius:6px;padding:.2rem .55rem;font-size:.72rem;font-weight:700">
              ${s.replace(/_/g,' ')}
            </span>
            ${i < arr.length-1 ? `<span style="color:var(--muted);font-size:.8rem">→</span>` : ''}
          `).join('')}
        </div>
        <div style="font-size:.75rem;color:var(--muted);margin-top:.6rem">
          Quy tắc phê duyệt: &lt;5M → Trưởng phòng &nbsp;|&nbsp; 5–50M → Quản lý &nbsp;|&nbsp; &gt;50M → Giám đốc
        </div>
      </div>`;

    case 'budget-demo': return `
      <div class="demo-area">
        <div class="demo-title">Ngân sách vs Chi tiêu thực tế — Tháng 3/2026</div>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          ${[
            ['IT Equipment',    42000000, 38500000, '#2563eb'],
            ['Office Supplies',  8000000,  5200000, '#0891b2'],
            ['Marketing',       25000000, 23800000, '#d97706'],
            ['Training',        12000000,  4100000, '#059669'],
            ['Travel',          15000000, 16200000, '#dc2626'],
          ].map(([dept, budget, spent, color]) => {
            const pct = Math.min(Math.round(spent/budget*100), 100);
            const over = spent > budget;
            return `
              <div>
                <div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:.2rem">
                  <span>${dept}</span>
                  <span style="color:${over?'#dc2626':'var(--muted)'}">
                    ${(spent/1e6).toFixed(1)}M / ${(budget/1e6).toFixed(0)}M VND
                    ${over ? ' ⚠️ Vượt ngân sách' : `(${pct}%)`}
                  </span>
                </div>
                <div style="height:6px;background:var(--border);border-radius:99px;overflow:hidden">
                  <div style="width:${pct}%;height:100%;background:${over?'#dc2626':color};border-radius:99px"></div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;

    case 'excel-formula-demo': return `
      <div class="demo-area">
        <div class="demo-title">Excel Formula Cheat Sheet</div>
        <div style="display:flex;flex-direction:column;gap:.35rem">
          ${[
            ['XLOOKUP', '=XLOOKUP(A2,VendorList!A:A,VendorList!B:B,"Không tìm thấy")', 'Tìm nhà cung cấp theo mã'],
            ['SUMIFS',  '=SUMIFS(Amount,Dept,C2,Month,D2,Status,"PAID")',                'Tổng chi tiêu lọc nhiều điều kiện'],
            ['FILTER',  '=FILTER(A2:E100,E2:E100="PENDING_APPROVAL")',                   'Dynamic array lọc PO chờ duyệt'],
            ['UNIQUE',  '=UNIQUE(FILTER(Vendor,Dept=F1))',                               'Danh sách nhà cung cấp duy nhất theo phòng'],
            ['IFS',     '=IFS(G2<5e6,"Trưởng phòng",G2<5e7,"Quản lý",TRUE,"Giám đốc")', 'Phân cấp duyệt theo số tiền'],
          ].map(([fn, formula, desc]) => `
            <div style="border:1px solid var(--border);border-radius:6px;padding:.4rem .6rem">
              <div style="display:flex;gap:.5rem;align-items:baseline">
                <span style="background:#217346;color:#fff;border-radius:4px;padding:.1rem .4rem;
                              font-size:.68rem;font-weight:800;flex-shrink:0">${fn}</span>
                <code style="font-size:.72rem;color:var(--text);word-break:break-all">${esc(formula)}</code>
              </div>
              <div style="font-size:.72rem;color:var(--muted);margin-top:.2rem">${esc(desc)}</div>
            </div>
          `).join('')}
        </div>
      </div>`;

    case 'dashboard-pattern': return `
      <div class="demo-area">
        <div class="demo-title">Dashboard Layout — KPI + Chart + Table</div>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          <!-- KPI row -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem">
            ${[
              ['Tổng PO tháng','47 đơn','#2563eb','+12% so tháng trước'],
              ['Tổng chi tiêu','842M VND','#0f766e','+5%'],
              ['Chờ phê duyệt','8 đơn','#d97706','Cần xử lý hôm nay'],
              ['Nhà cung cấp','23 NCC','#7c3aed','Active'],
            ].map(([label,val,c,sub]) => `
              <div style="background:${c}11;border:1px solid ${c}33;border-radius:6px;padding:.5rem">
                <div style="font-size:.65rem;color:var(--muted)">${label}</div>
                <div style="font-size:1rem;font-weight:800;color:${c}">${val}</div>
                <div style="font-size:.62rem;color:var(--muted)">${sub}</div>
              </div>
            `).join('')}
          </div>
          <!-- fake chart placeholder -->
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;
                       height:60px;display:flex;align-items:center;justify-content:center;
                       font-size:.75rem;color:var(--muted)">
            📊 Biểu đồ chi tiêu 6 tháng (Bar chart)
          </div>
          <!-- fake table -->
          <div style="font-size:.72rem;border:1px solid var(--border);border-radius:6px;overflow:hidden">
            <div style="background:var(--border);display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
                         padding:.3rem .6rem;font-weight:700">
              <span>Nhà cung cấp</span><span>Số đơn</span><span>Tổng tiền</span><span>Trạng thái</span>
            </div>
            ${[['Công ty ABC','5','120M VND','✓ Tốt'],['XYZ Ltd','3','85M VND','⚠ Trễ hàng'],
               ['Thiết bị DEF','4','67M VND','✓ Tốt']].map(([v,n,t,s])=>`
              <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
                           padding:.3rem .6rem;border-top:1px solid var(--border)">
                <span>${v}</span><span>${n}</span><span>${t}</span><span>${s}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;

    case 'table-pattern': return `
      <div class="demo-area">
        <div class="demo-title">Data Table UX Patterns</div>
        <div style="display:flex;flex-direction:column;gap:.4rem">
          ${[
            ['🔃 Sortable columns','Click header để sort ASC/DESC, giữ Shift để multi-sort'],
            ['🔍 Column filter','Filter riêng từng cột: text search, date range, checkbox multi-select'],
            ['☑️ Bulk actions','Chọn nhiều row → Delete / Approve / Export hàng loạt'],
            ['✏️ Inline edit','Double-click cell để edit trực tiếp, Enter để save, Esc để huỷ'],
            ['📌 Frozen columns','Fix cột ID + Tên khi scroll ngang bảng rộng'],
            ['🔽 Row expand','Click mũi tên để xem chi tiết PO items inline'],
            ['📄 Pagination','Server-side pagination + page size selector + nhảy đến trang'],
          ].map(([p,d]) => `
            <div style="display:flex;gap:.6rem;align-items:flex-start;font-size:.78rem">
              <span style="flex-shrink:0">${p.split(' ')[0]}</span>
              <div>
                <strong>${p.slice(p.indexOf(' ')+1)}</strong>
                <span style="color:var(--muted)"> — ${d}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;

    case 'feedback-demo': return `
      <div class="demo-area">
        <div class="demo-title">Feedback States — click để xem</div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem">
          ${['loading','success','error','empty','skeleton'].map(s => `
            <button onclick="showFeedback('${skillId}','${s}')"
              style="border:1px solid var(--border);background:none;border-radius:6px;
                     padding:.25rem .65rem;font-size:.78rem;cursor:pointer;color:var(--text)">
              ${s}
            </button>
          `).join('')}
        </div>
        <div id="feedback-preview-${skillId}" style="min-height:60px;display:flex;
              align-items:center;justify-content:center;background:var(--bg);
              border-radius:6px;border:1px solid var(--border);padding:.75rem;font-size:.82rem;color:var(--muted)">
          ← Click một trạng thái để xem preview
        </div>
      </div>`;

    case 'canvas-chart': return `
      <div class="demo-area">
        <div class="demo-title">Revenue vs Expenses — Last 6 Months</div>
        <canvas id="chart-${skillId}" height="180" style="width:100%"></canvas>
        <script>
          (function(){
            const ctx = document.getElementById('chart-${skillId}');
            if (!ctx || ctx._chartInit) return;
            ctx._chartInit = true;
            const months = ['Oct','Nov','Dec','Jan','Feb','Mar'];
            const revenue  = [42,58,95,67,80,74];
            const expenses = [30,41,60,50,55,48];
            const dark = document.documentElement.getAttribute('data-theme')==='dark';
            const grid = dark ? '#334155' : '#e2e8f0';
            const textC = dark ? '#94a3b8' : '#64748b';
            // manual chart using canvas 2d
            const W = ctx.offsetWidth || 320, H = 180;
            ctx.width = W; ctx.height = H;
            const g = ctx.getContext('2d');
            const pad = { t:10, r:20, b:30, l:45 };
            const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
            const max = 120;
            // grid lines
            [0,30,60,90,120].forEach(v => {
              const y = pad.t + ch - (v/max)*ch;
              g.strokeStyle = grid; g.lineWidth = 1;
              g.beginPath(); g.moveTo(pad.l, y); g.lineTo(pad.l+cw, y); g.stroke();
              g.fillStyle = textC; g.font = '10px system-ui';
              g.fillText(v+'M', 2, y+4);
            });
            // bars
            const bw = (cw/months.length)*0.35;
            months.forEach((m,i) => {
              const x = pad.l + (i/months.length)*cw + (cw/months.length)*0.1;
              // revenue bar
              const rh = (revenue[i]/max)*ch;
              g.fillStyle = '#0f766e';
              g.fillRect(x, pad.t+ch-rh, bw, rh);
              // expense bar
              const eh = (expenses[i]/max)*ch;
              g.fillStyle = '#f97316';
              g.fillRect(x+bw+2, pad.t+ch-eh, bw, eh);
              // label
              g.fillStyle = textC; g.font = '9px system-ui';
              g.fillText(m, x, H-8);
            });
            // legend
            g.fillStyle='#0f766e'; g.fillRect(W-110,8,10,10);
            g.fillStyle=textC; g.font='10px system-ui'; g.fillText('Revenue',W-97,17);
            g.fillStyle='#f97316'; g.fillRect(W-110,22,10,10);
            g.fillText('Expenses',W-97,31);
          })();
        <\/script>
      </div>`;

    case 'currency-demo': return `
      <div class="demo-area">
        <div class="demo-title">Currency Formatter — live preview</div>
        <div class="redis-demo">
          <div style="font-size:.75rem;color:var(--muted);margin-bottom:.4rem">
            Enter an amount to format in multiple currencies
          </div>
          <div class="redis-cmd-row">
            <input class="redis-input" id="cur-input-${skillId}" type="number"
                   value="1500000" placeholder="Amount…" oninput="formatCurrency('${skillId}')" />
          </div>
          <div id="cur-out-${skillId}" style="display:flex;flex-direction:column;gap:.35rem;margin-top:.5rem"></div>
        </div>
      </div>`;

    case 'rbac-demo': return `
      <div class="demo-area">
        <div class="demo-title">Role-Based Access Control — switch role to see UI changes</div>
        <div style="display:flex;gap:.5rem;margin-bottom:.75rem;flex-wrap:wrap">
          ${['admin','staff','viewer'].map(r => `
            <button class="rbac-role-btn" data-role="${r}" data-skill="${skillId}"
              onclick="setRole('${skillId}','${r}')"
              style="border:2px solid var(--border);background:${r==='viewer'?'var(--accent)':'none'};
                     color:${r==='viewer'?'#fff':'var(--muted)'};border-radius:6px;
                     padding:.25rem .7rem;font-size:.78rem;font-weight:700;cursor:pointer">
              ${r.charAt(0).toUpperCase()+r.slice(1)}
            </button>
          `).join('')}
        </div>
        <div id="rbac-ui-${skillId}">
          ${rbacUi('viewer')}
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
  // draw canvas charts if this section has them
  requestAnimationFrame(drawCanvasCharts);
  // init currency demo if present
  const curIn = document.querySelector(`#cur-input-${id}-charts`) ??
                document.getElementById(`cur-input-charts`);
  document.querySelectorAll('[id^="cur-input-"]').forEach(el => {
    formatCurrency(el.id.replace('cur-input-', ''));
  });

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
    { header: 'Business', items: CATEGORIES.filter(c => ['commerce','excel','uiux'].includes(c.id)) },
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

/* ── Currency formatter demo ───────────────────────────────────── */
window.formatCurrency = function(skillId) {
  const raw = parseFloat($(`cur-input-${skillId}`)?.value ?? 0);
  const out = $(`cur-out-${skillId}`);
  if (!out || isNaN(raw)) return;
  const locales = [
    { code: 'vi-VN', currency: 'VND', label: '🇻🇳 VND' },
    { code: 'en-US', currency: 'USD', label: '🇺🇸 USD' },
    { code: 'en-GB', currency: 'GBP', label: '🇬🇧 GBP' },
    { code: 'ja-JP', currency: 'JPY', label: '🇯🇵 JPY' },
  ];
  out.innerHTML = locales.map(({ code, currency, label }) => {
    const fmt = new Intl.NumberFormat(code, { style: 'currency', currency }).format(raw);
    return `<div style="display:flex;justify-content:space-between;font-size:.82rem;
                         padding:.25rem .1rem;border-bottom:1px solid var(--border)">
              <span style="color:var(--muted)">${label}</span>
              <span style="font-family:monospace;font-weight:700">${esc(fmt)}</span>
            </div>`;
  }).join('');
};

/* ── RBAC demo ─────────────────────────────────────────────────── */
const RBAC_PERMS = {
  admin:  { canViewRevenue: true,  canEditProducts: true,  canDeleteOrders: true,  canManageUsers: true  },
  staff:  { canViewRevenue: false, canEditProducts: true,  canDeleteOrders: false, canManageUsers: false },
  viewer: { canViewRevenue: false, canEditProducts: false, canDeleteOrders: false, canManageUsers: false },
};

function rbacUi(role) {
  const p = RBAC_PERMS[role];
  const item = (allowed, label) => `
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem;padding:.25rem 0">
      <span style="color:${allowed ? 'var(--success)' : 'var(--danger)'}">${allowed ? '✓' : '✗'}</span>
      <span style="color:${allowed ? 'var(--text)' : 'var(--muted)'};
                   text-decoration:${allowed ? 'none' : 'line-through'}">${label}</span>
    </div>`;
  return `
    <div style="background:var(--bg);border-radius:6px;padding:.6rem .8rem">
      <div style="font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.4rem">
        Permissions for: <span style="color:var(--accent)">${role}</span>
      </div>
      ${item(p.canViewRevenue,   'View revenue & financial reports')}
      ${item(p.canEditProducts,  'Add / edit products')}
      ${item(p.canDeleteOrders,  'Delete orders')}
      ${item(p.canManageUsers,   'Manage user accounts')}
    </div>`;
}

window.setRole = function(skillId, role) {
  const ui = $(`rbac-ui-${skillId}`);
  if (ui) ui.innerHTML = rbacUi(role);
  // update button styles
  document.querySelectorAll(`.rbac-role-btn[data-skill="${skillId}"]`).forEach(btn => {
    const active = btn.dataset.role === role;
    btn.style.background = active ? 'var(--accent)' : 'none';
    btn.style.color = active ? '#fff' : 'var(--muted)';
    btn.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
  });
};

/* ── Feedback state demo ───────────────────────────────────────── */
window.showFeedback = function(skillId, state) {
  const el = document.getElementById(`feedback-preview-${skillId}`);
  if (!el) return;
  const templates = {
    loading: `<div style="display:flex;flex-direction:column;align-items:center;gap:.5rem">
        <div style="width:28px;height:28px;border:3px solid var(--border);
                     border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite"></div>
        <span>Đang tải dữ liệu…</span>
      </div>`,
    success: `<div style="display:flex;align-items:center;gap:.6rem;
                             background:#05966918;color:#059669;padding:.5rem .8rem;border-radius:8px">
        <span style="font-size:1.1rem">✓</span>
        <span><strong>Đơn hàng đã được phê duyệt!</strong> Nhà cung cấp sẽ được thông báo.</span>
      </div>`,
    error: `<div style="display:flex;align-items:center;gap:.6rem;
                          background:#dc262618;color:#dc2626;padding:.5rem .8rem;border-radius:8px">
        <span style="font-size:1.1rem">⚠</span>
        <div><strong>Không thể lưu thay đổi.</strong><br>
          <span style="font-size:.78rem">Vui lòng kiểm tra kết nối và thử lại.</span></div>
      </div>`,
    empty: `<div style="display:flex;flex-direction:column;align-items:center;gap:.4rem;
                          padding:1rem;color:var(--muted);text-align:center">
        <span style="font-size:2rem">📭</span>
        <strong>Không có đơn hàng nào</strong>
        <span style="font-size:.8rem">Thay đổi bộ lọc hoặc tạo đơn hàng mới.</span>
        <button style="background:var(--accent);color:#fff;border:none;border-radius:6px;
                         padding:.3rem .8rem;font-size:.78rem;cursor:pointer;margin-top:.3rem">
          + Tạo đơn hàng
        </button>
      </div>`,
    skeleton: `<div style="display:flex;flex-direction:column;gap:.4rem;width:100%">
        ${[1,2,3].map(() => `
          <div style="display:grid;grid-template-columns:1fr 2fr 1fr;gap:.5rem">
            <div style="height:12px;background:var(--border);border-radius:4px;
                          animation:pulse 1.5s ease-in-out infinite"></div>
            <div style="height:12px;background:var(--border);border-radius:4px;
                          animation:pulse 1.5s ease-in-out infinite"></div>
            <div style="height:12px;background:var(--border);border-radius:4px;
                          animation:pulse 1.5s ease-in-out infinite"></div>
          </div>`).join('')}
      </div>`,
  };
  el.innerHTML = templates[state] ?? '';
};

/* ── Draw canvas charts after section becomes visible ───────────── */
function drawCanvasCharts() {
  document.querySelectorAll('canvas[id^="chart-"]').forEach(ctx => {
    if (ctx._chartInit) return;
    ctx._chartInit = true;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const grid  = dark ? '#334155' : '#e2e8f0';
    const textC = dark ? '#94a3b8' : '#64748b';
    const months   = ['Oct','Nov','Dec','Jan','Feb','Mar'];
    const revenue  = [42, 58, 95, 67, 80, 74];
    const expenses = [30, 41, 60, 50, 55, 48];
    const W = ctx.parentElement.offsetWidth - 32 || 320, H = 180;
    ctx.width = W; ctx.height = H;
    const g = ctx.getContext('2d');
    const pad = { t:10, r:110, b:30, l:45 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const max = 120;

    // horizontal grid
    [0, 30, 60, 90, 120].forEach(v => {
      const y = pad.t + ch - (v / max) * ch;
      g.strokeStyle = grid; g.lineWidth = 1;
      g.beginPath(); g.moveTo(pad.l, y); g.lineTo(pad.l + cw, y); g.stroke();
      g.fillStyle = textC; g.font = '10px system-ui';
      g.textAlign = 'right'; g.fillText(v + 'M', pad.l - 4, y + 4);
    });

    // bars
    const slotW = cw / months.length;
    const bw = slotW * 0.32;
    months.forEach((m, i) => {
      const x = pad.l + i * slotW + slotW * 0.1;
      const rh = (revenue[i] / max) * ch;
      g.fillStyle = '#0f766e88';
      g.fillRect(x, pad.t + ch - rh, bw, rh);
      const eh = (expenses[i] / max) * ch;
      g.fillStyle = '#f9731688';
      g.fillRect(x + bw + 2, pad.t + ch - eh, bw, eh);
      g.fillStyle = textC; g.font = '9px system-ui';
      g.textAlign = 'center';
      g.fillText(m, x + bw, H - 6);
    });

    // legend
    const lx = W - 100, ly = 14;
    g.fillStyle = '#0f766e'; g.fillRect(lx, ly, 10, 10);
    g.fillStyle = textC; g.font = '10px system-ui'; g.textAlign = 'left';
    g.fillText('Revenue', lx + 14, ly + 9);
    g.fillStyle = '#f97316'; g.fillRect(lx, ly + 16, 10, 10);
    g.fillText('Expenses', lx + 14, ly + 25);
  });
}

/* ── Init ──────────────────────────────────────────────────────── */
buildNav();
renderAll();
updateProgress();
requestAnimationFrame(drawCanvasCharts);
