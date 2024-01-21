import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { TaskValues } from "@/types";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
    const taskValues: TaskValues = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", {status: 401});
    if (profile.role === Role.USER) return new NextResponse("Not admin", {status: 401});

    return NextResponse.json(await  db.task.create({
        data: {
          ...taskValues,
          authorId: profile.id,
        }
      }));
	} catch (e) {
		console.log("[TASKS_POST]", e);
    return new NextResponse("Internal Error", {status: 500})
	}
}
