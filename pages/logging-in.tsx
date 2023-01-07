import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function LoggingIn() {
  const router = useRouter();
  const supa = useSupabaseClient();
  supa.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      router.push("/dashboard");
    }
  });
  return (
    <div>
      <h1>Logging in...</h1>
    </div>
  );
}
