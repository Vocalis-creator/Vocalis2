-- Vocalis Database Schema for Supabase
-- Run this in the Supabase SQL Editor to create the required tables

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- 1. Users table - stores user profiles and preferences
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Tours table - stores generated tour data
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    interests TEXT[] DEFAULT '{}',
    segments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tours table
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own tours
CREATE POLICY "Users can view own tours" ON tours
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tours" ON tours
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tours" ON tours
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tours" ON tours
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Tour segments table (optional - for more normalized structure)
-- Note: We're using JSONB in tours table for Phase 3, but this could be used later
CREATE TABLE tour_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audio_url TEXT,
    duration_seconds INTEGER,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tour_segments table
ALTER TABLE tour_segments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access segments from their own tours
CREATE POLICY "Users can view own tour segments" ON tour_segments
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM tours WHERE tours.id = tour_segments.tour_id
        )
    );

-- 4. Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tours_user_id ON tours(user_id);
CREATE INDEX idx_tours_created_at ON tours(created_at DESC);
CREATE INDEX idx_tour_segments_tour_id ON tour_segments(tour_id);
CREATE INDEX idx_tour_segments_order ON tour_segments(tour_id, order_index);

-- 5. Create updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE tours TO authenticated;
GRANT ALL ON TABLE tour_segments TO authenticated;

-- Allow anonymous users to read public data if needed in the future
-- For now, all data is private to authenticated users

/*
Instructions for Supabase Setup:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query and paste this entire schema
4. Run the query to create all tables, policies, and triggers
5. Verify tables are created in the Table Editor
6. Test authentication by signing up a user and checking if the profile is created automatically

Tables Created:
- users: User profiles with interests
- tours: Generated tour data with segments as JSONB
- tour_segments: Normalized segments (for future use)

Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic user profile creation on signup
- Updated timestamps maintained automatically
*/ 