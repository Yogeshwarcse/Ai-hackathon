export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          total_scans: number
          total_points: number
          co2_saved_kg: number
          trees_saved: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          total_scans?: number
          total_points?: number
          co2_saved_kg?: number
          trees_saved?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          total_scans?: number
          total_points?: number
          co2_saved_kg?: number
          trees_saved?: number
          created_at?: string
          updated_at?: string
        }
      }
      waste_categories: {
        Row: {
          id: string
          name: string
          description: string
          disposal_instructions: string
          environmental_impact: string
          points_value: number
          co2_impact_kg: number
          icon_name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          disposal_instructions: string
          environmental_impact: string
          points_value?: number
          co2_impact_kg?: number
          icon_name?: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          disposal_instructions?: string
          environmental_impact?: string
          points_value?: number
          co2_impact_kg?: number
          icon_name?: string
          color?: string
          created_at?: string
        }
      }
      waste_scans: {
        Row: {
          id: string
          user_id: string
          category_id: string
          image_url: string | null
          confidence_score: number | null
          location: string | null
          points_earned: number
          co2_saved_kg: number
          properly_disposed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          image_url?: string | null
          confidence_score?: number | null
          location?: string | null
          points_earned?: number
          co2_saved_kg?: number
          properly_disposed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          image_url?: string | null
          confidence_score?: number | null
          location?: string | null
          points_earned?: number
          co2_saved_kg?: number
          properly_disposed?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          badge_icon: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          badge_icon?: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          title?: string
          description?: string
          badge_icon?: string
          unlocked_at?: string
        }
      }
    }
  }
}
