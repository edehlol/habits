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
import { useMutation } from "react-query";

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const { mutate } = useMutation(async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        // redirect to /logging-in after successful login
        redirectTo: process.env.NEXT_PUBLIC_URL + "/logging-in",
      },
    });
  });

  async function signInWithGithub() {
    mutate();
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
