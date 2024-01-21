//@ts-nocheck


import { Lessons } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const TO_RUSSIAN = {
	[Lessons.Math]: "Математика",
	[Lessons.Physics]: "Физика",
	[Lessons.Russian]: "Русский язык",
	[Lessons.ComputerScience]: "Информатика",
};

export const lessonsToRussian = (lesson: Lessons | string) =>
	TO_RUSSIAN[lesson as Lessons] ?? lesson.toString();

// Exclude keys from task
export function exclude<Task, Key extends keyof Task>(
  task: Task,
  keys: Key[]
): Omit<Task, Key> {
  return Object.fromEntries(
    Object.entries(task).filter(([key]) => !keys.includes(key))
  ) as Omit<Task, Key>;
}
