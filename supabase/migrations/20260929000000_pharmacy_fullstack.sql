create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'patient' check (role in ('patient', 'pharmacien', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  region text,
  created_at timestamptz not null default now()
);

create table if not exists public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  address text,
  city text,
  region text,
  phone text,
  email text,
  latitude double precision,
  longitude double precision,
  description text,
  website text,
  logo_url text,
  pharmacist_registration_number text,
  pharmacy_authorization_number text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  validated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.pharmacy_documents (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  type text not null check (type in ('license', 'tax_document', 'certificate')),
  file_url text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.medicaments (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  categorie text,
  ordonnance_requise boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.stocks (
  pharmacie_id uuid not null references public.pharmacies(id) on delete cascade,
  medicament_id uuid not null references public.medicaments(id) on delete cascade,
  quantite integer not null default 0,
  prix integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (pharmacie_id, medicament_id)
);

create table if not exists public.ordonnances (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  pharmacie_id uuid not null references public.pharmacies(id) on delete cascade,
  fichier_url text not null,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'validee', 'rejetee')),
  created_at timestamptz not null default now()
);

create table if not exists public.commandes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  pharmacie_id uuid not null references public.pharmacies(id) on delete cascade,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'confirmee', 'prete', 'recuperee', 'annulee')),
  total integer not null default 0,
  date timestamptz not null default now()
);

create table if not exists public.commande_items (
  commande_id uuid not null references public.commandes(id) on delete cascade,
  medicament_id uuid not null references public.medicaments(id) on delete cascade,
  quantite integer not null,
  prix_unitaire integer not null,
  primary key (commande_id, medicament_id)
);

create table if not exists public.pharmacy_reviews (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null,
  decision text not null check (decision in ('approved', 'rejected')),
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone, region)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'patient'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region'
  )
  on conflict (id) do update set
    role = excluded.role,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    region = coalesce(excluded.region, public.profiles.region);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pharmacies enable row level security;
alter table public.pharmacy_documents enable row level security;
alter table public.pharmacy_reviews enable row level security;
alter table public.medicaments enable row level security;
alter table public.stocks enable row level security;
alter table public.ordonnances enable row level security;
alter table public.commandes enable row level security;
alter table public.commande_items enable row level security;

create policy "Profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = id);

create policy "Profiles can be updated by owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Profiles can be inserted by self"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Approved pharmacies are visible to everyone"
on public.pharmacies
for select
using (status = 'approved' or owner_id = auth.uid());

create policy "Pharmacists can create their pharmacy"
on public.pharmacies
for insert
with check (owner_id = auth.uid());

create policy "Pharmacists can update their pharmacy"
on public.pharmacies
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Admins can manage pharmacy reviews"
on public.pharmacy_reviews
for all
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Pharmacy docs visible to owner"
on public.pharmacy_documents
for select
using (exists (
  select 1
  from public.pharmacies p
  where p.id = pharmacy_documents.pharmacy_id
    and p.owner_id = auth.uid()
));

create policy "Pharmacy docs managed by owner"
on public.pharmacy_documents
for all
using (exists (
  select 1
  from public.pharmacies p
  where p.id = pharmacy_documents.pharmacy_id
    and p.owner_id = auth.uid()
))
with check (exists (
  select 1
  from public.pharmacies p
  where p.id = pharmacy_documents.pharmacy_id
    and p.owner_id = auth.uid()
));

create policy "Medicaments readable by everyone"
on public.medicaments
for select
using (true);

create policy "Authenticated users can manage stocks"
on public.stocks
for all
using (
  exists (
    select 1
    from public.pharmacies p
    where p.id = stocks.pharmacie_id
      and p.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.pharmacies p
    where p.id = stocks.pharmacie_id
      and p.owner_id = auth.uid()
  )
);

create policy "Users can access their own orders"
on public.commandes
for all
using (patient_id = auth.uid() or exists (
  select 1
  from public.pharmacies p
  where p.id = commandes.pharmacie_id
    and p.owner_id = auth.uid()
))
with check (patient_id = auth.uid() or exists (
  select 1
  from public.pharmacies p
  where p.id = commandes.pharmacie_id
    and p.owner_id = auth.uid()
));

create policy "Users can access related order items"
on public.commande_items
for all
using (
  exists (
    select 1
    from public.commandes c
    where c.id = commande_items.commande_id
      and (
        c.patient_id = auth.uid() or exists (
          select 1
          from public.pharmacies p
          where p.id = c.pharmacie_id
            and p.owner_id = auth.uid()
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.commandes c
    where c.id = commande_items.commande_id
      and (
        c.patient_id = auth.uid() or exists (
          select 1
          from public.pharmacies p
          where p.id = c.pharmacie_id
            and p.owner_id = auth.uid()
        )
      )
  )
);

create policy "Users can read their own prescriptions"
on public.ordonnances
for select
using (patient_id = auth.uid() or exists (
  select 1
  from public.pharmacies p
  where p.id = ordonnances.pharmacie_id
    and p.owner_id = auth.uid()
));

create policy "Pharmacies can manage their prescriptions"
on public.ordonnances
for insert
with check (exists (
  select 1
  from public.pharmacies p
  where p.id = ordonnances.pharmacie_id
    and p.owner_id = auth.uid()
));
