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

-- Permissões do usuário usado pelo site em produção
grant select, insert, update, delete on as_kv, as_files, as_leads to gravity_runtime_app;
grant usage, select on sequence as_leads_id_seq to gravity_runtime_app;
