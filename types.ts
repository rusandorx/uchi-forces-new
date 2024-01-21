import { Lessons, Profile, Task } from "@prisma/client";

import { solutionFields } from "./types";

export type FilesEndPoints = "taskImages" | "solutionImages";
export type TaskValues = {
	title: string;
	description: string;
	difficulty: number;
	lesson: Lessons;
	taskImages: string[];
	answer: string;
	solution: string;
	solutionImages: string[];
	points: number;
};
export type TaskWithAuthor = Task & {
	author: Profile;
};

export type TaskWithStatus = TaskWithAuthor & {
	completed: boolean;
	created: boolean;
	failed: boolean;
};

export type ProfileWithTasks = Profile & {
	completedTasks: Task[];
	createdTasks: Task[];
	incorrectTasks: Task[];
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type solutionFields = "solution" | "solutionImages" | "answer";

export type TaskWithoutSolution = PartialBy<TaskWithAuthor, solutionFields>;

export const nonSolutionFields = [
	'title',
	'description',
	'difficulty',
	'lesson',
	'taskImages',
	'author',
	'id',
	'points',
];
