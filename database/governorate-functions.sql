-- Function to increment view count for news and events
CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
  IF table_name = 'governorate_news' THEN
    UPDATE governorate_news 
    SET view_count = view_count + 1 
    WHERE id = row_id;
  ELSIF table_name = 'news' THEN
    UPDATE news 
    SET view_count = view_count + 1 
    WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to increment event participants
CREATE OR REPLACE FUNCTION increment_event_participants(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE governorate_events 
  SET current_participants = current_participants + 1 
  WHERE id = event_id 
  AND (max_participants IS NULL OR current_participants < max_participants);
END;
$$ LANGUAGE plpgsql;

-- Function to get governorate statistics
CREATE OR REPLACE FUNCTION get_governorate_stats(gov_id UUID)
RETURNS TABLE(
  members_count BIGINT,
  news_count BIGINT,
  events_count BIGINT,
  upcoming_events_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM governorate_members WHERE governorate_id = gov_id AND is_active = true) as members_count,
    (SELECT COUNT(*) FROM governorate_news WHERE governorate_id = gov_id AND published = true) as news_count,
    (SELECT COUNT(*) FROM governorate_events WHERE governorate_id = gov_id AND published = true) as events_count,
    (SELECT COUNT(*) FROM governorate_events WHERE governorate_id = gov_id AND published = true AND event_date >= CURRENT_DATE) as upcoming_events_count;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies if needed
ALTER TABLE governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE governorate_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE governorate_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE governorate_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Public can view governorates" ON governorates
    FOR SELECT USING (true);

CREATE POLICY "Public can view active members" ON governorate_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published news" ON governorate_news
    FOR SELECT USING (published = true);

CREATE POLICY "Public can view published events" ON governorate_events
    FOR SELECT USING (published = true);
