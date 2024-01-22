import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { profileId: string } }
) {
	try {
		const profile = await currentProfile();

		const { role } = await req.json();

		if (!profile) return new NextResponse("Unauthorized", { status: 401 });
		if (!role) return new NextResponse("No role", { status: 400 });
		if (profile.role !== Role.CREATOR)
			return new NextResponse("Not enough rights", { status: 400 });

		const newProfile = await db.profile.update({
			where: { id: params.profileId },
			data: {
        role
      },
		});
    
		return NextResponse.json(newProfile);
	} catch (e) {
		console.log("[PROFILES_PROFILE_ID_PATCH]", e);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
