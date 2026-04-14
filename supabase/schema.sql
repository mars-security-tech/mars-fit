-- ================================================================
-- MĀRS FIT · Supabase schema
-- Ejecutar en el SQL editor de Supabase
-- ================================================================

-- Perfiles (1:1 con auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('civil','operativo')),
  mars_unit text,
  sex text check (sex in ('m','f')),
  age int,
  height_cm int,
  weight_kg numeric,
  activity numeric,
  experience text,
  equipment text,
  goal text,
  diet_id text,
  routine_id text,
  created_at timestamptz default now()
);

-- Entrenos registrados
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  routine_id text,
  day_idx int,
  sets jsonb not null default '[]',
  created_at timestamptz default now()
);
create index if not exists workouts_user_date on workouts(user_id, date desc);

-- Comidas registradas
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_name text,
  items jsonb default '[]',
  kcal int,
  protein_g int,
  carbs_g int,
  fats_g int,
  photo_url text,
  ai_source text,
  created_at timestamptz default now()
);
create index if not exists meals_user_date on meals(user_id, date desc);

-- Peso corporal
create table if not exists bodyweight (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  kg numeric not null,
  created_at timestamptz default now()
);

-- Escuadrones
create table if not exists circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  kind text default 'civil',          -- 'civil' | 'operativo'
  mars_unit text,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists circle_members (
  circle_id uuid references circles(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (circle_id, user_id)
);

-- Actividad del escuadrón (feed)
create table if not exists feed_items (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,                 -- 'workout' | 'meal' | 'progress' | 'streak' | 'challenge'
  badge text,                         -- 'fire' | 'ok' | 'ghost'
  text text not null,
  payload jsonb,
  created_at timestamptz default now()
);
create index if not exists feed_circle_created on feed_items(circle_id, created_at desc);

-- Reacciones (picadas)
create table if not exists reactions (
  feed_id uuid references feed_items(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  emoji text not null default '🔥',
  created_at timestamptz default now(),
  primary key (feed_id, user_id, emoji)
);

-- Subscripciones Web Push (notificaciones)
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- ================================================================
-- Row Level Security
-- ================================================================
alter table profiles enable row level security;
alter table workouts enable row level security;
alter table meals enable row level security;
alter table bodyweight enable row level security;
alter table circles enable row level security;
alter table circle_members enable row level security;
alter table feed_items enable row level security;
alter table reactions enable row level security;
alter table push_subscriptions enable row level security;

-- Self-access en datos personales
create policy "self" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "self" on workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on bodyweight for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Círculos: miembros pueden leer, owner puede gestionar
create policy "member read" on circles for select using (
  exists (select 1 from circle_members cm where cm.circle_id = circles.id and cm.user_id = auth.uid())
);
create policy "owner manage" on circles for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "member read members" on circle_members for select using (
  exists (select 1 from circle_members cm2 where cm2.circle_id = circle_members.circle_id and cm2.user_id = auth.uid())
);
create policy "self join" on circle_members for insert with check (auth.uid() = user_id);
create policy "self leave" on circle_members for delete using (auth.uid() = user_id);

-- Feed: miembros del círculo leen, autor escribe
create policy "circle member read feed" on feed_items for select using (
  exists (select 1 from circle_members cm where cm.circle_id = feed_items.circle_id and cm.user_id = auth.uid())
);
create policy "self post feed" on feed_items for insert with check (auth.uid() = user_id);

-- Reacciones
create policy "circle member read reactions" on reactions for select using (
  exists (
    select 1 from feed_items fi
    join circle_members cm on cm.circle_id = fi.circle_id
    where fi.id = reactions.feed_id and cm.user_id = auth.uid()
  )
);
create policy "self react" on reactions for insert with check (auth.uid() = user_id);
create policy "self unreact" on reactions for delete using (auth.uid() = user_id);
