import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconFlame } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Habit } from "../types/habit.types";
import { Database } from "../types/supabase";

const HabitCard = ({ habit }: { habit: Habit }) => {
  const client = useSupabaseClient<Database>();
  const handleDelete = async () => {
    await client.from("habits").delete().eq("id", habit.id);
  };
  return (
    <Card withBorder>
      <Group position="apart">
        <Text>{habit.title}</Text>
        <Group>
          <Button>Complete</Button>
          <Button onClick={handleDelete} color="red">
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

const CreateHabitButton = () => {
  const client = useSupabaseClient<Database>();
  const user = useUser();
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  const handleSubmit = async (values: any) => {
    user &&
      (await client.from("habits").insert({
        title: values.title,
        user_id: user.id,
      }));

    setOpened(false);
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create New Habit"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput {...form.getInputProps("title")} />
            <Button type="submit">Add</Button>
          </Stack>
        </form>
      </Modal>
      <Button onClick={() => setOpened(true)}>Create Habit</Button>
    </>
  );
};

export default function Dashboard() {
  const { data: habits } = useQuery("getAllHabits", async () => {
    const response = await fetch("/api/habits");
    const {
      data,
    }: {
      data: Habit[];
    } = await response.json();
    return data;
  });

  return (
    <>
      <Container>
        <Title>Habits</Title>
        {/* <CreateHabitButton /> */}
        <Stack>
          {/* {habits?.map((habit) => (
            <HabitCard habit={habit} key={habit.id} />
          ))} */}
        </Stack>
      </Container>
    </>
  );
}
