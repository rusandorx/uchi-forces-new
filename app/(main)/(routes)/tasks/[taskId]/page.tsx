import { Card } from "@/components/ui/card";
import { TaskCardFull } from "@/components/task/task-card-full";
import { TaskWithoutSolution } from "@/types";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { exclude } from "@/lib/utils";
import { redirect } from "next/navigation";

const TaskPage = async ({ params }: { params: { taskId: string } }) => {
	const profile = await currentProfile();

	let task = await db.task.findUnique({
		where: {
			id: params.taskId,
		},
		include: {
			author: true,
		},
	});

	if (!profile || !task) return redirect("/");

	task = task satisfies TaskWithoutSolution;

	const completed = profile.completedTasks.some(
		(task) => task.id === params.taskId
	);
	const created = task.author.id === profile.id;
	const failed = profile.incorrectTasks.some(
		(task) => task.id === params.taskId
	);
	const isTaskNew = !completed && !created && !failed;

	if (isTaskNew)
		// eslint-disable-next-line
		// @ts-ignore
		task = exclude(task, [
			"answer",
			"solution",
			"solutionImages",
		]) as TaskWithoutSolution;
	// eslint-disable-next-line
	// @ts-ignore
	return <TaskCardFull {...task} profile={profile}></TaskCardFull>;
};

export default TaskPage;
