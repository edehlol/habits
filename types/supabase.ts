export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habit_completions: {
        Row: {
          completed_at: string
          habit_id: number | null
          id: number
          user_id: string
        }
        Insert: {
          completed_at: string
          habit_id?: number | null
          id?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: number | null
          id?: number
          user_id?: string
        }
      }
      habits: {
        Row: {
          created_at: string | null
          id: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
