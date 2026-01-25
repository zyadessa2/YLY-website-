/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - This file is deprecated and kept for reference only
/**
 * @deprecated This file is deprecated. 
 * The application has migrated from Supabase to a custom Node.js/Express/MongoDB backend.
 * Use the API services in /src/lib/api/ instead:
 * - newsService for news operations
 * - eventsService for events operations
 * - governoratesService for governorate operations
 * - authService for authentication
 * - usersService for user management
 * 
 * This file is kept for reference only and will be removed in a future version.
 */

// import { supabase } from "./supabase";  // Disabled - Supabase no longer used

// Governorate Interfaces
export interface Governorate {
  id: string;
  name: string;
  arabic_name: string;
  slug: string;
  description?: string;
  arabic_description?: string;
  population?: string;
  area?: string;
  cover_image?: string;
  featured_image?: string;
  coordinates?: { lat: number; lng: number };
  established_date?: string;
  capital?: string;
  arabic_capital?: string;
  created_at: string;
  updated_at: string;
}

export interface GovernorateMember {
  id: string;
  governorate_id: string;
  name: string;
  arabic_name?: string;
  position: string; // Maps to 'title' in database
  bio?: string; // Maps to 'description' in database
  profile_image?: string; // Maps to 'image' in database
  location?: string;
  join_date: string;
  position_order: number;
  email?: string;
  phone?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GovernorateNews {
  id: string;
  governorate_id: string;
  title: string;
  arabic_title?: string;
  description: string; // Maps to 'description' in database - REQUIRED
  arabic_description?: string;
  content: string;
  arabic_content?: string;
  author: string; // REQUIRED
  arabic_author?: string;
  cover_image: string; // Maps to 'cover_image' in database - REQUIRED
  content_images?: string[];
  slug: string;
  published: boolean; // Maps to 'published' in database
  featured: boolean; // Maps to 'featured' in database
  view_count: number;
  tags?: string[];
  arabic_tags?: string[];
  meta_title?: string;
  arabic_meta_title?: string;
  meta_description?: string;
  arabic_meta_description?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface GovernorateEvent {
  id: string;
  governorate_id: string;
  title: string;
  arabic_title?: string;
  description: string;
  arabic_description?: string;
  content: string;
  arabic_content?: string;
  location?: string;
  arabic_location?: string;
  event_date: string;
  start_time?: string; // Maps to 'event_time' in database
  end_date?: string;
  end_time?: string;
  banner_image?: string; // Maps to 'cover_image' in database
  content_images?: string[];
  slug: string;
  registration_link?: string;
  registration_required: boolean;
  max_participants?: number;
  current_participants: number;
  registration_fee?: number; // Maps to 'price' in database
  currency: string;
  is_published: boolean; // Maps to 'published' in database
  is_featured: boolean; // Maps to 'featured' in database
  event_type?: string;
  tags?: string[];
  contact_email?: string;
  contact_phone?: string;
  contact_info?: string; // Additional field for dashboard
  requirements?: string;
  arabic_requirements?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
  updated_by?: string;
}

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

// Governorate Services
export class GovernorateService {
  // Get all governorates
  static async getAllGovernorates() {
    const { data, error } = await supabase
      .from("governorates")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data as Governorate[];
  }

  // Get governorate by slug
  static async getGovernorateBySlug(slug: string) {
    const { data, error } = await supabase
      .from("governorates")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Governorate;
  }

  // Get governorate members
  static async getGovernorateMembers(governorateId: string) {
    const { data, error } = await supabase
      .from("governorate_members")
      .select("*")
      .eq("governorate_id", governorateId)
      .eq("is_active", true)
      .order("position_order", { ascending: true });

    if (error) throw error;
    return data.map((member) =>
      GovernorateMemberService.mapFromDatabase(member)
    );
  }

  // // Get governorate news
  // static async getGovernorateNews(governorateId: string, limit = 10) {
  //   const { data, error } = await supabase
  //     .from("governorate_news")
  //     .select("*")
  //     .eq("governorate_id", governorateId)
  //     .eq("published", true)
  //     .order("created_at", { ascending: false })
  //     .limit(limit);

  //   if (error) throw error;
  //   return data.map((news) => GovernorateNewsService.mapFromDatabase(news));
  // }

  // // Get governorate events
  // static async getGovernorateEvents(governorateId: string, limit = 10) {
  //   const { data, error } = await supabase
  //     .from("governorate_events")
  //     .select("*")
  //     .eq("governorate_id", governorateId)
  //     .eq("published", true)
  //     .order("event_date", { ascending: true })
  //     .limit(limit);

  //   if (error) throw error;
  //   return data.map((event) => GovernorateEventService.mapFromDatabase(event));
  // }

  // Get governorate with all related data
  static async getGovernorateWithData(slug: string) {
    const governorate = await this.getGovernorateBySlug(slug);
    const [members] = await Promise.all([
      this.getGovernorateMembers(governorate.id),
      // this.getGovernorateNews(governorate.id, 6),
      // this.getGovernorateEvents(governorate.id, 6),
    ]);

    return {
      governorate,
      members,
      // news,
      // events,
    };
  }

  // Create governorate
  static async createGovernorate(
    data: Omit<Governorate, "id" | "created_at" | "updated_at">
  ) {
    const { data: result, error } = await supabase
      .from("governorates")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as Governorate;
  }

  // Update governorate
  static async updateGovernorate(id: string, data: Partial<Governorate>) {
    const { data: result, error } = await supabase
      .from("governorates")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result as Governorate;
  }

  // Delete governorate
  static async deleteGovernorate(id: string) {
    const { error } = await supabase.from("governorates").delete().eq("id", id);

    if (error) throw error;
  }
}

// Governorate Members Service
export class GovernorateMemberService {
  // Helper function to map interface fields to database fields
  static mapToDatabase(data: Partial<GovernorateMember>) {
    const dbData: Record<string, unknown> = { ...data };

    // Map interface fields to database fields
    if (data.position !== undefined) {
      dbData.title = data.position;
      delete dbData.position;
    }
    if (data.bio !== undefined) {
      dbData.description = data.bio;
      delete dbData.bio;
    }
    if (data.profile_image !== undefined) {
      dbData.image = data.profile_image;
      delete dbData.profile_image;
    }
    // Note: join_date is mapped to created_at, but we shouldn't update created_at
    // Remove join_date from update operations
    if (dbData.join_date !== undefined) {
      delete dbData.join_date;
    }

    return dbData;
  }

  // Helper function to map database fields to interface fields
  static mapFromDatabase(data: Record<string, unknown>): GovernorateMember {
    return {
      ...data,
      position: data.title as string,
      bio: data.description as string,
      profile_image: data.image as string,
      join_date: data.created_at as string,
    } as GovernorateMember;
  }

  // Create member
  static async createMember(
    data: Omit<GovernorateMember, "id" | "created_at" | "updated_at">
  ) {
    const dbData = this.mapToDatabase(data);
    const { data: result, error } = await supabase
      .from("governorate_members")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDatabase(result);
  }

  // Update member
  static async updateMember(id: string, data: Partial<GovernorateMember>) {
    try {
      console.log("Database updateMember called with:", { id, data });

      // Validate required fields for update
      if (data.name !== undefined && (!data.name || data.name.trim() === "")) {
        throw new Error("Name is required and cannot be empty");
      }
      if (
        data.position !== undefined &&
        (!data.position || data.position.trim() === "")
      ) {
        throw new Error("Position is required and cannot be empty");
      }

      // First check if the member exists
      const { data: existingMember, error: checkError } = await supabase
        .from("governorate_members")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking member existence:", checkError);
        throw new Error(`Database error: ${checkError.message}`);
      }

      if (!existingMember) {
        throw new Error(`Member with ID ${id} not found`);
      }

      const dbData = this.mapToDatabase(data);
      console.log("Mapped database data:", dbData);

      const { data: result, error } = await supabase
        .from("governorate_members")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(
          `Database error: ${error.message || "Unknown database error"}`
        );
      }

      if (!result) {
        throw new Error("Update failed: No data returned");
      }

      console.log("Update successful, result:", result);
      return this.mapFromDatabase(result);
    } catch (error) {
      console.error("Database updateMember error:", error);
      throw error;
    }
  }

  // Delete member
  static async deleteMember(id: string) {
    const { error } = await supabase
      .from("governorate_members")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

// // Governorate News Service
// export class GovernorateNewsService {
//   // Helper function to map interface fields to database fields
//   static mapToDatabase(data: Partial<GovernorateNews>) {
//     const dbData: Record<string, unknown> = { ...data };

//     // No mapping needed - interface now matches database schema directly
//     return dbData;
//   }

//   // Helper function to map database fields to interface fields
//   static mapFromDatabase(data: Record<string, unknown>): GovernorateNews {
//     return {
//       ...data,
//       // No mapping needed - interface now matches database schema directly
//     } as GovernorateNews;
//   }

//   // Get news by slug
//   static async getNewsBySlug(slug: string) {
//     const { data, error } = await supabase
//       .from("governorate_news")
//       .select(
//         `
//         *,
//         governorates (
//           name,
//           arabic_name,
//           slug
//         )
//       `
//       )
//       .eq("slug", slug)
//       .eq("published", true)
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(data);
//   }

//   // Create news
//   static async createNews(
//     data: Omit<
//       GovernorateNews,
//       "id" | "created_at" | "updated_at" | "view_count"
//     >
//   ) {
//     const dbData = this.mapToDatabase(data);
//     const { data: result, error } = await supabase
//       .from("governorate_news")
//       .insert(dbData)
//       .select()
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(result);
//   }

//   // Update news
//   static async updateNews(id: string, data: Partial<GovernorateNews>) {
//     const dbData = this.mapToDatabase(data);
//     const { data: result, error } = await supabase
//       .from("governorate_news")
//       .update(dbData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(result);
//   }

//   // Delete news
//   static async deleteNews(id: string) {
//     const { error } = await supabase
//       .from("governorate_news")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//   }

//   // Increment view count
//   static async incrementViewCount(id: string) {
//     const { error } = await supabase.rpc("increment_view_count", {
//       table_name: "governorate_news",
//       row_id: id,
//     });

//     if (error) throw error;
//   }
// }

// // Governorate Events Service
// export class GovernorateEventService {
//   // Helper function to map interface fields to database fields
//   static mapToDatabase(
//     data: Partial<GovernorateEvent>
//   ): Record<string, unknown> {
//     const dbData: Record<string, unknown> = { ...data };

//     // Map interface fields to database fields
//     if (data.start_time !== undefined) {
//       dbData.event_time = data.start_time;
//       delete dbData.start_time;
//     }
//     if (data.banner_image !== undefined) {
//       dbData.cover_image = data.banner_image;
//       delete dbData.banner_image;
//     }
//     if (data.registration_fee !== undefined) {
//       dbData.price = data.registration_fee;
//       delete dbData.registration_fee;
//     }
//     if (data.is_published !== undefined) {
//       dbData.published = data.is_published;
//       delete dbData.is_published;
//     }
//     if (data.is_featured !== undefined) {
//       dbData.featured = data.is_featured;
//       delete dbData.is_featured;
//     }
//     // Remove contact_info as it's not in database
//     if (data.contact_info !== undefined) {
//       delete dbData.contact_info;
//     }

//     return dbData;
//   }

//   // Helper function to map database fields to interface fields
//   static mapFromDatabase(data: Record<string, unknown>): GovernorateEvent {
//     return {
//       ...data,
//       start_time: data.event_time as string,
//       banner_image: data.cover_image as string,
//       registration_fee: data.price as number,
//       is_published: data.published as boolean,
//       is_featured: data.featured as boolean,
//       contact_info:
//         (data.contact_email as string) || (data.contact_phone as string) || "",
//     } as GovernorateEvent;
//   }

//   // Get event by slug
//   static async getEventBySlug(slug: string) {
//     const { data, error } = await supabase
//       .from("governorate_events")
//       .select(
//         `
//         *,
//         governorates (
//           name,
//           arabic_name,
//           slug
//         )
//       `
//       )
//       .eq("slug", slug)
//       .eq("published", true)
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(data);
//   }

//   // Create event
//   static async createEvent(
//     data: Omit<
//       GovernorateEvent,
//       "id" | "created_at" | "updated_at" | "current_participants"
//     >
//   ) {
//     const dbData = this.mapToDatabase(data);
//     const { data: result, error } = await supabase
//       .from("governorate_events")
//       .insert(dbData)
//       .select()
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(result);
//   }

//   // Update event
//   static async updateEvent(id: string, data: Partial<GovernorateEvent>) {
//     const dbData = this.mapToDatabase(data);
//     const { data: result, error } = await supabase
//       .from("governorate_events")
//       .update(dbData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return this.mapFromDatabase(result);
//   }

//   // Delete event
//   static async deleteEvent(id: string) {
//     const { error } = await supabase
//       .from("governorate_events")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//   }

//   // Register for event
//   static async registerForEvent(eventId: string) {
//     const { error } = await supabase.rpc("increment_event_participants", {
//       event_id: eventId,
//     });

//     if (error) throw error;
//   }
// }
