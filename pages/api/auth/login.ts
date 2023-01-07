import { NextApiRequest, NextApiResponse } from "next";
import { supabaseServerClient } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = supabaseServerClient({ req, res });
}
