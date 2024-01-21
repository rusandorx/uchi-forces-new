import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const profile = await currentProfile();
		const task = await db.task.findUnique({
			where: {
				id: params.taskId,
			},
		});

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!task) return new NextResponse("No such task", { status: 401 });
		if (profile.id === task?.authorId)
			return new NextResponse("Cannot giveup tasks that you created", {
				status: 401,
			});
		if (
			profile.completedTasks.some(
				(completedTask) => completedTask.id === params.taskId
			)
		)
			return new NextResponse(
				"Cannot giveup tasks that you've already solved",
				{
					status: 401,
				}
			);

		if (
			profile.incorrectTasks.some(
				(incorrectTask) => incorrectTask.id === params.taskId
			)
		)
			return new NextResponse(
				"Cannot giveup tasks that you've already failed",
				{
					status: 401,
				}
			);

		const newProfile = await db.profile.update({
			where: { id: profile.id },
			data: {
				incorrectTasks: {
					connect: {
						id: task.id,
					},
				},
			},
		});
		return NextResponse.json(newProfile);
	} catch (e) {
		console.log("[TASKS_TASKID_GIVEUP_POST]", e);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
