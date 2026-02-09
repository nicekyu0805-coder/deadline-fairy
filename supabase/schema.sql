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

-- 8. 페이지 뷰 통계 테이블
create table public.page_views (
  id uuid default gen_random_uuid() primary key,
  page_path text not null,
  referrer text,
  ip_hash text, -- Privacy-friendly unique visitor count
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 61. RLS (Row Level Security) 활성화
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.messages enable row level security;
alter table public.payments enable row level security;
alter table public.page_views enable row level security;

-- 62. Profiles 보안 정책
create policy "사용자는 자신의 프로필만 조회 가능" on public.profiles
  for select using (auth.uid() = id);

create policy "사용자는 자신의 프로필만 수정 가능" on public.profiles
  for update using (auth.uid() = id);

create policy "관리자는 모든 프로필 조회 가능" on public.profiles
  for select using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- 63. Goals 보안 정책
create policy "사용자는 자신의 목표만 조회 가능" on public.goals
  for select using (auth.uid() = user_id);

create policy "사용자는 자신의 목표만 생성 가능" on public.goals
  for insert with check (auth.uid() = user_id);

create policy "사용자는 자신의 목표만 수정 가능" on public.goals
  for update using (auth.uid() = user_id);

create policy "관리자는 모든 목표 관리 가능" on public.goals
  for all using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- 64. Messages 보안 정책
create policy "사용자는 자신과 관련된 메시지만 조회 가능" on public.messages
  for select using (auth.uid() = user_id);

create policy "관리자는 모든 메시지 관리 가능" on public.messages
  for all using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- 65. Payments 보안 정책
create policy "사용자는 자신의 결제 내역만 조회 가능" on public.payments
  for select using (auth.uid() = user_id);

create policy "관리자는 모든 결제 내역 관리 가능" on public.payments
  for all using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- 66. Page Views 보안 정책
create policy "누구나 페이지 뷰 기록 가능" on public.page_views
  for insert with check (true);

create policy "관리자만 페이지 뷰 통계 조회 가능" on public.page_views
  for select using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );
  );
