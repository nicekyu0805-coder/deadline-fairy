-- Create a table for users (profiles)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  phone text,
  is_admin boolean default false,
  subscription_status text check (subscription_status in ('free', 'active', 'expired')) default 'free',
  subscription_end_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Register profiles when a user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. 결제 로그 테이블 생성
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  currency text default 'KRW',
  status text not null,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for goals
create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  task text not null,
  deadline timestamp with time zone not null,
  status text check (status in ('pending', 'in-progress', 'verified', 'failed')) default 'pending' not null,
  stakes_mode text check (stakes_mode in ('gentle', 'ruthless')) default 'gentle' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for message logs
create table messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  goal_id uuid references goals(id) on delete cascade,
  content text not null,
  type text check (type in ('sms', 'whatsapp', 'email', 'system')) default 'sms' not null,
  direction text check (direction in ('inbound', 'outbound')) not null,
  status text default 'sent' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table goals enable row level security;
alter table messages enable row level security;

-- Profiles: Users can view their own profile, admins can view all
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Goals: Users can view/create own goals, admins can view/update all
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can create own goals" on goals for insert with check (auth.uid() = user_id);
create policy "Admins can manage all goals" on goals for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Messages: Users can view messages sent to them, admins can view all
create policy "Users can view own messages" on messages for select using (auth.uid() = user_id);
create policy "Admins can manage all messages" on messages for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
-- Page views tracking table
create table public.page_views (
  id uuid default gen_random_uuid() primary key,
  page_path text not null,
  referrer text,
  ip_hash text, -- Privacy-friendly way to count unique visitors
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for page_views
alter table public.page_views enable row level security;
create policy "Anyone can insert page views" on public.page_views for insert with check (true);
create policy "Admins can view all page views" on public.page_views for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
