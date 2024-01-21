import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!params.taskId)
			return new NextResponse("No task id", { status: 400 });
		return NextResponse.json(
			await db.task.delete({
				where: {
					authorId: profile.id,
					id: params.taskId,
				},
			})
		);
	} catch (e) {
		console.log("[API_TASKS_[TASKID]_DELETE", e);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const profile = await currentProfile();
    const values = await req.json();
		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.taskId) return new NextResponse("No task id", {status: 400});
		return NextResponse.json(
			await db.task.update({
				where: {
					authorId: profile.id,
					id: params.taskId,
				},
        data: values,
			})
		);
	} catch (e) {
		console.log("[API_TASKS_[TASKID]_DELETE", e);
	}
}
