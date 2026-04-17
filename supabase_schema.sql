-- ==========================================================
-- TRANSIFY : SCRIPT DE CONFIGURATION PRODUCTION (FINAL)
-- ==========================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 0.1 TYPES PERSONNALISÉS (ENUMS)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'transitaire', 'admin', 'scanner', 'support');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'received', 'loaded', 'in_transit', 'arrived', 'delivered', 'problem', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE shipment_status AS ENUM ('preparation', 'loaded', 'in_transit', 'arrived', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. TABLES
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  banner TEXT,
  slogan TEXT,
  description TEXT,
  address_china TEXT,
  address_africa TEXT,
  countries TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  services JSONB DEFAULT '[]',
  gallery TEXT[] DEFAULT '{}',
  total_packages INTEGER DEFAULT 0,
  show_total_packages BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'open',
  show_price TEXT DEFAULT 'full',
  show_reviews BOOLEAN DEFAULT TRUE,
  contact JSONB DEFAULT '{}',
  style TEXT DEFAULT 'minimalist',
  locations JSONB DEFAULT '{"africa": true, "china": true}',
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role DEFAULT 'client',
  country TEXT,
  phone TEXT,
  avatar TEXT,
  company_id UUID REFERENCES companies(id),
  subscription TEXT DEFAULT 'starter',
  favorites UUID[] DEFAULT '{}',
  profile_progress INTEGER DEFAULT 20,
  addresses JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_phone2 TEXT,
  company_id UUID REFERENCES companies(id),
  company_name TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_type TEXT NOT NULL,
  status order_status DEFAULT 'pending',
  weight DECIMAL(10, 2),
  cbm DECIMAL(10, 2),
  dimensions JSONB,
  price DECIMAL(15, 2),
  destination TEXT NOT NULL,
  tracking_number TEXT UNIQUE NOT NULL,
  description TEXT,
  qr_code TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  departure_date TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  company_id UUID REFERENCES companies(id),
  client_id UUID REFERENCES profiles(id),
  client_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  criteria JSONB DEFAULT '{"speed": 5, "communication": 5, "safety": 5, "price": 5}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users,
  receiver_id UUID REFERENCES auth.users,
  sender_name TEXT,
  order_id UUID REFERENCES orders(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  type TEXT,
  reference TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  route JSONB DEFAULT '{"from": "Guangzhou", "to": "Dakar"}',
  capacity JSONB DEFAULT '{"total": 0, "used": 0, "unit": "kg"}',
  status shipment_status DEFAULT 'preparation',
  package_count INTEGER DEFAULT 0,
  order_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.1 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INDEXES (PERFORMANCE)
CREATE INDEX IF NOT EXISTS idx_p_c ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_o_cl ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_o_co ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_s_co ON shipments(company_id);
CREATE INDEX IF NOT EXISTS idx_notif_u ON notifications(user_id);

-- 3. SÉCURITÉ (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- POLITIQUES (Exclut les doublons si déjà existantes)
DO $$ BEGIN
    CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true); -- Allow triggering from app
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
    CREATE POLICY "Self insert profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "Update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- [Company Policies]
DO $$ BEGIN
  CREATE POLICY "Companies viewable by everyone" ON companies FOR SELECT USING (true);
  CREATE POLICY "Owners insert company" ON companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
  CREATE POLICY "Owners update company" ON companies FOR UPDATE USING (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "View orders" ON orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT id FROM profiles WHERE company_id = orders.company_id));
    CREATE POLICY "Create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);
    CREATE POLICY "Update orders" ON orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() IN (SELECT id FROM profiles WHERE company_id = orders.company_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- [Message Policies]
DO $$ BEGIN
  CREATE POLICY "Users view messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  CREATE POLICY "Users insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- [Shipment Policies]
DO $$ BEGIN
  CREATE POLICY "Owners view shipments" ON shipments FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE company_id = shipments.company_id));
  CREATE POLICY "Owners insert shipments" ON shipments FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE company_id = shipments.company_id));
  CREATE POLICY "Owners update shipments" ON shipments FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE company_id = shipments.company_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- [Ticket Policies]
DO $$ BEGIN
    CREATE POLICY "Users view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users create own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users update own tickets" ON tickets FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. AUTOMATISATION (S'assure que updated_at change tout seul)
CREATE OR REPLACE FUNCTION handle_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_up ON profiles;
CREATE TRIGGER set_profiles_up BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS set_companies_up ON companies;
CREATE TRIGGER set_companies_up BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS set_orders_up ON orders;
CREATE TRIGGER set_orders_up BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
DROP TRIGGER IF EXISTS set_shipments_up ON shipments;
CREATE TRIGGER set_shipments_up BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 5. TEMPS RÉEL (REALTIME)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE messages, orders, shipments, profiles, notifications, reviews, tickets;
