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
import { HabitFormModalButton } from "../components/HabitFormModal";
import { HabitCard } from "../components/HabitCard";

export default function Dashboard() {
  const supa = useSupabaseClient<Database>();

  const { data: habits } = useQuery("habits", async () => {
    const {
      data: { user },
    } = await supa.auth.getUser();
    console.log(user);
    const { data, error } = await supa
      .from("habits")
      .select("*")
      .eq("user_id", user?.id);

    return data;
  });

  return (
    <>
      <Container>
        <Title>Habits</Title>
        <HabitFormModalButton />
        <SimpleGrid cols={4}>
          {habits?.map((habit) => (
            <HabitCard habit={habit} key={habit.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
