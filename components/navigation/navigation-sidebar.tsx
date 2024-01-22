import {
  Binary,
  BookA,
  FunctionSquare,
  Home,
  Plus,
  SigmaSquare,
  Users
} from "lucide-react";
import { Lessons, Role } from "@prisma/client";

import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskSearch } from "../task/task-search";
import { UserButton } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const LessonsToItems = {
	[Lessons.Math]: <SigmaSquare className="h-[32px] w-[32px]" />,
	[Lessons.Physics]: <FunctionSquare className="h-[32px] w-[32px]" />,
	[Lessons.Russian]: <BookA className="h-[32px] w-[32px]" />,
	[Lessons.ComputerScience]: <Binary className="h-[32px] w-[32px]" />,
};

export const NavigationSidebar = async () => {
	const profile = await currentProfile();

	if (!profile) return redirect("/");

	const isAdmin = profile.role !== Role.USER;

	let tasks;
	if (isAdmin)
		tasks = await db.task.findMany({
			where: {
				authorId: profile.id,
			},
		});

	let profiles;
	if (profile.role === Role.CREATOR)
		profiles = await db.profile.findMany({
			orderBy: {
				role: "desc",
			},
		});

	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-zinc-100 dark:bg-[#1e1f21] py-3">
			<div>
				<NavigationItem
					lesson={"home"}
					name={"Домашняя страница"}
					content={<Home className="h-[32px] w-[32px]" />}
				/>
			</div>
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto mb-4" />

			<ScrollArea className="flex-1 w-full">
				{Object.values(Lessons).map((lesson) => (
					<div key={lesson} className="mb-4">
						<NavigationItem
							lesson={lesson}
							name={lesson ?? "Домашняя страница"}
							content={LessonsToItems[lesson ?? ""]}
						/>
					</div>
				))}
				{isAdmin && (
					<div className="flex flex-col gap-2">
						<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto mb-4" />
						<div>
							<NavigationAction
								icon={
									<Plus
										className="group-hover:text-white transition text-emerald-500"
										size={25}
									/>
								}
								label={"Добавить Задачу"}
								action={"createTask"}
							/>
						</div>
						<TaskSearch data={tasks} />
						{profile.role === Role.CREATOR && <NavigationAction
							icon={
								<Users
									className="group-hover:text-white transition"
									size={25}
								/>
							}
							label={"Управлять пользователями"}
							action={"profiles"}
							data={{ profiles }}
						/>}
					</div>
				)}
			</ScrollArea>

			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton
					afterSignOutUrl="/"
					appearance={{
						elements: {
							avatarBox: "h-[48px] w-[48px]",
						},
					}}
				/>
			</div>
		</div>
	);
};
