import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Habit } from "../../../types/habit.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Habit | {}>
) {
  console.log(req.cookies);
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log(session);
  console.log(error);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const habits = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", session && session.user.id);
  res.status(200).json(habits);
}
