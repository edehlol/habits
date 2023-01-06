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

import { IconFlame } from "@tabler/icons";
import { useState } from "react";

import { useForm } from "@mantine/form";

const habits = [
  {
    id: "1",
    title: "Gym",
    dateAdded: "2021-01-01",
    datesCompleted: ["2021-01-01", "2021-01-02", "2021-01-03"],
  },
  {
    id: "2",
    title: "Meditate",
  },
];

const Habit = ({
  habit,
}: {
  habit: {
    title: string;
  };
}) => {
  return (
    <Card withBorder>
      <Group position="apart">
        <Text>{habit.title}</Text>
        <Group>
          <Group spacing={1}>
            <IconFlame />
            <Text>3</Text>
          </Group>
          <Button>Complete</Button>
        </Group>
      </Group>
    </Card>
  );
};

const CreateHabitButton = () => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  const handleSubmit = (values: any) => {
    // add habit to habits array
    habits.concat({
      id: Math.random().toString(),
      title: values.title,
      dateAdded: new Date().toISOString(),
      datesCompleted: [],
    });
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

export default function Home() {
  return (
    <>
      <Container>
        <Title>Habits</Title>
        <CreateHabitButton />
        <Stack>
          {habits.map((habit) => (
            <Habit habit={habit} key={habit.id} />
          ))}
        </Stack>
      </Container>
    </>
  );
}
