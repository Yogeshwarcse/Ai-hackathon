/*
  # GreenCity Waste Management Database Schema

  ## Overview
  This migration creates the complete database schema for GreenCity, an AI-powered waste sorting 
  and recycling guide application that promotes sustainable behavior through gamification.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `username` (text, unique) - Display name for leaderboard
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `total_scans` (integer) - Total number of waste items scanned
  - `total_points` (integer) - Gamification points earned
  - `co2_saved_kg` (numeric) - Estimated CO2 saved through recycling
  - `trees_saved` (numeric) - Equivalent trees saved
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `waste_categories`
  Reference table for waste types and their recycling information
  - `id` (uuid, primary key)
  - `name` (text) - Category name (plastic, paper, metal, organic, e-waste)
  - `description` (text) - Detailed description
  - `disposal_instructions` (text) - How to properly dispose/recycle
  - `environmental_impact` (text) - Impact information
  - `points_value` (integer) - Points awarded for proper disposal
  - `co2_impact_kg` (numeric) - CO2 saved per item recycled
  - `icon_name` (text) - Icon identifier for UI
  - `color` (text) - Display color code
  - `created_at` (timestamptz)

  ### 3. `waste_scans`
  Records of individual waste item scans by users
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles.id
  - `category_id` (uuid, foreign key) - References waste_categories.id
  - `image_url` (text) - Stored image of scanned waste
  - `confidence_score` (numeric) - AI prediction confidence (0-1)
  - `location` (text) - Optional location data
  - `points_earned` (integer) - Points from this scan
  - `co2_saved_kg` (numeric) - CO2 saved from this item
  - `properly_disposed` (boolean) - Whether user confirmed proper disposal
  - `created_at` (timestamptz) - Scan timestamp

  ### 4. `user_achievements`
  Tracks user achievements and milestones
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles.id
  - `achievement_type` (text) - Type of achievement
  - `title` (text) - Achievement title
  - `description` (text) - Achievement description
  - `badge_icon` (text) - Badge icon identifier
  - `unlocked_at` (timestamptz) - When achievement was unlocked

  ## Security

  - Row Level Security (RLS) enabled on all tables
  - Users can read their own profile and all other profiles (for leaderboard)
  - Users can update only their own profile
  - Users can insert and read their own scans
  - Waste categories are readable by all authenticated users
  - Achievements are readable by all, insertable only by authenticated users for themselves

  ## Indexes

  - Index on profiles.total_points for leaderboard performance
  - Index on waste_scans.user_id for user scan history queries
  - Index on waste_scans.created_at for chronological queries

  ## Initial Data

  Seeds the waste_categories table with the five main waste types:
  plastic, paper, metal, organic, and e-waste with their disposal instructions
  and environmental impact data.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  total_scans integer DEFAULT 0,
  total_points integer DEFAULT 0,
  co2_saved_kg numeric DEFAULT 0,
  trees_saved numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create waste_categories table
CREATE TABLE IF NOT EXISTS waste_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  disposal_instructions text NOT NULL,
  environmental_impact text NOT NULL,
  points_value integer DEFAULT 10,
  co2_impact_kg numeric DEFAULT 0.5,
  icon_name text DEFAULT 'trash-2',
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

-- Create waste_scans table
CREATE TABLE IF NOT EXISTS waste_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES waste_categories(id) NOT NULL,
  image_url text,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  location text,
  points_earned integer DEFAULT 0,
  co2_saved_kg numeric DEFAULT 0,
  properly_disposed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  badge_icon text DEFAULT 'award',
  unlocked_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_waste_scans_user_id ON waste_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_waste_scans_created_at ON waste_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for waste_categories
CREATE POLICY "Anyone can view waste categories"
  ON waste_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for waste_scans
CREATE POLICY "Users can view own scans"
  ON waste_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON waste_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial waste categories
INSERT INTO waste_categories (name, description, disposal_instructions, environmental_impact, points_value, co2_impact_kg, icon_name, color)
VALUES
  (
    'plastic',
    'Plastic containers, bottles, bags, and packaging materials',
    'Clean and dry plastic items. Remove caps and labels. Place in recycling bin marked for plastics. Check local recycling codes (look for #1-#7 symbols).',
    'Recycling 1 ton of plastic saves approximately 5,774 kWh of energy and prevents 2 tons of CO2 emissions. Plastic takes 400+ years to decompose.',
    15,
    1.2,
    'recycle',
    '#3B82F6'
  ),
  (
    'paper',
    'Newspapers, cardboard, office paper, and paper packaging',
    'Keep paper dry and clean. Flatten cardboard boxes. Remove any plastic windows or metal fasteners. Place in paper recycling bin.',
    'Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and prevents 1 ton of CO2 emissions. Reduces landfill waste significantly.',
    10,
    0.8,
    'file-text',
    '#10B981'
  ),
  (
    'metal',
    'Aluminum cans, steel containers, and metal packaging',
    'Rinse metal containers. Crush cans to save space. Remove labels if possible. Place in metal recycling bin.',
    'Recycling aluminum saves 95% of energy needed to produce new aluminum. Steel recycling saves 60% of production energy. Metal can be recycled infinitely.',
    20,
    2.5,
    'shield',
    '#6B7280'
  ),
  (
    'organic',
    'Food scraps, yard waste, and other biodegradable materials',
    'Compost at home or use green waste bins. Include fruit/vegetable scraps, coffee grounds, eggshells, yard trimmings. Avoid meat, dairy, and oils.',
    'Composting reduces methane emissions from landfills. Creates nutrient-rich soil amendment. Diverts 30% of household waste from landfills.',
    8,
    0.3,
    'leaf',
    '#84CC16'
  ),
  (
    'e-waste',
    'Electronic devices, batteries, and electronic components',
    'Never throw in regular trash. Take to certified e-waste recycling centers. Many retailers offer take-back programs. Remove personal data first.',
    'E-waste contains valuable materials (gold, silver, copper) and toxic substances. Proper recycling recovers materials and prevents soil/water contamination.',
    25,
    3.0,
    'smartphone',
    '#EF4444'
  )
ON CONFLICT (name) DO NOTHING;

-- Function to update profile stats after scan
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    total_scans = total_scans + 1,
    total_points = total_points + NEW.points_earned,
    co2_saved_kg = co2_saved_kg + NEW.co2_saved_kg,
    trees_saved = ROUND((co2_saved_kg + NEW.co2_saved_kg) / 21.77, 2),
    updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update profile stats
CREATE TRIGGER on_waste_scan_created
  AFTER INSERT ON waste_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();