import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Lessons, Profile, Task } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";

import { ActionTooltip } from "./action-tooltip";
import { Check } from "lucide-react";
import { lessonsToRussian } from "@/lib/utils";

interface TaskCardProps {
	title: string;
	description: string;
	difficulty: number;
	points: number;
	lesson: Lessons;
	author: Profile;
	id: string;
	completed: boolean;
	created: boolean;
}

export const TaskCard = ({
	title,
	description,
	difficulty,
	points,
	lesson,
	author,
	id,
	completed,
	created,
}: TaskCardProps) => {
	const router = useRouter();

	const onClick = () => {
		router.push(`/tasks/${id}`);
	};

	return (
		<Card className="bg-zinc-100 dark:bg-[#1e1f21] hover:bg-zinc-350/2 hover:dark:bg-[#212128] hover:cursor-pointer" onClick={onClick}>
      {completed && (
				<ActionTooltip label={"Вы уже прошли эту задачу!"} capitalize={false}>
          <div className="absolute w-5 bg-emerald-500 h-5 rounded-tl-md rounded-br-sm" />
				</ActionTooltip>
			)}
            {created && (
				<ActionTooltip label={"Вы создатель этой задачи"} capitalize={false}>
          <div className="absolute w-5 bg-slate-400 h-5 rounded-tl-md rounded-br-sm" />
				</ActionTooltip>
			)}
			<CardHeader>
				<CardTitle className="mb-1">
					<div className="flex justify-between gap-2">
						<div className="flex gap-1">
							<span className="">{title}</span>
						</div>
						<ActionTooltip
							label={author.email}
							align="end"
							capitalize={false}
						>
							<span className="text-s font-thin dark:text-[#a59aa5] capitalize">
								{author.name}
							</span>
						</ActionTooltip>
					</div>
				</CardTitle>
				<CardDescription className="text-wrap max-w-full h-full">
					{description.length > 300
						? description.slice(0, 300).trim() + "..."
						: description}
				</CardDescription>
				<CardContent className="flex">
					<span className="text-[16px] font-thin">
						{lessonsToRussian(lesson)}
					</span>
				</CardContent>
				<CardFooter className="p-0 flex justify-between">
					<span className="pr text-[18px] font-semibold">
						Очков: {points}
					</span>
					<span>
						Сложность:{" "}
						<span
							style={{
								color: `#${Math.floor(
									(255 / 10) * difficulty
								).toString(16)}4544`,
							}}
						>
							{difficulty}
						</span>
						/10
					</span>
				</CardFooter>
			</CardHeader>
		</Card>
	);
};
