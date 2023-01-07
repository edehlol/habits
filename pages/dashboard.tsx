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
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Habit } from "../types/habit.types";
import { Database } from "../types/supabase";

const HabitCard = ({ habit }: { habit: Habit }) => {
  const supa = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { mutate: deleteTodo } = useMutation(
    async () => {
      await supa.from("habits").delete().eq("id", habit.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("habits");
      },
    }
  );
  const handleDelete = async () => {
    deleteTodo();
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
  const supa = useSupabaseClient<Database>();
  const user = useUser();
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  const { mutate: createHabit } = useMutation(
    async (values: any) =>
      user &&
      (await supa.from("habits").insert({
        title: values.title,
        user_id: user.id,
      })),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("habits");
      },
    }
  );

  const handleSubmit = async (values: any) => {
    createHabit(values);

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
  const supa = useSupabaseClient<Database>();
  const { data: habits } = useQuery("habits", async () => {
    const { data } = await supa.from("habits").select("*");
    return data;
  });

  return (
    <>
      <Container>
        <Title>Habits</Title>
        <CreateHabitButton />
        <Stack>
          {habits?.map((habit) => (
            <HabitCard habit={habit} key={habit.id} />
          ))}
        </Stack>
      </Container>
    </>
  );
}
