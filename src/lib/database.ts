import { supabase } from "./supabase";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  cover_image: string;
  content_images?: string[];
  slug: string;
  published: boolean;
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  content: string;
  location: string;
  event_date: string;
  event_time?: string;
  cover_image: string;
  content_images?: string[];
  slug: string;
  registration_link?: string;
  max_participants?: number;
  current_participants: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export type CreateNewsData = Omit<
  NewsItem,
  | "id"
  | "created_at"
  | "updated_at"
  | "created_by"
  | "updated_by"
  | "view_count"
>;

export type UpdateNewsData = Partial<CreateNewsData>;

export type CreateEventData = Omit<
  EventItem,
  | "id"
  | "created_at"
  | "updated_at"
  | "created_by"
  | "updated_by"
  | "current_participants"
>;

export type UpdateEventData = Partial<CreateEventData>;

export interface NewsComment {
  id: string;
  news_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export type CreateNewsCommentData = Omit<
  NewsComment,
  "id" | "created_at" | "approved"
>;

export type UpdateNewsCommentData = Partial<CreateNewsCommentData> & {
  approved?: boolean;
};

// News Services
export class NewsService {
  static async getAllNews() {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NewsItem[];
  }

  static async getAllNewsForAdmin() {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NewsItem[];
  }

  static async getNewsBySlug(slug: string) {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) throw error;
    return data as NewsItem;
  }

  static async getNewsById(id: string) {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as NewsItem;
  }
  static async createNews(newsData: CreateNewsData) {
    const { data, error } = await supabase
      .from("news")
      .insert([newsData])
      .select()
      .single();

    if (error) throw error;
    return data as NewsItem;
  }
  static async updateNews(id: string, newsData: UpdateNewsData) {
    const { data, error } = await supabase
      .from("news")
      .update(newsData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as NewsItem;
  }

  static async deleteNews(id: string) {
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) throw error;
  }

  static async incrementViewCount(id: string) {
    const { error } = await supabase.rpc("increment_news_views", {
      news_id: id,
    });

    if (error) console.error("Error incrementing view count:", error);
  }

  static async getFeaturedNews() {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) throw error;
    return data as NewsItem[];
  }

  static async searchNews(query: string) {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NewsItem[];
  }
}

// Events Services
export class EventsService {
  static async getAllEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data as EventItem[];
  }

  static async getAllEventsForAdmin() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as EventItem[];
  }

  static async getEventBySlug(slug: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) throw error;
    return data as EventItem;
  }

  static async getEventById(id: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as EventItem;
  }
  static async createEvent(eventData: CreateEventData) {
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data as EventItem;
  }
  static async updateEvent(id: string, eventData: UpdateEventData) {
    const { data, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as EventItem;
  }

  static async deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;
  }

  static async getUpcomingEvents() {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(5);

    if (error) throw error;
    return data as EventItem[];
  }

  static async getFeaturedEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("event_date", { ascending: true })
      .limit(3);

    if (error) throw error;
    return data as EventItem[];
  }

  static async searchEvents(query: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`
      )
      .order("event_date", { ascending: true });

    if (error) throw error;
    return data as EventItem[];
  }
}

// Comments Services
export class CommentsService {
  static async getCommentsByNewsId(newsId: string) {
    const { data, error } = await supabase
      .from("news_comments")
      .select("*")
      .eq("news_id", newsId)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NewsComment[];
  }

  static async getAllCommentsForAdmin() {
    const { data, error } = await supabase
      .from("news_comments")
      .select("*, news!inner(title)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createComment(commentData: CreateNewsCommentData) {
    const { data, error } = await supabase
      .from("news_comments")
      .insert([commentData])
      .select()
      .single();

    if (error) throw error;
    return data as NewsComment;
  }

  static async updateComment(id: string, commentData: UpdateNewsCommentData) {
    const { data, error } = await supabase
      .from("news_comments")
      .update(commentData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as NewsComment;
  }

  static async approveComment(id: string) {
    return this.updateComment(id, { approved: true });
  }

  static async rejectComment(id: string) {
    const { error } = await supabase
      .from("news_comments")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

// Dashboard Stats Service
export class DashboardService {
  static async getStats() {
    const [newsCount, eventsCount, recentNewsCount, recentEventsCount] =
      await Promise.all([
        supabase
          .from("news")
          .select("id", { count: "exact" })
          .eq("published", true),
        supabase
          .from("events")
          .select("id", { count: "exact" })
          .eq("published", true),
        supabase
          .from("news")
          .select("id", { count: "exact" })
          .eq("published", true)
          .gte(
            "created_at",
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          ),
        supabase
          .from("events")
          .select("id", { count: "exact" })
          .eq("published", true)
          .gte(
            "created_at",
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          ),
      ]);

    return {
      totalNews: newsCount.count || 0,
      totalEvents: eventsCount.count || 0,
      recentNews: recentNewsCount.count || 0,
      recentEvents: recentEventsCount.count || 0,
    };
  }

  static async getRecentNews() {
    const { data, error } = await supabase
      .from("news")
      .select("id, title, created_at, slug")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  }

  static async getRecentEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date, slug")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  }
}
