import { createClient } from "@supabase/supabase-js";
import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../types/supabase";

export const supabaseClient = createBrowserSupabaseClient<Database>();
export const supabaseServerClient = (
  req: NextApiRequest,
  res: NextApiResponse
) => createServerSupabaseClient<Database>({ req, res });
