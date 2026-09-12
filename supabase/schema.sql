-- TicinoHome Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql_editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  surname TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles, but only edit their own (or admins edit all)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, surname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'surname',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- AGENTS
-- ============================================
CREATE TABLE public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  bio TEXT,
  specializations TEXT,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents are viewable by everyone" ON public.agents
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage agents" ON public.agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PROPERTIES
-- ============================================
CREATE TABLE public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'CHF',
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'attic', 'rustic', 'land', 'office', 'commercial', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'reserved', 'sold', 'archived')),
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  size_sqm NUMERIC,
  total_size_sqm NUMERIC,
  land_size_sqm NUMERIC,
  year_built INTEGER,
  year_renovated INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  parking INTEGER,
  garage BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  terrace BOOLEAN DEFAULT false,
  garden BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  cellar BOOLEAN DEFAULT false,
  lake_view BOOLEAN DEFAULT false,
  mountain_view BOOLEAN DEFAULT false,
  pool BOOLEAN DEFAULT false,
  energy_class TEXT,
  video_url TEXT,
  virtual_tour_url TEXT,
  floor_plan_url TEXT,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Everyone can view published properties
CREATE POLICY "Published properties are viewable by everyone" ON public.properties
  FOR SELECT USING (
    status IN ('published', 'reserved', 'sold')
    OR agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Agents and admins can insert
CREATE POLICY "Agents can insert properties" ON public.properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Agents and admins can update
CREATE POLICY "Agents can update properties" ON public.properties
  FOR UPDATE USING (
    agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete
CREATE POLICY "Only admins can delete properties" ON public.properties
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- PROPERTY IMAGES
-- ============================================
CREATE TABLE public.property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- View images if can view property
CREATE POLICY "Property images viewable by property viewers" ON public.property_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_id AND (
        status IN ('published', 'reserved', 'sold')
        OR agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('admin', 'agent')
        )
      )
    )
  );

-- Agents/admins can manage images
CREATE POLICY "Agents can manage property images" ON public.property_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.properties
      JOIN public.agents ON properties.agent_id = agents.id
      WHERE properties.id = property_id AND agents.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INQUIRIES
-- ============================================
CREATE TABLE public.inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'visit')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Everyone can create inquiries
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON public.inquiries
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.properties
      JOIN public.agents ON properties.agent_id = agents.id
      WHERE properties.id = property_id AND agents.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agents/admins can update status
CREATE POLICY "Agents can update inquiries" ON public.inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.properties
      JOIN public.agents ON properties.agent_id = agents.id
      WHERE properties.id = property_id AND agents.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FAVORITES
-- ============================================
CREATE TABLE public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (user_id = auth.uid());

-- Users can add favorites
CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can remove favorites
CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage > New Bucket
-- Or via SQL:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Agents can update property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images'
    AND (
      EXISTS (
        SELECT 1 FROM public.properties
        JOIN public.agents ON properties.agent_id = agents.id
        WHERE properties.id = (storage.objects.metadata->>'property_id')::uuid AND agents.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.objects.metadata->>'user_id')
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.objects.metadata->>'user_id')
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get property with images
CREATE OR REPLACE FUNCTION get_property_with_images(p_slug TEXT)
RETURNS SETOF public.properties AS $$
  SELECT * FROM public.properties WHERE slug = p_slug;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Search properties
CREATE OR REPLACE FUNCTION search_properties(
  p_city TEXT DEFAULT NULL,
  p_type TEXT DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_min_rooms INTEGER DEFAULT NULL
)
RETURNS SETOF public.properties AS $$
  SELECT * FROM public.properties
  WHERE status = 'published'
    AND (p_city IS NULL OR city ILIKE '%' || p_city || '%')
    AND (p_type IS NULL OR property_type = p_type)
    AND (p_min_price IS NULL OR price >= p_min_price)
    AND (p_max_price IS NULL OR price <= p_max_price)
    AND (p_min_rooms IS NULL OR rooms >= p_min_rooms)
  ORDER BY created_at DESC;
$$ LANGUAGE SQL SECURITY DEFINER;
