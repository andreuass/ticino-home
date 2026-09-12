export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyStatus = 'draft' | 'published' | 'reserved' | 'sold' | 'archived'
export type PropertyType = 'apartment' | 'house' | 'villa' | 'attic' | 'rustic' | 'land' | 'office' | 'commercial' | 'other'
export type InquiryType = 'info' | 'visit'
export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed'
export type UserRole = 'admin' | 'agent' | 'user'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          surname: string | null
          phone: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          surname?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          surname?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          price: number
          currency: string
          property_type: PropertyType
          status: PropertyStatus
          city: string
          neighborhood: string | null
          address: string | null
          rooms: number | null
          bedrooms: number | null
          bathrooms: number | null
          size_sqm: number | null
          total_size_sqm: number | null
          land_size_sqm: number | null
          year_built: number | null
          year_renovated: number | null
          floor: number | null
          total_floors: number | null
          parking: number | null
          garage: boolean | null
          balcony: boolean | null
          terrace: boolean | null
          garden: boolean | null
          elevator: boolean | null
          cellar: boolean | null
          lake_view: boolean | null
          mountain_view: boolean | null
          pool: boolean | null
          energy_class: string | null
          video_url: string | null
          virtual_tour_url: string | null
          floor_plan_url: string | null
          agent_id: string | null
          views: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          price: number
          currency?: string
          property_type: PropertyType
          status?: PropertyStatus
          city: string
          neighborhood?: string | null
          address?: string | null
          rooms?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          size_sqm?: number | null
          total_size_sqm?: number | null
          land_size_sqm?: number | null
          year_built?: number | null
          year_renovated?: number | null
          floor?: number | null
          total_floors?: number | null
          parking?: number | null
          garage?: boolean | null
          balcony?: boolean | null
          terrace?: boolean | null
          garden?: boolean | null
          elevator?: boolean | null
          cellar?: boolean | null
          lake_view?: boolean | null
          mountain_view?: boolean | null
          pool?: boolean | null
          energy_class?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          floor_plan_url?: string | null
          agent_id?: string | null
          views?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          price?: number
          currency?: string
          property_type?: PropertyType
          status?: PropertyStatus
          city?: string
          neighborhood?: string | null
          address?: string | null
          rooms?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          size_sqm?: number | null
          total_size_sqm?: number | null
          land_size_sqm?: number | null
          year_built?: number | null
          year_renovated?: number | null
          floor?: number | null
          total_floors?: number | null
          parking?: number | null
          garage?: boolean | null
          balcony?: boolean | null
          terrace?: boolean | null
          garden?: boolean | null
          elevator?: boolean | null
          cellar?: boolean | null
          lake_view?: boolean | null
          mountain_view?: boolean | null
          pool?: boolean | null
          energy_class?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          floor_plan_url?: string | null
          agent_id?: string | null
          views?: number
          updated_at?: string
          published_at?: string | null
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          position: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          position?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          url?: string
          position?: number
          is_primary?: boolean
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string | null
          bio: string | null
          specializations: string | null
          photo_url: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          bio?: string | null
          specializations?: string | null
          photo_url?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          bio?: string | null
          specializations?: string | null
          photo_url?: string | null
          phone?: string | null
          email?: string | null
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          type: InquiryType
          name: string
          email: string
          phone: string | null
          message: string
          status: InquiryStatus
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          type: InquiryType
          name: string
          email: string
          phone?: string | null
          message: string
          status?: InquiryStatus
          created_at?: string
        }
        Update: {
          status?: InquiryStatus
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: never
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type Agent = Database['public']['Tables']['agents']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']

export type PropertyWithImages = Property & {
  property_images: PropertyImage[]
  agents?: Agent | null
}
