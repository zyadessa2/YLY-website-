-- Create governorates table
CREATE TABLE IF NOT EXISTS governorates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  arabic_name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  arabic_description TEXT,
  population VARCHAR(20),
  area VARCHAR(20),
  cover_image TEXT,
  featured_image TEXT,
  coordinates JSONB, -- {lat: number, lng: number}
  established_date DATE,
  capital VARCHAR(100),
  arabic_capital VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create governorate_members table
CREATE TABLE IF NOT EXISTS governorate_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate_id UUID NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  arabic_name VARCHAR(200),
  title VARCHAR(200) NOT NULL,
  arabic_title VARCHAR(200),
  description TEXT,
  arabic_description TEXT,
  image TEXT,
  position_order INTEGER DEFAULT 0,
  email VARCHAR(255),
  phone VARCHAR(50),
  social_links JSONB, -- {facebook: "", instagram: "", linkedin: ""}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create governorate_news table (extends main news with governorate relationship)
CREATE TABLE IF NOT EXISTS governorate_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate_id UUID NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  arabic_title VARCHAR(500),
  description TEXT NOT NULL,
  arabic_description TEXT,
  content TEXT NOT NULL,
  arabic_content TEXT,
  author VARCHAR(200) NOT NULL,
  arabic_author VARCHAR(200),
  cover_image TEXT NOT NULL,
  content_images TEXT[], -- array of image URLs
  slug VARCHAR(500) NOT NULL UNIQUE,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  tags TEXT[], -- array of tags
  arabic_tags TEXT[],
  meta_title VARCHAR(200),
  arabic_meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  arabic_meta_description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

-- Create governorate_events table (extends main events with governorate relationship)
CREATE TABLE IF NOT EXISTS governorate_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate_id UUID NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  arabic_title VARCHAR(500),
  description TEXT NOT NULL,
  arabic_description TEXT,
  content TEXT NOT NULL,
  arabic_content TEXT,
  location VARCHAR(300) NOT NULL,
  arabic_location VARCHAR(300),
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  end_time TIME,
  cover_image TEXT NOT NULL,
  content_images TEXT[], -- array of image URLs
  slug VARCHAR(500) NOT NULL UNIQUE,
  registration_link TEXT,
  registration_required BOOLEAN DEFAULT false,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'EGP',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  event_type VARCHAR(100), -- 'workshop', 'seminar', 'competition', 'community_service', etc.
  tags TEXT[], -- array of tags
  arabic_tags TEXT[],
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  requirements TEXT, -- event requirements
  arabic_requirements TEXT,
  meta_title VARCHAR(200),
  arabic_meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  arabic_meta_description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_governorates_slug ON governorates(slug);
CREATE INDEX IF NOT EXISTS idx_governorates_name ON governorates(name);

CREATE INDEX IF NOT EXISTS idx_governorate_members_governorate_id ON governorate_members(governorate_id);
CREATE INDEX IF NOT EXISTS idx_governorate_members_active ON governorate_members(is_active);
CREATE INDEX IF NOT EXISTS idx_governorate_members_order ON governorate_members(position_order);

CREATE INDEX IF NOT EXISTS idx_governorate_news_governorate_id ON governorate_news(governorate_id);
CREATE INDEX IF NOT EXISTS idx_governorate_news_published ON governorate_news(published);
CREATE INDEX IF NOT EXISTS idx_governorate_news_featured ON governorate_news(featured);
CREATE INDEX IF NOT EXISTS idx_governorate_news_slug ON governorate_news(slug);
CREATE INDEX IF NOT EXISTS idx_governorate_news_created_at ON governorate_news(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_governorate_events_governorate_id ON governorate_events(governorate_id);
CREATE INDEX IF NOT EXISTS idx_governorate_events_published ON governorate_events(published);
CREATE INDEX IF NOT EXISTS idx_governorate_events_featured ON governorate_events(featured);
CREATE INDEX IF NOT EXISTS idx_governorate_events_slug ON governorate_events(slug);
CREATE INDEX IF NOT EXISTS idx_governorate_events_date ON governorate_events(event_date);
CREATE INDEX IF NOT EXISTS idx_governorate_events_created_at ON governorate_events(created_at DESC);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_governorates_updated_at BEFORE UPDATE ON governorates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governorate_members_updated_at BEFORE UPDATE ON governorate_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governorate_news_updated_at BEFORE UPDATE ON governorate_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governorate_events_updated_at BEFORE UPDATE ON governorate_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample governorates data
INSERT INTO governorates (name, arabic_name, slug, description, arabic_description, population, area, capital, arabic_capital) VALUES
('Cairo', 'القاهرة', 'cairo', 'Egypt''s capital and largest city, known for its rich history and Islamic architecture.', 'عاصمة مصر وأكبر مدنها، تشتهر بتاريخها العريق والعمارة الإسلامية.', '10.2M', '606 km²', 'Cairo', 'القاهرة'),
('Giza', 'الجيزة', 'giza', 'Home to the Great Pyramids and the Sphinx, one of the world''s most famous tourist destinations.', 'موطن الأهرامات العظيمة وأبو الهول، واحدة من أشهر الوجهات السياحية في العالم.', '9.2M', '13,184 km²', 'Giza', 'الجيزة'),
('Alexandria', 'الإسكندرية', 'alexandria', 'Egypt''s second-largest city and main port, known as the Pearl of the Mediterranean.', 'ثاني أكبر مدن مصر وميناؤها الرئيسي، تُعرف بعروس البحر المتوسط.', '5.4M', '2,679 km²', 'Alexandria', 'الإسكندرية'),
('Qalyubia', 'القليوبية', 'qalyubia', 'Located in the Nile Delta, known for its agricultural activities and proximity to Cairo.', 'تقع في دلتا النيل، تشتهر بأنشطتها الزراعية وقربها من القاهرة.', '5.6M', '1,124 km²', 'Benha', 'بنها'),
('Sharqia', 'الشرقية', 'sharqia', 'Agricultural governorate in the eastern Nile Delta, famous for its rice and cotton production.', 'محافظة زراعية في شرق دلتا النيل، تشتهر بإنتاج الأرز والقطن.', '7.2M', '4,911 km²', 'Zagazig', 'الزقازيق')
ON CONFLICT (slug) DO NOTHING;
