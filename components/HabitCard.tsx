import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker, Calendar, Month } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Habit } from "../types/habit.types";
import { Database } from "../types/supabase";
import dayjs from "dayjs";
import { HabitFormModalButton } from "./HabitFormModal";

const useGetCompletedDates = (habitId: number) => {
  const supa = useSupabaseClient<Database>();
  const context = useQuery(["completedDates", habitId], async () => {
    const { data, error } = await supa
      .from("habit_completions")
      .select("completed_at")
      .eq("habit_id", habitId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
  return context;
};

const useCompleteHabit = (habit: Habit) => {
  const supa = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const { data: completedDates } = useGetCompletedDates(habit.id);
  const context = useMutation(
    async (date: Date) => {
      if (
        completedDates
          ?.map((date) => date.completed_at)
          .includes(dayjs(date).format("YYYY-MM-DD"))
      ) {
        console.log("deleting");
        await supa
          .from("habit_completions")
          .delete()
          .match({
            user_id: habit.user_id,
            habit_id: habit.id,
            completed_at: dayjs(date).format("YYYY-MM-DD"),
          });
      } else {
        await supa.from("habit_completions").insert({
          habit_id: habit.id,
          completed_at: dayjs(date).format("YYYY-MM-DD"),
          user_id: habit.user_id,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["completedDates", habit.id]);
      },
    }
  );
  return context;
};

const HabitModal = ({ habit }: { habit: Habit }) => {
  const supa = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const [calendarValue, setCalendarValue] = useState<Date[]>([]);

  const { data: completedDates } = useGetCompletedDates(habit.id);
  const { mutate: completeHabit } = useCompleteHabit(habit);

  useEffect(() => {
    completedDates &&
      setCalendarValue(
        completedDates.map((date) => new Date(date.completed_at))
      );
  }, [completedDates]);

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
        <Group>
          <HabitFormModalButton habitId={habit.id} />

          <Button onClick={handleDelete} color="red">
            Delete
          </Button>
        </Group>
      </Group>
      <Calendar
        multiple
        value={calendarValue}
        onChange={(selectedDates) => {
          const isUnselecting = calendarValue.length > selectedDates.length;
          let unselectedDate: Date | undefined;

          function difference(arr1: Date[], arr2: Date[]) {
            return arr1.filter((x) => !arr2.includes(x));
          }

          if (isUnselecting) {
            unselectedDate = difference(
              [...calendarValue].sort(),
              [...selectedDates].sort()
            ).shift();
            console.log("unselectedDate", unselectedDate);
            unselectedDate && completeHabit(unselectedDate);
            const newDates = calendarValue.filter(
              (date) => date !== unselectedDate
            );
            setCalendarValue(newDates);
            return;
          }

          const lastSelectedDate = selectedDates.at(-1);

          if (
            lastSelectedDate &&
            !completedDates
              ?.map((date) => date.completed_at)
              .includes(lastSelectedDate.toISOString())
          ) {
            completeHabit(lastSelectedDate);
            setCalendarValue([...calendarValue, lastSelectedDate]);
          }
        }}
      />
    </Card>
  );
};

export const HabitCard = ({ habit }: { habit: Habit }) => {
  const [opened, setOpened] = useState(false);
  const { data: completedDates } = useGetCompletedDates(habit.id);
  const { mutate: completeHabit } = useCompleteHabit(habit);

  const completedToday = completedDates?.some((date) => {
    const completedAt = new Date(date.completed_at);
    const today = new Date();
    return (
      completedAt.getDate() === today.getDate() &&
      completedAt.getMonth() === today.getMonth() &&
      completedAt.getFullYear() === today.getFullYear()
    );
  });
  return (
    <>
      {" "}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={habit.title}
      >
        <HabitModal habit={habit} />
      </Modal>
      <Card withBorder h={200}>
        <Stack>
          <Text>{habit.title}</Text>
          <Button
            color={completedToday ? "green" : "blue"}
            onClick={() => completeHabit(new Date())}
          >
            {completedToday ? "Completed" : "Complete"}
          </Button>
          <Button variant="outline" onClick={() => setOpened(true)}>
            Details
          </Button>
        </Stack>
      </Card>
    </>
  );
};
