import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { IconFlame } from "@tabler/icons";

const Habit = ({ title }: { title: string }) => {
  return (
    <Card withBorder>
      <Group position="apart">
        <Text>{title}</Text>
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

export default function Home() {
  return (
    <>
      <Container>
        <Title>Habits</Title>
        <Button>Create Habit</Button>
        <Stack>
          <Habit title="Gym" />
          <Habit title="Meditate" />
          <Habit title="Read" />
        </Stack>
      </Container>
    </>
  );
}
