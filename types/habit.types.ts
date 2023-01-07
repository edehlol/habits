import { Database } from "./supabase";

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
