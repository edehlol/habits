import {
  AppShell,
  Button,
  Container,
  Group,
  Header,
  Navbar,
  Text,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  async function signInWithGithub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  }
  async function signOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }
  return (
    <AppShell
      navbar={
        <Header height={60} p="md">
          <Group position="apart">
            <Text>Habits</Text>
            <>
              {user ? (
                <Button onClick={signOut}>Sign out</Button>
              ) : (
                <Button onClick={signInWithGithub}>Sign in with Github</Button>
              )}
            </>
          </Group>
        </Header>
      }
    >
      <Container>{children}</Container>
    </AppShell>
  );
}
