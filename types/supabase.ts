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
          id: number
          habit_id: number
          user_id: string
          completed_at: string
        }
        Insert: {
          id?: number
          habit_id: number
          user_id: string
          completed_at: string
        }
        Update: {
          id?: number
          habit_id?: number
          user_id?: string
          completed_at?: string
        }
      }
      habits: {
        Row: {
          id: number
          created_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string | null
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
