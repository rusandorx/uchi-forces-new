import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const { answer } = await req.json();
		const profile = await currentProfile();
		const task = await db.task.findUnique({
			where: {
				id: params.taskId,
			},
		});

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!task) return new NextResponse("No such task", { status: 401 });
		if (profile.id === task?.authorId)
			return new NextResponse("Cannot solve tasks that you created", {
				status: 401,
			});
		if (
			profile.completedTasks.some(
				(completedTask) => completedTask.id === params.taskId
			)
		)
			return new NextResponse(
				"Cannot solve tasks that you've already solved",
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
          "Cannot solve tasks that you've already failed",
          {
            status: 401,
          }
        );

		if (answer.trim() !== task.answer.trim()) {
			await db.profile.update({ where: { id: profile.id }, data: {
        incorrectTasks: {
          connect: {
            id: task.id
          }
        }
      } });
      return new NextResponse("It's not the answer");
		}
    const newProfile = await db.profile.update({ where: { id: profile.id }, data: {
      completedTasks: {
        connect: {
          id: task.id
        }
      }
    } });
    return NextResponse.json(newProfile);
	} catch (e) {
		console.log("[TASKS_TASKID_SOLVE_POST]", e);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
