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

export const HabitFormModalButton = ({ habitId }: { habitId?: number }) => {
  const supa = useSupabaseClient<Database>();
  const user = useUser();
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (habitId && opened && form.values.title === "") {
      console.log("hu");
      supa
        .from("habits")
        .select()
        .eq("id", habitId)
        .then(({ data: habit }) => {
          habit && form.setFieldValue("title", habit[0].title);
        });
    }
  }, [habitId, supa, opened, form]);

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
  const { mutate: updateHabit } = useMutation(
    async (values: any) => {
      user &&
        (await supa
          .from("habits")
          .update({
            title: values.title,
            user_id: user.id,
          })
          .eq("id", habitId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("habits");
      },
    }
  );

  const handleSubmit = async (values: any) => {
    if (habitId) {
      updateHabit(values);
    } else {
      createHabit(values);
    }

    setOpened(false);
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={habitId ? "Edit Habit" : "Create Habit"}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput {...form.getInputProps("title")} />
            <Button type="submit">{habitId ? "Edit" : "Add"}</Button>
          </Stack>
        </form>
      </Modal>
      <Button
        color={habitId ? "yellow" : "blue"}
        onClick={() => setOpened(true)}
      >
        {habitId ? "Edit Habit" : "Create Habit"}{" "}
      </Button>
    </>
  );
};
