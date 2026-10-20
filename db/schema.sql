-- AS Estamparia — esquema do banco (Neon Postgres)
-- Dados compartilhados do site (config, catálogo, galeria, cupons)
create table if not exists as_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Arquivos enviados (artes dos clientes e fotos de produtos)
create table if not exists as_files (
  id text primary key,
  name text not null,
  mime text not null,
  size integer not null,
  data bytea not null,
  created_at timestamptz not null default now()
);

-- Contatos, ideias de personalização e pedidos enviados pelo site
create table if not exists as_leads (
  id bigserial primary key,
  kind text not null,               -- contato | ideia | produto | pedido
  name text not null,
  phone text,
  email text,
  subject text,
  message text,
  data jsonb not null default '{}'::jsonb,
  files jsonb not null default '[]'::jsonb,
  status text not null default 'novo',
  created_at timestamptz not null default now()
);
create index if not exists as_leads_kind_created on as_leads (kind, created_at desc);


-- Contas de clientes (Minha conta)
create table if not exists as_customers (
  id bigserial primary key,
  name text not null,
  email text not null unique,         -- sempre em minúsculas
  phone text,
  salt text not null,
  hash text not null,
  created_at timestamptz not null default now()
);
alter table as_leads add column if not exists customer_id bigint references as_customers(id) on delete set null;
create index if not exists as_leads_customer on as_leads (customer_id, created_at desc);

-- Permissões: aplicadas por db/migrate.mjs para o usuário de DATABASE_URL.
