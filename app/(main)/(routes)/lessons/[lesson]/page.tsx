import { TaskWithStatus, nonSolutionFields } from "@/types";

import { Lessons } from "@prisma/client";
import { TaskList } from "@/components/task/task-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { lessonsToRussian } from "@/lib/utils";

const defaults = { completed: false, created: false, failed: false };

const LessonPage = async ({
	params,
}: {
	params: { lesson: Lessons | "home" };
}) => {
	const profile = await currentProfile();

	let tasks =
		params.lesson === "home"
			? await db.task.findMany({
					select: Object.assign(
						// eslint-disable-next-line
						// @ts-ignore
						...nonSolutionFields.map((k) => ({ [k]: true }))
					),
			  })
			: await db.task.findMany({
					where: {
						lesson: params.lesson,
					},
					select: Object.assign(
						// eslint-disable-next-line
						// @ts-ignore
						...nonSolutionFields.map((k) => ({ [k]: true }))
					),
			  });
	const completedTasks = profile?.completedTasks.map((task) => task.id);
	const createdTasks = profile?.createdTasks.map((task) => task.id);
	const incorrectTasks = profile?.incorrectTasks.map((task) => task.id);

	// eslint-disable-next-line
	// @ts-ignore
	tasks = tasks
		.map((task) => {
			if (!profile) return { ...task, completed: false, created: false };
			// eslint-disable-next-line
			// @ts-ignore
			if (completedTasks && completedTasks.includes(task.id))
				return { ...task, completed: true };
			// eslint-disable-next-line
			// @ts-ignore
			if (createdTasks && createdTasks.includes(task.id))
				return { ...task, created: true };
			// eslint-disable-next-line
			// @ts-ignore
			if (incorrectTasks && incorrectTasks.includes(task.id))
				return { ...task, failed: true };
			return task;
		})
		.map((task) => ({ ...defaults, ...task })) as TaskWithStatus[];

	return (
		<div className="flex flex-col items-center text-xl capitalize mt-1 h-screen max-h-screen">
			<h1 className="text-96">
				{lessonsToRussian(params.lesson) === "home"
					? "Домашняя страница"
					: lessonsToRussian(params.lesson)}
			</h1>
			<div className="flex flex-col h-full">
				{/*@ts-ignore*/}
				<TaskList tasks={tasks} />
			</div>
		</div>
	);
};

export default LessonPage;
